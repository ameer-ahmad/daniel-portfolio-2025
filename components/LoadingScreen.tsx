"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const [showGif, setShowGif] = useState(false);
  const [showText, setShowText] = useState(false);
  const [slideText, setSlideText] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowGif(true);
    }, 1000);
    setTimeout(() => {
      setShowText(true);
    }, 4000);
    setTimeout(() => {
      setSlideText(true);
    }, 4750);
    setTimeout(() => {
      setHideText(true);
    }, 6750);
    setTimeout(() => {
        setShowContent(true);
      }, 7750);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: showContent ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
      className="w-screen h-screen pointer-events-none bg-white z-[9999] absolute top-0 left-0 flex justify-center items-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showGif ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="h-[125px] w-[125px] flex relative"
      >
        <Image
          src="./images/running-loader.gif"
          alt="Loading"
          width={125}
          height={125}
          className="absolute top-0 left-0"
        />
        <motion.div
          initial={{ left: "125px" }}
          animate={{ left: showText ? 0 : "125px" }}
          transition={{ type: "spring", stiffness: 80, damping: 20, mass: 2 }}
          className="absolute top-0"
        >
          <span className=" relative header-text w-[125px] h-[125px] bg-white flex items-center justify-center text-[#1c1c1c]">
            Daniel Shui
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: slideText ? "-125px" : 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 2,
              }}
              className="absolute bottom-0 left-0 w-full h-full bg-white"
            />
          </span>
        </motion.div>

        <motion.div
          initial={{ left: "125px" }}
          animate={{ left: hideText ? 0 : "125px" }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 2,
          }}
          className="w-[125px] h-[125px] absolute top-0 bg-white z-2"
        />
      </motion.div>
    </motion.div>
  );
}
