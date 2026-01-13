"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

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

  // Reset gallery index when project changes or NavBar is clicked (even if activeId doesn't change)
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeId, resetCounter]);

  // Flatten images array - handle both strings and arrays of strings
  const imagesArray = project.images || [];
  const flattenedImages = imagesArray;

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


  const currentImageItem = imagesArray[currentIndex];
  const isImageArray =
    Array.isArray(currentImageItem) && typeof currentImageItem[0] === "string";
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
    ? (currentImageItem as { type: "image"; src: string })
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
      className="overflow-y-clip w-[calc(100vw-286px)] h-[-webkit-fill-available] shadow-glow p-[80px] bg-white relative"
    >
      {flattenedImages.length > 1 && (
        <AnimatePresence mode="wait">
          <div
            key={currentIndex}
            className="absolute top-[20px] left-[20px] text-[#1c1c1c] text-sm z-20"
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
              {String(imagesArray.length).padStart(2, "0")}
            </span>
          </div>
        </AnimatePresence>
      )}
      <div className="w-full h-full relative">
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
              <div className="w-full h-full flex gap-[40px]">
                {videosItem.srcs.map((videoItem, idx) => {
                  const videoSrc =
                    typeof videoItem === "string" ? videoItem : videoItem.src;
                  const flexValue = getVideoFlexValue(
                    videoItem,
                    videosItem.srcs
                  );
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
                            : "/daniel-portfolio-2025/"
                        }images${videoSrc}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain"
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
                      : "/daniel-portfolio-2025/"
                  }images${videoItem.src}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : isImageArray ? (
              <div className="w-full h-full flex gap-[40px]">
                {currentImageItem.map((img, idx) => (
                  <div key={idx} className="relative flex-1">
                    <Image
                      src={`${
                        process.env.NODE_ENV === "development"
                          ? "/"
                          : "/daniel-portfolio-2025/"
                      }images${img}`}
                      alt={`${project.title} - Image ${idx + 1}`}
                      fill
                      sizes="50%"
                      className="object-contain"
                      priority={firstProject && currentIndex === 0 && idx === 0}
                    />
                  </div>
                ))}
              </div>
            ) : isImageObject && imageItem ? (
              <Image
                src={`${
                  process.env.NODE_ENV === "development"
                    ? "/"
                    : "/daniel-portfolio-2025/"
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
                    : "/daniel-portfolio-2025/"
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
            className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-project"
            aria-label="Previous image"
          ></button>
          <button
            onClick={nextImage}
            className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-project"
            aria-label="Next image"
          ></button>
        </>
      )}
    </motion.div>
  );
}
