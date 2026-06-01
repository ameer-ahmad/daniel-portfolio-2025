"use client";

import dynamic from "next/dynamic";
import { getMuxPlaybackId } from "@/data/muxVideos";
import { resolveLocalVideoUrl } from "@/app/(lib)/mux";

const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

type MediaVideoProps = {
  src: string;
  aspectRatio?: string;
  objectPosition?: string;
  /** Letterbox / player backdrop — match parent section */
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
};

function parseAspectRatio(aspectRatio?: string): { w: number; h: number } | null {
  if (!aspectRatio?.includes(":")) return null;
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return null;
  return { w, h };
}

function getAspectRatioBoxStyle(
  ratio: { w: number; h: number } | null
): React.CSSProperties {
  if (!ratio) {
    return { width: "100%", height: "100%" };
  }

  const { w, h } = ratio;
  return {
    aspectRatio: `${w} / ${h}`,
    width: `min(100cqw, calc(100cqh * ${w} / ${h}))`,
    height: `min(100cqh, calc(100cqw * ${h} / ${w}))`,
    flexShrink: 0,
  };
}

const playerFillStyle = {
  width: "100%",
  height: "100%",
  display: "block",
} as const;

const muxVars = (mediaPosition: string, backgroundColor: string) =>
  ({
    "--controls": "none",
    "--media-object-fit": "contain",
    "--media-object-position": mediaPosition,
    backgroundColor,
  }) as React.CSSProperties;

export default function MediaVideo({
  src,
  aspectRatio,
  objectPosition = "center",
  backgroundColor = "#ffffff",
  className,
  style,
}: MediaVideoProps) {
  const playbackId = getMuxPlaybackId(src);
  const ratio = parseAspectRatio(aspectRatio);
  const boxStyle = getAspectRatioBoxStyle(ratio);
  const mediaPosition = objectPosition;

  const wrapperClass =
    className ??
    "absolute inset-0 flex items-center justify-center overflow-hidden";

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    containerType: "size",
    ...style,
  };

  if (playbackId) {
    return (
      <div className={wrapperClass} style={containerStyle}>
        <div className="relative" style={boxStyle}>
          <MuxPlayer
            playbackId={playbackId}
            streamType="on-demand"
            autoPlay="muted"
            loop
            muted
            playsInline
            nocast
            nohotkeys
            style={{
              ...playerFillStyle,
              ...muxVars(mediaPosition, backgroundColor),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass} style={containerStyle}>
      <div className="relative" style={boxStyle}>
        <video
          src={resolveLocalVideoUrl(src)}
          autoPlay
          loop
          muted
          playsInline
          className="object-contain"
          style={{
            ...playerFillStyle,
            objectPosition: mediaPosition,
            backgroundColor,
          }}
        />
      </div>
    </div>
  );
}
