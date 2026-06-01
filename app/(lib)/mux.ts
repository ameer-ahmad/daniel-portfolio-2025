import { getMuxPlaybackId } from "@/data/muxVideos";

export function resolveLocalVideoUrl(src: string): string {
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `/images${normalized}`;
}

export function getMuxStreamPrefetchUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}/low.mp4`;
}

export function getVideoPrefetchUrls(src: string): string[] {
  const playbackId = getMuxPlaybackId(src);
  if (playbackId) {
    return [getMuxStreamPrefetchUrl(playbackId)];
  }
  return [resolveLocalVideoUrl(src)];
}
