"use client";

import { playArray } from "@/data/play";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";

export default function Play() {
  const { playActive } = useActiveProject();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [nextArrowDirection, setNextArrowDirection] = useState<"up" | "down">("up");
  const [prevArrowDirection, setPrevArrowDirection] = useState<"up" | "down">("down");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorSymbol, setCursorSymbol] = useState("◀");
  const [windowWidth, setWindowWidth] = useState(0);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => {
      const isLastImage = prev === playArray.length - 1;
      setNextArrowDirection(isLastImage ? "down" : "up");
      return (prev + 1) % playArray.length;
    });
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    setCurrentIndex((prev) => {
      const isFirstImage = prev === 0;
      setPrevArrowDirection(isFirstImage ? "up" : "down");
      return (prev - 1 + playArray.length) % playArray.length;
    });
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };
    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
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
      window.removeEventListener("resize", updateWindowWidth);
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

  const currentItem = playArray[currentIndex];

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
              <Image
                src={`${
                  process.env.NODE_ENV === "development"
                    ? "/"
                    : "/daniel-portfolio-2025/"
                }images${currentItem.image}`}
                alt={currentItem.title}
                fill
                className="object-contain"
                priority={true}
                loading="eager"
              />
            </motion.div>
        </AnimatePresence>

        <button
          ref={prevButtonRef}
          onClick={prevImage}
          className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-prev-play"
          aria-label="Previous image"
        ></button>
        <button
          ref={nextButtonRef}
          onClick={nextImage}
          className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-next-play"
          aria-label="Next image"
        ></button>
      </div>
      {cursorVisible && (
        <div
          className="custom-cursor-play visible"
          style={{
            left: `${cursorPos.x + (playActive ? windowWidth : 0)}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          {cursorSymbol}
        </div>
      )}
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          className="absolute top-0 left-0 text-white text-sm flex justify-between w-full p-[20px]"
        >
          <span className="relative font-[600]">
            <AnimatePresence>
              {showNextArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.2 } }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${nextArrowDirection === "up" ? "-top-3" : "-bottom-3"} left-1 text-xs text-white`}
                >
                  {nextArrowDirection === "up" ? "▲" : "▼"}
                </motion.span>
              )}
              {showPrevArrow && (
                <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                  className={`absolute ${prevArrowDirection === "up" ? "-top-3" : "-bottom-3"} left-1 text-xs text-white`}
                >
                  {prevArrowDirection === "up" ? "▲" : "▼"}
                </motion.span>
              )}
            </AnimatePresence>
            {String(currentIndex + 1).padStart(2, '0')}/{String(playArray.length).padStart(2, '0')}
          </span>
          <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}  
          >{currentItem.title}</motion.span>
        </div>
      </AnimatePresence>
    </div>
  );
}
