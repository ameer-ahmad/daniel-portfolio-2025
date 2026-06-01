"use client";

type MediaVideoProps = {
  src: string;
  objectPosition?: string;
  backgroundColor?: string;
  className?: string;
};

function resolveLocalVideoUrl(src: string): string {
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return `/images${normalized}`;
}

export default function MediaVideo({
  src,
  objectPosition = "center",
  backgroundColor = "#ffffff",
  className,
}: MediaVideoProps) {
  const wrapperClass =
    className ??
    "absolute inset-0 flex items-center justify-center overflow-hidden";

  return (
    <div className={wrapperClass} style={{ backgroundColor }}>
      <video
        src={resolveLocalVideoUrl(src)}
        autoPlay
        loop
        muted
        playsInline
        className="max-h-full max-w-full object-contain"
        style={{
          objectPosition,
          backgroundColor,
        }}
      />
    </div>
  );
}
