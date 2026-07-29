"use client";

import Image from "next/image";
import { useState } from "react";
import {
  buildSrcSet,
  getImageEntry,
  largestVariantUrl,
  supportsBlurPlaceholder,
} from "@/app/(lib)/mediaManifest";

type MediaImageProps = {
  /** Resolved public URL, e.g. "/images/covers.jpg". */
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  objectPosition?: string;
  onReady?: () => void;
};

/**
 * Renders a responsive picture from pre-generated WebP variants when they exist,
 * and falls back to next/image against the original file when they do not. The
 * fallback matters: the site ships as a static export, so derivatives only exist
 * after `npm run media` has been run and committed.
 */
export default function MediaImage({
  src,
  alt,
  sizes,
  priority = false,
  objectPosition = "center",
  onReady,
}: MediaImageProps) {
  const entry = getImageEntry(src);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onReady?.();
  };

  if (!entry || entry.variants.length === 0) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        style={{ objectPosition }}
        priority={priority}
        onLoad={handleLoad}
      />
    );
  }

  const placeholder =
    !loaded && entry.blurDataURL && supportsBlurPlaceholder(src)
      ? entry.blurDataURL
      : null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- variants are already sized and encoded, so next/image has nothing left to optimize under `output: export`.
    <img
      src={largestVariantUrl(entry.variants, src)}
      srcSet={buildSrcSet(entry.variants)}
      sizes={sizes}
      alt={alt}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onLoad={handleLoad}
      className="absolute inset-0 h-full w-full object-contain"
      style={{
        objectPosition,
        ...(placeholder
          ? {
              backgroundImage: `url("${placeholder}")`,
              backgroundSize: "contain",
              backgroundPosition: objectPosition,
              backgroundRepeat: "no-repeat",
            }
          : {}),
      }}
    />
  );
}
