"use client";

import MediaImage from "@/components/MediaImage";
import MediaVideo from "@/components/MediaVideo";
import { imageSizes, resolveMediaUrl } from "@/app/(lib)/mediaSlides";
import { MediaItem } from "@/data/projects";

type Sized = string | { src: string; aspectRatio?: string };

function srcOf(item: Sized): string {
  return typeof item === "string" ? item : item.src;
}

function ratioOf(item: Sized): number {
  const aspectRatio = typeof item === "string" ? undefined : item.aspectRatio;
  if (!aspectRatio) return 1;
  const [width, height] = aspectRatio.split(":").map(Number);
  if (!width || !height) return 1;
  return width / height;
}

/**
 * Distributes row width by aspect ratio so a portrait mockup beside a landscape
 * one still reads as the same visual height.
 */
function flexFor(item: Sized, all: Sized[]): number {
  const hasRatios = all.some(
    (entry) => typeof entry !== "string" && entry.aspectRatio
  );
  if (!hasRatios) return 1;

  const total = all.reduce((sum, entry) => sum + ratioOf(entry), 0);
  return (ratioOf(item) / total) * all.length;
}

/** Pairs are nudged toward each other so the gap reads as a single composition. */
function objectPositionFor(index: number, count: number): string {
  if (count !== 2) return "center";
  return index === 0 ? "right center" : "left center";
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const rowClass = "w-full h-full flex xl:gap-[40px] gap-[20px]";

function ImageRow({
  items,
  title,
  priority,
}: {
  items: Sized[];
  title: string;
  priority: boolean;
}) {
  return (
    <div className={rowClass}>
      {items.map((item, index) => (
        <div
          key={`${srcOf(item)}-${index}`}
          className="relative"
          style={{ flex: flexFor(item, items) }}
        >
          <MediaImage
            src={resolveMediaUrl(srcOf(item))}
            alt={items.length > 1 ? `${title} — image ${index + 1}` : title}
            sizes={imageSizes(items.length)}
            priority={priority && index === 0}
            objectPosition={objectPositionFor(index, items.length)}
          />
        </div>
      ))}
    </div>
  );
}

type ProjectSlideProps = {
  slide: MediaItem;
  title: string;
  /** Drives video playback: inactive slides stay mounted and buffered but paused. */
  active: boolean;
  priority?: boolean;
  videoBackgroundColor?: string;
};

export default function ProjectSlide({
  slide,
  title,
  active,
  priority = false,
  videoBackgroundColor,
}: ProjectSlideProps) {
  const alt = plainText(title);

  if (slide == null) {
    return null;
  }

  if (typeof slide === "string") {
    return <ImageRow items={[slide]} title={alt} priority={priority} />;
  }

  if (Array.isArray(slide)) {
    return <ImageRow items={slide} title={alt} priority={priority} />;
  }

  if ("type" in slide) {
    if (slide.type === "image") {
      return <ImageRow items={[slide.src]} title={alt} priority={priority} />;
    }

    if (slide.type === "images") {
      return <ImageRow items={slide.srcs} title={alt} priority={priority} />;
    }

    if (slide.type === "video") {
      return (
        <div className="relative w-full h-full">
          <MediaVideo
            src={slide.src}
            active={active}
            priority={priority}
            backgroundColor={videoBackgroundColor}
            posterSizes={imageSizes(1)}
          />
        </div>
      );
    }

    if (slide.type === "videos") {
      return (
        <div className={rowClass}>
          {slide.srcs.map((item, index) => (
            <div
              key={`${srcOf(item)}-${index}`}
              className="relative"
              style={{ flex: flexFor(item, slide.srcs) }}
            >
              <MediaVideo
                src={srcOf(item)}
                active={active}
                priority={priority}
                backgroundColor={videoBackgroundColor}
                posterSizes={imageSizes(slide.srcs.length)}
                objectPosition={objectPositionFor(index, slide.srcs.length)}
              />
            </div>
          ))}
        </div>
      );
    }
  }

  return null;
}
