import { MediaItem } from "@/data/projects";

const prefetchedUrls = new Set<string>();

export function resolveMediaUrl(src: string): string {
  if (src.startsWith("/images")) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `/images${normalized}`;
}

function mediaKindFromSrc(src: string): "image" | "video" {
  const lower = src.toLowerCase();
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".ogg")
  ) {
    return "video";
  }
  return "image";
}

export function prefetchMediaUrl(url: string): void {
  if (typeof window === "undefined" || prefetchedUrls.has(url)) return;
  prefetchedUrls.add(url);

  const kind = mediaKindFromSrc(url);

  if (kind === "image") {
    const img = new Image();
    img.src = url;
    return;
  }

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "video";
  link.href = url;
  document.head.appendChild(link);
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

export function getUrlsFromSlide(slide: MediaItem): string[] {
  if (typeof slide === "string") {
    return [resolveMediaUrl(slide)];
  }

  if (Array.isArray(slide)) {
    return slide.map((img) =>
      resolveMediaUrl(typeof img === "string" ? img : img.src)
    );
  }

  if (typeof slide === "object" && "type" in slide) {
    if (slide.type === "image" || slide.type === "video") {
      return [resolveMediaUrl(slide.src)];
    }
    if (slide.type === "images") {
      return slide.srcs.map((src) =>
        resolveMediaUrl(typeof src === "string" ? src : src.src)
      );
    }
    if (slide.type === "videos") {
      return slide.srcs.map((src) =>
        resolveMediaUrl(typeof src === "string" ? src : src.src)
      );
    }
  }

  return [];
}

export function prefetchSlide(slide: MediaItem): void {
  getUrlsFromSlide(slide).forEach(prefetchMediaUrl);
}

export function prefetchSlides(slides: MediaItem[]): void {
  slides.forEach(prefetchSlide);
}

export function prefetchAllProjectHeroes(
  projects: Record<string, { images?: MediaItem[] }>
): void {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  Object.values(projects).forEach((project) => {
    const slides = getFlattenedSlides(project.images ?? [], isMobile);
    if (slides[0]) prefetchSlide(slides[0]);
  });
}
