"use client";

import { playArray } from "@/data/play";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, useRef } from "react";
import { useMobileUI } from "@/app/(lib)/stores/useMobileUI";
import { MediaItem } from "@/data/projects";
import {
  PREFETCH_PRIORITY,
  prefetchSlide,
  prefetchSlides,
} from "@/app/(lib)/mediaSlides";
import { useMountedSlides } from "@/app/(lib)/useMountedSlides";
import ProjectSlide from "@/components/ProjectSlide";

function normalizeImageItem(
  img: { src: string; aspectRatio?: string } | string
): MediaItem {
  if (typeof img === "string") return img;
  return { type: "image", src: img.src, aspectRatio: img.aspectRatio };
}

/** Each Play entry shows a single piece of media: the first one it declares. */
function getPrimaryMedia(media?: MediaItem[]): MediaItem | null {
  if (!media || media.length === 0) return null;
  const first = media[0];

  if (Array.isArray(first)) {
    return first[0] ? normalizeImageItem(first[0]) : null;
  }

  if (typeof first === "string") return normalizeImageItem(first);

  if ("type" in first) {
    if (first.type === "images") {
      const firstSrc = first.srcs[0];
      return firstSrc ? normalizeImageItem(firstSrc) : null;
    }
    if (first.type === "videos") {
      const src = first.srcs[0];
      if (!src) return null;
      return {
        type: "video",
        src: typeof src === "string" ? src : src.src,
        aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
      };
    }
    return first;
  }

  return null;
}

export default function Play() {
  const { currentPlayIndex, setCurrentPlayIndex } = useMobileUI();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [nextArrowDirection, setNextArrowDirection] = useState<"up" | "down">(
    "up"
  );
  const [prevArrowDirection, setPrevArrowDirection] = useState<"up" | "down">(
    "down"
  );
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchEndYRef = useRef<number | null>(null);

  // Sync local state with store
  useEffect(() => {
    setCurrentIndex(currentPlayIndex);
  }, [currentPlayIndex]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = useMemo(
    () => playArray.map((item) => getPrimaryMedia(item.images) ?? ""),
    []
  );

  const mountedIndices = useMountedSlides(slides, currentIndex, {
    enabled: true,
    mountNeighbours: true,
    allowVideoNeighbours: !isMobile,
  });

  useEffect(() => {
    const count = slides.length;
    if (count <= 1) return;

    prefetchSlide(slides[(currentIndex + 1) % count], PREFETCH_PRIORITY.adjacent);
    prefetchSlide(
      slides[(currentIndex - 1 + count) % count],
      PREFETCH_PRIORITY.adjacent
    );
    prefetchSlides(slides, PREFETCH_PRIORITY.nearby);
  }, [currentIndex, slides]);

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % playArray.length;
    setNextArrowDirection(currentIndex === playArray.length - 1 ? "down" : "up");
    setCurrentIndex(newIndex);
    setCurrentPlayIndex(newIndex);
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + playArray.length) % playArray.length;
    setPrevArrowDirection(currentIndex === 0 ? "up" : "down");
    setCurrentIndex(newIndex);
    setCurrentPlayIndex(newIndex);
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchEndXRef.current = touch.clientX;
    touchEndYRef.current = touch.clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      touchEndXRef.current === null ||
      touchEndYRef.current === null
    ) {
      return;
    }

    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const deltaY = touchStartYRef.current - touchEndYRef.current;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  const currentItem = playArray[currentIndex];

  return (
    <div className="relative px-[20px] pt-[66px] pb-[102px] xl:p-[80px] lg:p-[40px] w-full h-full flex items-center justify-center">
      <div
        className="relative w-full h-full touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {mountedIndices.map((index) => {
          const slide = slides[index];
          if (!slide) return null;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={index}
              className="absolute inset-0"
              style={{
                opacity: isCurrent ? 1 : 0,
                zIndex: isCurrent ? 2 : 1,
                pointerEvents: isCurrent ? undefined : "none",
              }}
              aria-hidden={!isCurrent}
            >
              <ProjectSlide
                slide={slide}
                title={playArray[index].title}
                active={isCurrent}
                priority={isCurrent}
                videoBackgroundColor="#000000"
              />
            </div>
          );
        })}
      </div>
      <button
        onClick={prevImage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-play"
        aria-label="Previous image"
      ></button>
      <button
        onClick={nextImage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-play"
        aria-label="Next image"
      ></button>
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute hidden md:flex top-0 left-0 text-black text-sm flex gap-[24px] w-full p-[20px]"
        >
          <span className="relative font-[400] text-[#000000]">
            <AnimatePresence>
              {showNextArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { delay: 0.2, duration: 0.2 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${
                    nextArrowDirection === "up" ? "-top-3" : "-bottom-3"
                  } left-1 text-xs text-black`}
                >
                  {nextArrowDirection === "up" ? "▲" : "▼"}
                </motion.span>
              )}
              {showPrevArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    transition: { delay: 0.2, duration: 0.2 },
                  }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${
                    prevArrowDirection === "up" ? "-top-3" : "-bottom-3"
                  } left-1 text-xs text-black`}
                >
                  {prevArrowDirection === "up" ? "▲" : "▼"}
                </motion.span>
              )}
            </AnimatePresence>
            {String(currentIndex + 1).padStart(2, "0")}/
            {String(playArray.length).padStart(2, "0")}
          </span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            dangerouslySetInnerHTML={{ __html: currentItem.title }}
            className="text-right"
          ></motion.span>
        </div>
      </AnimatePresence>
      <div
        key={currentIndex}
        className="absolute block md:hidden top-[20px] bg-[#1c1c1c] mobile-glow w-[52px] h-[26px] flex justify-center items-center rounded-full p-[4px] left-1/2 -translate-x-1/2 text-[#000000] text-sm z-20"
      >
        <span className="relative font-[400] pb-[2px] text-[#000000]/[0.38]">
          {String(currentIndex + 1).padStart(2, "0")}/
          {String(playArray.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
