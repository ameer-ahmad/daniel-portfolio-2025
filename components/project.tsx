"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
  const [nextArrowDirection, setNextArrowDirection] = useState<"up" | "down">("up");
  const [prevArrowDirection, setPrevArrowDirection] = useState<"up" | "down">("down");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorSymbol, setCursorSymbol] = useState("◀");
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setCursorPos({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
      }
    };

    const handleMouseEnterPrev = () => {
      window.addEventListener("mousemove", handleMouseMove);
      setCursorVisible(true);
      setCursorSymbol("◀");
    };

    const handleMouseEnterNext = () => {
      window.addEventListener("mousemove", handleMouseMove);
      setCursorVisible(true);
      setCursorSymbol("▶");
    };

    const handleMouseLeave = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      setCursorVisible(false);
    };

    const prevButton = prevButtonRef.current;
    const nextButton = nextButtonRef.current;

    if (prevButton) {
      prevButton.addEventListener("mouseenter", handleMouseEnterPrev);
      prevButton.addEventListener("mouseleave", handleMouseLeave);
    }

    if (nextButton) {
      nextButton.addEventListener("mouseenter", handleMouseEnterNext);
      nextButton.addEventListener("mouseleave", handleMouseLeave);
    }

    

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (prevButton) {
        prevButton.removeEventListener("mouseenter", handleMouseEnterPrev);
        prevButton.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (nextButton) {
        nextButton.removeEventListener("mouseenter", handleMouseEnterNext);
        nextButton.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const currentImageItem = imagesArray[currentIndex];
  const isImageArray = Array.isArray(currentImageItem);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: "-160px" }}
      animate={{ opacity: loadingDone ? 1 : 0, x: loadingDone ? 0 : "-160px" }}
      transition={{
        type: "spring",
        stiffness: 40,
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
                    className={`absolute ${nextArrowDirection === "up" ? "-top-3" : "-bottom-3"} left-1 text-xs text-[#1c1c1c]`}
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
                    className={`absolute ${prevArrowDirection === "up" ? "-top-3" : "-bottom-3"} left-1 text-xs text-[#1c1c1c]`}
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
            {isImageArray ? (
              <div className="w-full h-full flex gap-4">
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

        {flattenedImages.length > 1 && (
          <>
            <button
              ref={prevButtonRef}
              onClick={prevImage}
              className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-project"
              aria-label="Previous image"
            ></button>
            <button
              ref={nextButtonRef}
              onClick={nextImage}
              className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-project"
              aria-label="Next image"
            ></button>
          </>
        )}
      </div>
      {flattenedImages.length > 1 && cursorVisible && (
        <div
          className="custom-cursor-project visible"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          {cursorSymbol}
        </div>
      )}
    </motion.div>
  );
}
