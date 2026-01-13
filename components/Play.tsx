"use client";

import { playArray } from "@/data/play";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMobileUI } from "@/app/(lib)/stores/useMobileUI";
import { MediaItem } from "@/data/projects";

export default function Play() {
  const { currentPlayIndex, setCurrentPlayIndex } = useMobileUI();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync local state with store
  useEffect(() => {
    setCurrentIndex(currentPlayIndex);
  }, [currentPlayIndex]);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [nextArrowDirection, setNextArrowDirection] = useState<"up" | "down">(
    "up"
  );
  const [prevArrowDirection, setPrevArrowDirection] = useState<"up" | "down">(
    "down"
  );

  // Resolve the primary media to display for the current play item
  const normalizeImageItem = (
    img: { src: string; aspectRatio?: string } | string
  ): MediaItem => {
    if (typeof img === "string") return img;
    return { type: "image", src: img.src, aspectRatio: img.aspectRatio };
  };

  const getPrimaryMedia = (media?: MediaItem[]): MediaItem | null => {
    if (!media || media.length === 0) return null;
    const first = media[0];
    if (Array.isArray(first))
      return first[0] ? normalizeImageItem(first[0]) : null;
    if (
      typeof first === "object" &&
      "type" in first &&
      first.type === "images"
    ) {
      const firstSrc = first.srcs[0];
      return firstSrc ? normalizeImageItem(firstSrc) : null;
    }
    if (
      typeof first === "object" &&
      "type" in first &&
      first.type === "videos"
    ) {
      const src = first.srcs[0];
      if (!src) return null;
      return {
        type: "video",
        src: typeof src === "string" ? src : src.src,
        aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
      };
    }
    if (typeof first === "object" && "type" in first) return first;
    if (typeof first === "string") return normalizeImageItem(first);
    return normalizeImageItem(first);
  };

  const renderMedia = (item: MediaItem) => {
    const basePath =
      process.env.NODE_ENV === "development"
        ? "/images"
        : "/daniel-portfolio-2025/images";

    // Helper to normalize src string
    const resolveSrc = (src: string) => `${basePath}${src}`;

    // Video object
    if (
      typeof item === "object" &&
      !Array.isArray(item) &&
      "type" in item &&
      item.type === "video"
    ) {
      return (
        <video
          src={resolveSrc(item.src)}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        />
      );
    }

    // Image object
    if (
      typeof item === "object" &&
      !Array.isArray(item) &&
      "type" in item &&
      item.type === "image"
    ) {
      return (
        <Image
          src={resolveSrc(item.src)}
          alt={item.src}
          fill
          className="object-contain"
          priority
        />
      );
    }

    // Array of images (take first)
    if (Array.isArray(item)) {
      const src = typeof item[0] === "string" ? item[0] : item[0]?.src;
      if (!src) return null;
      return (
        <Image
          src={resolveSrc(src)}
          alt={src}
          fill
          className="object-contain"
          priority
        />
      );
    }

    // Fallback string image
    if (typeof item === "string") {
      return (
        <Image
          src={resolveSrc(item)}
          alt={item}
          fill
          className="object-contain"
          priority
        />
      );
    }

    // Fallback for videos/images with srcs arrays: choose first available
    if (typeof item === "object" && "type" in item && item.type === "videos") {
      const src =
        typeof item.srcs[0] === "string" ? item.srcs[0] : item.srcs[0]?.src;
      if (!src) return null;
      return (
        <video
          src={resolveSrc(src)}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        />
      );
    }

    if (typeof item === "object" && "type" in item && item.type === "images") {
      const src =
        typeof item.srcs[0] === "string" ? item.srcs[0] : item.srcs[0]?.src;
      if (!src) return null;
      return (
        <Image
          src={resolveSrc(src)}
          alt={src}
          fill
          className="object-contain"
          priority
        />
      );
    }

    return null;
  };

  const nextImage = () => {
    setCurrentIndex((prev) => {
      const isLastImage = prev === playArray.length - 1;
      setNextArrowDirection(isLastImage ? "down" : "up");
      const newIndex = (prev + 1) % playArray.length;
      return newIndex;
    });
    // Calculate newIndex outside updater to avoid calling setCurrentPlayIndex during render
    const newIndex = (currentIndex + 1) % playArray.length;
    setCurrentPlayIndex(newIndex);
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    setCurrentIndex((prev) => {
      const isFirstImage = prev === 0;
      setPrevArrowDirection(isFirstImage ? "up" : "down");
      const newIndex = (prev - 1 + playArray.length) % playArray.length;
      return newIndex;
    });
    // Calculate newIndex outside updater to avoid calling setCurrentPlayIndex during render
    const newIndex = (currentIndex - 1 + playArray.length) % playArray.length;
    setCurrentPlayIndex(newIndex);
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const currentItem = playArray[currentIndex];
  const primaryMedia = getPrimaryMedia(currentItem.images);

  return (
    <div className="relative p-[80px] w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {primaryMedia && renderMedia(primaryMedia)}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={prevImage}
        className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-play"
        aria-label="Previous image"
      ></button>
      <button
        onClick={nextImage}
        className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-play"
        aria-label="Next image"
      ></button>
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute hidden md:block top-0 left-0 text-white text-sm flex justify-between w-full p-[20px]"
        >
          <span className="relative font-[600]">
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
                  } left-1 text-xs text-white`}
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
                  } left-1 text-xs text-white`}
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
          ></motion.span>
        </div>
      </AnimatePresence>
      <div
        key={currentIndex}
        className="absolute block md:hidden top-[20px] bg-[#f8f8f8] mobile-glow w-[52px] h-[26px] flex justify-center items-center rounded-full p-[4px] left-1/2 -translate-x-1/2 text-[#1c1c1c] text-sm z-20"
      >
        <span className="relative font-[600] pb-[2px] text-[#1c1c1c]/[0.38]">
          {String(currentIndex + 1).padStart(2, "0")}/
          {String(playArray.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
