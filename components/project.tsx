"use client";

import { ProjectType } from "@/data/projects";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  PREFETCH_PRIORITY,
  getFlattenedSlides,
  prefetchSlide,
  prefetchSlides,
} from "@/app/(lib)/mediaSlides";
import { useMountedSlides } from "@/app/(lib)/useMountedSlides";
import ProjectSlide from "@/components/ProjectSlide";

export default function Project({
  projectKey,
  project,
  firstProject,
  inWindow = true,
}: {
  projectKey: string;
  project: ProjectType[keyof ProjectType];
  firstProject: boolean;
  /**
   * False for projects far from the active one: the gallery stays in the tree
   * (the vertical scroll maths depends on its height) but loads no media.
   */
  inWindow?: boolean;
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
  const [isMobile, setIsMobile] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const touchEndYRef = useRef<number | null>(null);

  const isActiveProject = activeId === projectKey;

  // Reset gallery index when project changes or NavBar is clicked (even if activeId doesn't change)
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeId, resetCounter]);

  // Mobile detection
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const flattenedImages = useMemo(
    () => getFlattenedSlides(project.images ?? [], isMobile),
    [project.images, isMobile]
  );

  // Until the intro finishes, only the project on screen loads anything: every
  // other byte would be competing with the one image the user is waiting for.
  const mountedIndices = useMountedSlides(flattenedImages, currentIndex, {
    enabled: inWindow && (isActiveProject || loadingDone),
    mountNeighbours: isActiveProject && loadingDone,
    allowVideoNeighbours: !isMobile,
  });

  // Warm what a single click or swipe can reach first, then the rest of the project.
  useEffect(() => {
    if (!isActiveProject || flattenedImages.length <= 1) return;

    const count = flattenedImages.length;
    prefetchSlide(
      flattenedImages[(currentIndex + 1) % count],
      PREFETCH_PRIORITY.adjacent
    );
    prefetchSlide(
      flattenedImages[(currentIndex - 1 + count) % count],
      PREFETCH_PRIORITY.adjacent
    );
    prefetchSlides(flattenedImages, PREFETCH_PRIORITY.nearby);
  }, [isActiveProject, currentIndex, flattenedImages]);

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
              className={`absolute hidden md:block ${firstProject ? "top-[20px]" : "top-[80px]"} left-[20px] text-[#515151] text-sm z-20`}
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
                      } left-1 text-xs text-[#515151]`}
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
                      } left-1 text-xs text-[#515151]`}
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
            className={`absolute block md:hidden ${firstProject ? "top-[20px]" : "top-[80px]"} bg-[#f8f8f8] mobile-glow w-[52px] h-[26px] flex justify-center items-center rounded-full p-[4px] left-1/2 -translate-x-1/2 text-[#515151] text-sm z-20`}
          >
            <span className="relative font-[400] pb-[2px] text-[#000000]/[0.38]">
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
        {mountedIndices.map((index) => {
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
                slide={flattenedImages[index]}
                title={project.title}
                active={isCurrent && isActiveProject}
                priority={firstProject && index === 0}
              />
            </div>
          );
        })}
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
