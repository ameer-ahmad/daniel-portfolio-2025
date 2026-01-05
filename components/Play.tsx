"use client";

import { playArray } from "@/data/play";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Play() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const nextImage = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev + 1) % playArray.length);
   
  };

  const prevImage = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev - 1 + playArray.length) % playArray.length);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, currentIndex]);


  const currentItem = playArray[currentIndex];

  return (
    <div className="relative p-[80px] w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-1 h-1 rounded-full bg-white"
                    animate={{
                      opacity: [1, 0.38, 1, 0.38, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
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
          )}
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
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: isLoading ? 0 : 0 
          }}
          className="absolute top-0 left-0 text-white text-sm flex justify-between w-full p-[20px]"
        >
          <span>
            {currentIndex + 1}/{playArray.length}
          </span>
          <span>{currentItem.title}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
