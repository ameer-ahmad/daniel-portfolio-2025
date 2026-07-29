const VIMEO_URL = /^https?:\/\/(?:www\.)?(?:player\.)?vimeo\.com\//i;

export const VIMEO_PLAYER_ORIGIN = "https://player.vimeo.com";

export type VimeoRef = {
  id: string;
  hash?: string;
};

export function isVimeoUrl(src: string): boolean {
  return VIMEO_URL.test(src);
}

export function parseVimeoUrl(src: string): VimeoRef | null {
  if (!isVimeoUrl(src)) return null;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  const idIndex = pathParts[0] === "video" ? 1 : 0;
  const id = pathParts[idIndex];
  if (!id) return null;

  const hash = url.searchParams.get("h") ?? pathParts[idIndex + 1];

  return { id, hash: hash || undefined };
}

/**
 * The embed URL must be stable for a given source: changing an iframe's `src`
 * tears down the player and restarts the whole bootstrap, which is exactly the
 * stall we are trying to avoid. Playback is controlled over postMessage instead.
 */
export function buildVimeoEmbedUrl(src: string): string | null {
  const ref = parseVimeoUrl(src);
  if (!ref) return null;

  const params = new URLSearchParams(new URL(src).search);
  if (ref.hash) params.set("h", ref.hash);

  params.set("autoplay", "1");
  params.set("loop", "1");
  params.set("muted", "1");
  params.set("background", "1");
  params.set("autopause", "0");
  params.set("dnt", "1");
  params.set("title", "0");
  params.set("byline", "0");
  params.set("portrait", "0");

  return `${VIMEO_PLAYER_ORIGIN}/video/${ref.id}?${params.toString()}`;
}
