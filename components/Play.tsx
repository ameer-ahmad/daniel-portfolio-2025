"use client";

import { playArray } from "@/data/play";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Play() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [showPrevArrow, setShowPrevArrow] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % playArray.length);
    setShowNextArrow(true);
    setTimeout(() => {
      setShowNextArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + playArray.length) % playArray.length);
    setShowPrevArrow(true);
    setTimeout(() => {
      setShowPrevArrow(false);
    }, 700); // 500ms visible + 200ms exit delay
  };


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
          onClick={prevImage}
          className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
          aria-label="Previous image"
        ></button>
        <button
          onClick={nextImage}
          className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
          aria-label="Next image"
        ></button>
      </div>
      <AnimatePresence mode="wait">
        <div
          key={currentIndex}
          
          className="absolute top-0 left-0 text-white text-sm flex justify-between w-full p-[20px]"
        >
          <span className="relative">
            <AnimatePresence>
              {showNextArrow && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.2 } }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-3 left-1 text-xs text-white"
                >
                  ▲
                </motion.span>
              )}
              {showPrevArrow && (
                <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.2 } }}
                transition={{ duration: 0.2 }}
                  className="absolute -bottom-3 left-1 text-xs text-white"
                >
                  ▼
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
