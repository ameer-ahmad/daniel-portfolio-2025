"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { prefetchAllProjectHeroes } from "@/app/(lib)/mediaSlides";
import { projects } from "@/data/projects";

const NAME = "Daniel Shui";

type Phase = "none" | "gif" | "text";

const textContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.05 },
  },
};

// Enters from translate(-2px,4px) scale(.9) blur(6px); exit reverses to the same spot.
const blurInVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -2,
    y: 4,
    scale: 0.9,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: -2,
    y: 4,
    scale: 0.9,
    filter: "blur(6px)",
    transition: { duration: 0.45, ease: "easeIn" },
  },
};

export default function LoadingScreen() {
  const setLoadingDone = useLoadingDone((s) => s.setLoadingDone);
  const [phase, setPhase] = useState<Phase>("none");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const prefetch = () => prefetchAllProjectHeroes(projects);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetch, { timeout: 2000 });
    } else {
      prefetch();
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 1. gif fades in
    timers.push(setTimeout(() => setPhase("gif"), 400));
    // 2. gif fades out, then 3. text fades in (AnimatePresence mode="wait")
    timers.push(setTimeout(() => setPhase("text"), 2000));
    // 4. text fades out from the same direction it entered
    timers.push(setTimeout(() => setPhase("none"), 4400));
    // 5. finish loading once the text has left
    timers.push(
      setTimeout(() => {
        setLoadingDone(true);
        setShowContent(true);
      }, 5300)
    );

    return () => timers.forEach(clearTimeout);
  }, [setLoadingDone]);

  return (
    <motion.div
      initial={{ opacity: 1, pointerEvents: "all" }}
      animate={{
        opacity: showContent ? 0 : 1,
        pointerEvents: showContent ? "none" : "all",
      }}
      transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
      className="w-screen h-dvh md:h-screen bg-white z-[9999] fixed inset-0 flex justify-center items-center"
    >
      <AnimatePresence mode="wait">
        {phase === "gif" && (
          <motion.div
            key="gif"
            variants={blurInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-[125px] w-[125px] relative shrink-0"
          >
            <Image
              src="/images/running-loader.gif"
              alt="Loading"
              width={125}
              height={125}
              className="absolute top-0 left-0"
            />
          </motion.div>
        )}

        {phase === "text" && (
          <motion.div
            key="text"
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="header-text flex text-[#515151]"
            aria-label={NAME}
          >
            {NAME.split("").map((char, index) => (
              <motion.span
                key={index}
                variants={blurInVariants}
                className="whitespace-pre"
                style={{ display: char === " " ? "inline-block" : "inline" }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
