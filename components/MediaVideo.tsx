"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MediaImage from "@/components/MediaImage";
import { getPosterEntry } from "@/app/(lib)/mediaManifest";
import { imageSizes, resolveMediaUrl } from "@/app/(lib)/mediaSlides";
import {
  buildVimeoEmbedUrl,
  parseVimeoUrl,
  VIMEO_PLAYER_ORIGIN,
} from "@/app/(lib)/vimeo";

type MediaVideoProps = {
  src: string;
  objectPosition?: string;
  className?: string;
  /**
   * When false the player is still mounted and buffering, but held paused. This
   * is what lets a neighbouring slide be ready before the user reaches it.
   */
  active?: boolean;
  priority?: boolean;
  /** Overrides the generated poster from the manifest. */
  poster?: string;
  /** Must match what the prefetcher used, or the warmed variant goes unused. */
  posterSizes?: string;
};

/** How long to wait for a playback event before assuming the poster is stale. */
const POSTER_FALLBACK_MS = 1500;

export default function MediaVideo({
  src,
  objectPosition = "center",
  className,
  active = true,
  priority = false,
  poster,
  posterSizes,
}: MediaVideoProps) {
  const wrapperClass =
    className ??
    "absolute inset-0 flex items-center justify-center overflow-hidden";

  const vimeoRef = parseVimeoUrl(src);
  const vimeoEmbedUrl = vimeoRef ? buildVimeoEmbedUrl(src) : null;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const [posterExpired, setPosterExpired] = useState(false);
  /**
   * Monotonic: once real frames have been on screen, the poster is never shown
   * again. Otherwise pausing a neighbouring slide would flash it back in.
   */
  const [hasPlayed, setHasPlayed] = useState(false);

  const posterUrl =
    poster ?? (vimeoRef ? getPosterEntry(vimeoRef.id)?.url ?? null : null);

  const postToPlayer = useCallback((method: string, value?: string) => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      VIMEO_PLAYER_ORIGIN
    );
  }, []);

  useEffect(() => {
    if (!vimeoEmbedUrl) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== VIMEO_PLAYER_ORIGIN) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      let payload: { event?: string };
      try {
        payload =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (payload?.event === "ready") {
        setPlayerReady(true);
        postToPlayer("addEventListener", "play");
        return;
      }
      if (payload?.event === "play") setHasPlayed(true);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [vimeoEmbedUrl, postToPlayer]);

  // `frameLoaded` is a second chance at control: if the ready handshake is
  // missed, an already-loaded player still accepts commands.
  useEffect(() => {
    if (!vimeoEmbedUrl) return;
    if (!playerReady && !frameLoaded) return;
    postToPlayer(active ? "play" : "pause");
  }, [active, playerReady, frameLoaded, vimeoEmbedUrl, postToPlayer]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active]);

  // Some embeds never report playback at all (blocked autoplay, throttled
  // events). Uncover the player anyway rather than stranding a poster over it.
  useEffect(() => {
    if (!active || hasPlayed) return;
    if (!playerReady && !frameLoaded) return;
    const timer = setTimeout(() => setPosterExpired(true), POSTER_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [active, hasPlayed, playerReady, frameLoaded]);

  const showPoster = !hasPlayed && !posterExpired;

  return (
    <div className={wrapperClass} >
      {vimeoEmbedUrl ? (
        <iframe
          ref={iframeRef}
          src={vimeoEmbedUrl}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={() => setFrameLoaded(true)}
          className="h-full w-full border-0"
        />
      ) : (
        <video
          ref={videoRef}
          src={resolveMediaUrl(src)}
          poster={posterUrl ?? undefined}
          autoPlay={active}
          preload={active ? "auto" : "metadata"}
          loop
          muted
          playsInline
          onPlaying={() => setHasPlayed(true)}
          className="max-h-full max-w-full object-contain"
          style={{
            objectPosition,
          }}
        />
      )}

      {/* Only the iframe needs an overlay; a native <video> has `poster`. */}
      {posterUrl && vimeoEmbedUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{ opacity: showPoster ? 1 : 0 }}
        >
          <MediaImage
            src={posterUrl}
            alt=""
            sizes={posterSizes ?? imageSizes(1)}
            priority={priority}
            objectPosition={objectPosition}
          />
        </div>
      )}
    </div>
  );
}
