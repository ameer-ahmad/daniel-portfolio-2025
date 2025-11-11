"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loading() {
  const [showGif, setShowGif] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    console.log("showGif");
  }, []);


  return (
    <div className="w-screen h-screen bg-white z-[9999] absolute top-0 left-0 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showGif ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="h-[125px] flex"
      >
        <Image
          src="/images/running-loader.gif"
          alt="Loading"
          width={125}
          height={125}
        />
        <span className=" relative header-text w-[125px] h-[125px] flex items-center justify-center text-[#1c1c1c]">
          Daniel Shui
          <div className="absolute bottom-0 left-0 w-full h-full bg-white" />
        </span>
        <div className="w-[125px] h-[125px] bg-white" />
      </motion.div>
    </div>
  );
}
