"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MediaItem } from "@/data/projects";

export default function Project({
  project,
  firstProject,
}: {
  project: ProjectType[keyof ProjectType];
  firstProject: boolean;
}) {
  const { loadingDone } = useLoadingDone();
  const { activeId, resetCounter } = useActiveProject();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [nextArrowDirection, setNextArrowDirection] = useState<"up" | "down">(
    "up"
  );
  const [prevArrowDirection, setPrevArrowDirection] = useState<"up" | "down">(
    "down"
  );
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchEndYRef = useRef<number | null>(null);

  // Reset gallery index when project changes or NavBar is clicked (even if activeId doesn't change)
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeId, resetCounter]);

  // Mobile detection
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Flatten images array for mobile - each item in arrays becomes a separate slide
  const imagesArray = project.images || [];

  const flattenForMobile = (items: MediaItem[]): MediaItem[] => {
    if (!isMobile) return items;

    const flattened: MediaItem[] = [];

    items.forEach((item) => {
      // Handle videos type with multiple srcs
      if (
        typeof item === "object" &&
        !Array.isArray(item) &&
        "type" in item &&
        item.type === "videos"
      ) {
        item.srcs.forEach((src) => {
          flattened.push({
            type: "video",
            src: typeof src === "string" ? src : src.src,
            aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
          });
        });
      }
      // Handle images type with multiple srcs
      else if (
        typeof item === "object" &&
        !Array.isArray(item) &&
        "type" in item &&
        item.type === "images"
      ) {
        item.srcs.forEach((src) => {
          flattened.push({
            type: "image",
            src: typeof src === "string" ? src : src.src,
            aspectRatio: typeof src === "object" ? src.aspectRatio : undefined,
          });
        });
      }
      // Handle arrays of images
      else if (Array.isArray(item)) {
        item.forEach((img) => {
          // Convert ImageItem to MediaItem format
          if (typeof img === "string") {
            flattened.push(img);
          } else {
            flattened.push({
              type: "image",
              src: img.src,
              aspectRatio: img.aspectRatio,
            });
          }
        });
      }
      // Keep single items as-is
      else {
        flattened.push(item);
      }
    });

    return flattened;
  };

  const flattenedImages = flattenForMobile(imagesArray);

  const nextImage = () => {
    if (flattenedImages.length <= 1) return;
    setCurrentIndex((prev) => {
      const isLastImage = prev === flattenedImages.length - 1;
      setNextArrowDirection(isLastImage ? "down" : "up");
      return (prev + 1) % flattenedImages.length;
    });
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    if (flattenedImages.length <= 1) return;
    setCurrentIndex((prev) => {
      const isFirstImage = prev === 0;
      setPrevArrowDirection(isFirstImage ? "up" : "down");
      return (prev - 1 + flattenedImages.length) % flattenedImages.length;
    });
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const currentImageItem = flattenedImages[currentIndex];
  const isImageArray =
    Array.isArray(currentImageItem) &&
    (typeof currentImageItem[0] === "string" ||
      (typeof currentImageItem[0] === "object" &&
        "src" in currentImageItem[0]));
  const isVideoObject =
    typeof currentImageItem === "object" &&
    !Array.isArray(currentImageItem) &&
    "type" in currentImageItem &&
    currentImageItem.type === "video";
  const isVideosObject =
    typeof currentImageItem === "object" &&
    !Array.isArray(currentImageItem) &&
    "type" in currentImageItem &&
    currentImageItem.type === "videos";
  const isImageObject =
    typeof currentImageItem === "object" &&
    !Array.isArray(currentImageItem) &&
    "type" in currentImageItem &&
    currentImageItem.type === "image";
  const isImagesObject =
    typeof currentImageItem === "object" &&
    !Array.isArray(currentImageItem) &&
    "type" in currentImageItem &&
    currentImageItem.type === "images";

  // Type guards for TypeScript
  const videoItem = isVideoObject
    ? (currentImageItem as { type: "video"; src: string })
    : null;
  const videosItem = isVideosObject
    ? (currentImageItem as {
        type: "videos";
        srcs: (string | { src: string; aspectRatio?: string })[];
      })
    : null;
  const imageItem = isImageObject
    ? (currentImageItem as { type: "image"; src: string; aspectRatio?: string })
    : null;
  const imagesItem = isImagesObject
    ? (currentImageItem as {
        type: "images";
        srcs: (string | { src: string; aspectRatio?: string })[];
      })
    : null;

  // Helper function to parse aspect ratio and calculate flex value
  const getAspectRatioValue = (aspectRatio?: string): number => {
    if (!aspectRatio) return 1; // Default to equal width
    const [width, height] = aspectRatio.split(":").map(Number);
    if (!width || !height) return 1;
    return width / height; // Return the ratio (wider videos get higher values)
  };

  // Calculate flex values for videos based on aspect ratios
  const getVideoFlexValue = (
    videoItem: string | { src: string; aspectRatio?: string },
    allVideos: (string | { src: string; aspectRatio?: string })[]
  ): number => {
    const aspectRatio =
      typeof videoItem === "string" ? undefined : videoItem.aspectRatio;
    const thisRatio = getAspectRatioValue(aspectRatio);

    // If no aspect ratios specified, default to equal width
    const hasAnyAspectRatios = allVideos.some(
      (v) => typeof v !== "string" && v.aspectRatio
    );
    if (!hasAnyAspectRatios) return 1;

    // Calculate relative flex based on aspect ratios
    const totalRatio = allVideos.reduce((sum, v) => {
      const ratio =
        typeof v === "string" ? 1 : getAspectRatioValue(v.aspectRatio);
      return sum + ratio;
    }, 0);

    // Return proportional flex value (normalize to reasonable range)
    return (thisRatio / totalRatio) * allVideos.length;
  };

  // Calculate flex values for images based on aspect ratios (same logic as videos)
  const getImageFlexValue = (
    imageItem: string | { src: string; aspectRatio?: string },
    allImages: (string | { src: string; aspectRatio?: string })[]
  ): number => {
    const aspectRatio =
      typeof imageItem === "string" ? undefined : imageItem.aspectRatio;
    const thisRatio = getAspectRatioValue(aspectRatio);

    // If no aspect ratios specified, default to equal width
    const hasAnyAspectRatios = allImages.some(
      (img) => typeof img !== "string" && img.aspectRatio
    );
    if (!hasAnyAspectRatios) return 1;

    // Calculate relative flex based on aspect ratios
    const totalRatio = allImages.reduce((sum, img) => {
      const ratio =
        typeof img === "string" ? 1 : getAspectRatioValue(img.aspectRatio);
      return sum + ratio;
    }, 0);

    // Return proportional flex value (normalize to reasonable range)
    return (thisRatio / totalRatio) * allImages.length;
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (!isMobile) return;
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchEndXRef.current = null;
    touchEndYRef.current = null;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (!isMobile) return;
    const touch = event.touches[0];
    touchEndXRef.current = touch.clientX;
    touchEndYRef.current = touch.clientY;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
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

  return (
    <motion.div
      initial={{ opacity: 0, x: "-160px" }}
      animate={{ opacity: loadingDone ? 1 : 0, x: loadingDone ? 0 : "-160px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
      className={`w-screen clip-content md:w-[calc(100vw-200px)] lg:w-[calc(100vw-286px)] h-full shadow-glow  px-[20px] ${firstProject ? "pt-[66px]" : "pt-[126px]"} pb-[102px] xl:p-[80px] ${firstProject ? "pt-[auto]" : "xl:pt-[146px]"} ${firstProject ? "pt-[auto]" : "lg:pt-[106px]"} lg:p-[40px] bg-white relative`}
    >
      {flattenedImages.length > 1 && (
        <>
          <AnimatePresence mode="wait">
            <div
              key={currentIndex}
              className={`absolute hidden md:block ${firstProject ? "top-[20px]" : "top-[80px]"} left-[20px] text-[#1c1c1c] text-sm z-20`}
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
                      } left-1 text-xs text-[#1c1c1c]`}
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
                      } left-1 text-xs text-[#1c1c1c]`}
                    >
                      {prevArrowDirection === "up" ? "▲" : "▼"}
                    </motion.span>
                  )}
                </AnimatePresence>
                {String(currentIndex + 1).padStart(2, "0")}/
                {String(flattenedImages.length).padStart(2, "0")}
              </span>
            </div>
          </AnimatePresence>
          <div
            key={currentIndex}
            className={`absolute block md:hidden ${firstProject ? "top-[20px]" : "top-[80px]"} bg-[#f8f8f8] mobile-glow w-[52px] h-[26px] flex justify-center items-center rounded-full p-[4px] left-1/2 -translate-x-1/2 text-[#1c1c1c] text-sm z-20`}
          >
            <span className="relative font-[600] pb-[2px] text-[#1c1c1c]/[0.38]">
              {String(currentIndex + 1).padStart(2, "0")}/
              {String(flattenedImages.length).padStart(2, "0")}
            </span>
          </div>
        </>
      )}
      <div
        className="w-full h-full relative touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            {isVideosObject && videosItem ? (
              <div className="w-full h-full flex xl:gap-[40px] gap-[20px]">
                {videosItem.srcs.map((videoItem, idx) => {
                  const videoSrc =
                    typeof videoItem === "string" ? videoItem : videoItem.src;
                  const flexValue = getVideoFlexValue(
                    videoItem,
                    videosItem.srcs
                  );
                  const isTwoItems = videosItem.srcs.length === 2;
                  const objectPosition = isTwoItems
                    ? idx === 0
                      ? "right center"
                      : "left center"
                    : "center";
                  return (
                    <div
                      key={idx}
                      className="relative"
                      style={{ flex: flexValue }}
                    >
                      <video
                        src={`${
                          process.env.NODE_ENV === "development"
                            ? "/"
                            : "/"
                        }images${videoSrc}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ objectPosition }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : isVideoObject && videoItem ? (
              <div className="relative w-full h-full">
                <video
                  src={`${
                    process.env.NODE_ENV === "development"
                      ? "/"
                      : "/"
                  }images${videoItem.src}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            ) : isImagesObject && imagesItem ? (
              <div className="w-full h-full flex xl:gap-[40px] gap-[20px]">
                {imagesItem.srcs.map((imageItem, idx) => {
                  const imageSrc =
                    typeof imageItem === "string" ? imageItem : imageItem.src;
                  const flexValue = getImageFlexValue(
                    imageItem,
                    imagesItem.srcs
                  );
                  const isTwoItems = imagesItem.srcs.length === 2;
                  const objectPosition = isTwoItems
                    ? idx === 0
                      ? "right center"
                      : "left center"
                    : "center";
                  return (
                    <div
                      key={idx}
                      className="relative"
                      style={{ flex: flexValue }}
                    >
                      <Image
                        src={`${
                          process.env.NODE_ENV === "development"
                            ? "/"
                            : "/"
                        }images${imageSrc}`}
                        alt={`${project.title} - Image ${idx + 1}`}
                        fill
                        sizes="50%"
                        className="object-contain"
                        style={{ objectPosition }}
                        priority={
                          firstProject && currentIndex === 0 && idx === 0
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : isImageArray ? (
              <div className="w-full h-full flex xl:gap-[40px] gap-[20px]">
                {currentImageItem.map((img, idx) => {
                  const imageSrc = typeof img === "string" ? img : img.src;
                  const flexValue = getImageFlexValue(
                    img,
                    currentImageItem as (
                      | string
                      | { src: string; aspectRatio?: string }
                    )[]
                  );
                  const isTwoItems = currentImageItem.length === 2;
                  const objectPosition = isTwoItems
                    ? idx === 0
                      ? "right center"
                      : "left center"
                    : "center";
                  return (
                    <div
                      key={idx}
                      className="relative"
                      style={{ flex: flexValue }}
                    >
                      <Image
                        src={`${
                          process.env.NODE_ENV === "development"
                            ? "/"
                            : "/"
                        }images${imageSrc}`}
                        alt={`${project.title} - Image ${idx + 1}`}
                        fill
                        sizes="50%"
                        className="object-contain"
                        style={{ objectPosition }}
                        priority={
                          firstProject && currentIndex === 0 && idx === 0
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ) : isImageObject && imageItem ? (
              <Image
                src={`${
                  process.env.NODE_ENV === "development"
                    ? "/"
                    : "/"
                }images${imageItem.src}`}
                alt={project.title}
                fill
                sizes="100%"
                className="object-contain"
                priority={firstProject && currentIndex === 0}
              />
            ) : (
              <Image
                src={`${
                  process.env.NODE_ENV === "development"
                    ? "/"
                    : "/"
                }images${currentImageItem}`}
                alt={project.title}
                fill
                sizes="100%"
                className="object-contain"
                priority={firstProject && currentIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {flattenedImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-project"
            aria-label="Previous image"
          ></button>
          <button
            onClick={nextImage}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-project"
            aria-label="Next image"
          ></button>
        </>
      )}
    </motion.div>
  );
}
