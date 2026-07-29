import generated from "@/data/generated/mediaManifest.json";

export type ImageVariant = {
  url: string;
  width: number;
};

export type ImageEntry = {
  width: number;
  height: number;
  variants: ImageVariant[];
  blurDataURL?: string;
};

/**
 * Posters point at the original still; its responsive variants live in `images`
 * under the same URL, because the poster files sit inside public/images too.
 */
export type PosterEntry = {
  url: string;
  width: number;
  height: number;
};

type MediaManifest = {
  images: Record<string, ImageEntry>;
  posters: Record<string, PosterEntry>;
};

const manifest = generated as unknown as MediaManifest;

/**
 * Lookups are keyed by the original public URL (e.g. "/images/covers.jpg") and
 * return null until `npm run media` has generated derivatives, so every caller
 * degrades to the untouched source file.
 */
export function getImageEntry(url: string): ImageEntry | null {
  return manifest.images[url] ?? null;
}

export function getPosterEntry(videoId: string): PosterEntry | null {
  return manifest.posters[videoId] ?? null;
}

export function buildSrcSet(variants: ImageVariant[]): string {
  return variants.map((variant) => `${variant.url} ${variant.width}w`).join(", ");
}

export function largestVariantUrl(variants: ImageVariant[], fallback: string): string {
  if (variants.length === 0) return fallback;
  return variants.reduce((widest, variant) =>
    variant.width > widest.width ? variant : widest
  ).url;
}

/**
 * Blurred placeholders sit behind the image, so they only help for formats that
 * fill their box. Transparent PNG cutouts would show a smeared halo instead.
 */
export function supportsBlurPlaceholder(url: string): boolean {
  return /\.jpe?g$/i.test(url);
}
