import { MediaItem } from "@/data/projects";
import {
  buildSrcSet,
  getImageEntry,
  getPosterEntry,
  largestVariantUrl,
} from "@/app/(lib)/mediaManifest";
import { isVimeoUrl, parseVimeoUrl } from "@/app/(lib)/vimeo";

export const PREFETCH_PRIORITY = {
  /** Media the user is looking at, or is about to be shown. */
  critical: 0,
  /** One gesture away: neighbouring slides, neighbouring projects. */
  adjacent: 1,
  /** Reachable in two steps. */
  nearby: 2,
  /** Everything else, only if the connection is idle and healthy. */
  idle: 3,
} as const;

/** Requests in flight at once. Kept low so speculative work never starves the visible slide. */
const MAX_IN_FLIGHT = 3;

export function resolveMediaUrl(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/images")) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `/images${normalized}`;
}

/**
 * Shared by the renderer and the prefetcher so both resolve to the same srcset
 * candidate. If these ever drift, prefetching silently downloads a file the
 * browser will not use.
 */
export function imageSizes(itemsInRow: number): string {
  if (itemsInRow <= 1) {
    return "(max-width: 767px) 100vw, (max-width: 1023px) calc(100vw - 200px), calc(100vw - 286px)";
  }
  return `(max-width: 767px) 100vw, (max-width: 1023px) calc((100vw - 200px) / ${itemsInRow}), calc((100vw - 286px) / ${itemsInRow})`;
}

export type MediaDescriptor =
  | { kind: "image"; url: string; sizes: string }
  | { kind: "video"; url: string }
  | {
      kind: "vimeo";
      src: string;
      videoId: string | null;
      posterSizes: string;
    };

function describeSource(src: string, itemsInRow: number): MediaDescriptor {
  if (isVimeoUrl(src)) {
    return {
      kind: "vimeo",
      src,
      videoId: parseVimeoUrl(src)?.id ?? null,
      posterSizes: imageSizes(itemsInRow),
    };
  }

  const url = resolveMediaUrl(src);

  if (/\.(mp4|webm|mov|ogg)$/i.test(url)) {
    return { kind: "video", url };
  }

  return { kind: "image", url, sizes: imageSizes(itemsInRow) };
}

function srcOf(item: string | { src: string }): string {
  return typeof item === "string" ? item : item.src;
}

export function describeSlide(slide: MediaItem): MediaDescriptor[] {
  if (typeof slide === "string") {
    return [describeSource(slide, 1)];
  }

  if (Array.isArray(slide)) {
    return slide.map((item) => describeSource(srcOf(item), slide.length));
  }

  if ("type" in slide) {
    if (slide.type === "image" || slide.type === "video") {
      return [describeSource(slide.src, 1)];
    }
    if (slide.type === "images") {
      return slide.srcs.map((item) =>
        describeSource(srcOf(item), slide.srcs.length)
      );
    }
    if (slide.type === "videos") {
      return slide.srcs.map((item) =>
        describeSource(srcOf(item), slide.srcs.length)
      );
    }
  }

  return [];
}

export function slideContainsVideo(slide: MediaItem): boolean {
  return describeSlide(slide).some(
    (descriptor) => descriptor.kind === "video" || descriptor.kind === "vimeo"
  );
}

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Speculative loading is a bandwidth bet. On metered or very slow connections
 * the bet costs more than it saves, so we decline it.
 */
export function speculativeLoadingAllowed(): boolean {
  if (typeof navigator === "undefined") return false;

  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  if (!connection) return true;
  if (connection.saveData) return false;

  return !/(^|-)2g$/.test(connection.effectiveType ?? "");
}

type QueuedTask = {
  priority: number;
  seq: number;
  run: () => Promise<void>;
};

const queue: QueuedTask[] = [];
/** Every URL ever requested, so nothing is fetched twice. */
const started = new Map<string, Promise<void>>();
/** Only the URLs still waiting, so a late urgent request can jump the line. */
const waiting = new Map<string, QueuedTask>();
let inFlight = 0;
let seq = 0;

function pump(): void {
  while (inFlight < MAX_IN_FLIGHT && queue.length > 0) {
    queue.sort((a, b) => a.priority - b.priority || a.seq - b.seq);
    const task = queue.shift();
    if (!task) return;

    inFlight += 1;
    task.run().then(
      () => {
        inFlight -= 1;
        pump();
      },
      () => {
        inFlight -= 1;
        pump();
      }
    );
  }
}

function schedule(
  key: string,
  priority: number,
  run: () => Promise<void>
): Promise<void> {
  const existing = started.get(key);
  if (existing) {
    // Already queued speculatively and now actually needed: move it forward
    // rather than waiting behind work for slides nobody is looking at.
    const pending = waiting.get(key);
    if (pending && priority < pending.priority) pending.priority = priority;
    return existing;
  }

  let settle: () => void = () => {};
  const promise = new Promise<void>((resolve) => {
    settle = resolve;
  });

  const task: QueuedTask = {
    priority,
    seq: seq++,
    run: () => {
      waiting.delete(key);
      return run().then(settle, settle);
    },
  };

  waiting.set(key, task);
  queue.push(task);
  started.set(key, promise);
  pump();

  return promise;
}

function loadImage(url: string, sizes: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const entry = getImageEntry(url);
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve();
    image.onerror = () => resolve();

    if (entry && entry.variants.length > 0) {
      // `sizes` must be assigned before `srcset` for the candidate the browser
      // picks here to match the one the rendered <img> picks.
      image.sizes = sizes;
      image.srcset = buildSrcSet(entry.variants);
      image.src = largestVariantUrl(entry.variants, url);
    } else {
      image.src = url;
    }
  });
}

function hintVideo(url: string): Promise<void> {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "video";
  link.href = url;
  document.head.appendChild(link);
  return Promise.resolve();
}

function loadDescriptor(
  descriptor: MediaDescriptor,
  priority: number
): Promise<void> {
  if (descriptor.kind === "image") {
    return schedule(descriptor.url, priority, () =>
      loadImage(descriptor.url, descriptor.sizes)
    );
  }

  if (descriptor.kind === "video") {
    return schedule(descriptor.url, priority, () => hintVideo(descriptor.url));
  }

  // A Vimeo player fetches its own media, so the only thing worth warming is
  // the poster frame that covers the player while it boots.
  const poster = descriptor.videoId ? getPosterEntry(descriptor.videoId) : null;
  if (!poster) return Promise.resolve();

  return schedule(poster.url, priority, () =>
    loadImage(poster.url, descriptor.posterSizes)
  );
}

export function prefetchSlide(
  slide: MediaItem,
  priority: number = PREFETCH_PRIORITY.adjacent
): void {
  if (!speculativeLoadingAllowed()) return;
  describeSlide(slide).forEach((descriptor) =>
    loadDescriptor(descriptor, priority)
  );
}

export function prefetchSlides(
  slides: MediaItem[],
  priority: number = PREFETCH_PRIORITY.adjacent
): void {
  if (!speculativeLoadingAllowed()) return;
  slides.forEach((slide) => prefetchSlide(slide, priority));
}

/**
 * Unlike `prefetchSlide`, this is a real dependency rather than a guess: it
 * ignores the connection heuristic and resolves once the bytes are decodable.
 */
export function loadSlide(slide: MediaItem): Promise<void> {
  return Promise.all(
    describeSlide(slide).map((descriptor) =>
      loadDescriptor(descriptor, PREFETCH_PRIORITY.critical)
    )
  ).then(() => undefined);
}

export function getFlattenedSlides(
  items: MediaItem[],
  isMobile: boolean
): MediaItem[] {
  if (!isMobile) return items;

  const flattened: MediaItem[] = [];

  items.forEach((item) => {
    if (
      typeof item === "object" &&
      !Array.isArray(item) &&
      "type" in item &&
      item.type === "videos"
    ) {
      item.srcs.forEach((src) => {
        flattened.push({
          type: "video",
          src: typeof src === "string" ? src : src.src,
          aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
        });
      });
    } else if (
      typeof item === "object" &&
      !Array.isArray(item) &&
      "type" in item &&
      item.type === "images"
    ) {
      item.srcs.forEach((src) => {
        flattened.push({
          type: "image",
          src: typeof src === "string" ? src : src.src,
          aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
        });
      });
    } else if (Array.isArray(item)) {
      item.forEach((img) => {
        if (typeof img === "string") {
          flattened.push(img);
        } else {
          flattened.push({
            type: "image",
            src: img.src,
            aspectRatio: img.aspectRatio,
          });
        }
      });
    } else {
      flattened.push(item);
    }
  });

  return flattened;
}

export function getProjectSlides(
  project: { images?: MediaItem[] } | undefined,
  isMobile: boolean
): MediaItem[] {
  if (!project) return [];
  return getFlattenedSlides(project.images ?? [], isMobile);
}

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

export function prefetchProjectHero(
  project: { images?: MediaItem[] } | undefined,
  priority: number = PREFETCH_PRIORITY.nearby
): void {
  const slides = getProjectSlides(project, isMobileViewport());
  if (slides[0]) prefetchSlide(slides[0], priority);
}

export function prefetchAllProjectHeroes(
  projects: Record<string, { images?: MediaItem[] }>,
  priority: number = PREFETCH_PRIORITY.idle
): void {
  Object.values(projects).forEach((project) =>
    prefetchProjectHero(project, priority)
  );
}
