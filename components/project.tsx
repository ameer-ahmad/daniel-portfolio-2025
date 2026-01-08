"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Project({
  project, firstProject
}: {
  project: ProjectType[keyof ProjectType];
  firstProject: boolean
}) {
  const { loadingDone } = useLoadingDone();
  const { activeId, resetCounter } = useActiveProject();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);

  // Reset gallery index when project changes or NavBar is clicked (even if activeId doesn't change)
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeId, resetCounter]);

  // Flatten images array - handle both strings and arrays of strings
  const imagesArray = project.images || [];
  const flattenedImages = imagesArray;

  const nextImage = () => {
    if (flattenedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % flattenedImages.length);
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    if (flattenedImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + flattenedImages.length) % flattenedImages.length);
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const currentImageItem = imagesArray[currentIndex];
  const isImageArray = Array.isArray(currentImageItem);

  return (
    <motion.div
      initial={{ opacity: 0, x: "-160px" }}
      animate={{ opacity: loadingDone ? 1 : 0, x: loadingDone ? 0 : "-160px" }}
      transition={{
        type: "spring",
        stiffness: 40,
        duration: 0.8,
        damping: 20,
        mass: 1,
      }}
      className="overflow-y-clip w-[calc(100vw-286px)] h-[-webkit-fill-available] shadow-glow p-[80px] bg-white relative">
      {flattenedImages.length > 1 && (
        <AnimatePresence mode="wait">
          <div
            key={currentIndex}
            className="absolute top-[20px] left-[20px] text-[#1c1c1c] text-sm z-20"
          >
            <span className="relative">
              <AnimatePresence>
                {showNextArrow && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.2,
                      exit: { delay: 0.2 }
                    } as any}
                    className="absolute -top-3 left-1 text-xs text-[#1c1c1c]"
                  >
                    ▲
                  </motion.span>
                )}
                {showPrevArrow && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.2,
                      exit: { delay: 0.2 }
                    } as any}
                    className="absolute -bottom-3 left-1 text-xs text-[#1c1c1c]"
                  >
                    ▼
                  </motion.span>
                )}
              </AnimatePresence>
              {String(currentIndex + 1).padStart(2, '0')}/{String(imagesArray.length).padStart(2, '0')}
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
                      src={`${process.env.NODE_ENV === 'development' ? '/' : '/daniel-portfolio-2025/'}images${img}`}
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
                src={`${process.env.NODE_ENV === 'development' ? '/' : '/daniel-portfolio-2025/'}images${currentImageItem}`}
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
              onClick={prevImage}
              className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              aria-label="Previous image"
            ></button>
            <button
              onClick={nextImage}
              className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              aria-label="Next image"
            ></button>
          </>
        )}
      </div>
    </motion.div>
  );
}
