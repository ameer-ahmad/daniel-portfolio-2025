"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import {
  PREFETCH_PRIORITY,
  getProjectSlides,
  loadSlide,
  prefetchAllProjectHeroes,
  prefetchSlides,
} from "@/app/(lib)/mediaSlides";
import { projects } from "@/data/projects";

const NAME = "Daniel Shui";

/** The intro choreography runs this long; we never cut it short. */
const MIN_VISIBLE_MS = 5300;
/** Time between the curtain starting to lift and `loadingDone`. */
const EXIT_MS = 900;
/** Ceiling on waiting for the hero, so a bad connection can never trap the user. */
const MAX_HERO_WAIT_MS = 9000;

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
    const startedAt = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    // 1. gif fades in
    timers.push(setTimeout(() => setPhase("gif"), 400));
    // 2. gif fades out, then 3. text fades in (AnimatePresence mode="wait")
    timers.push(setTimeout(() => setPhase("text"), 2000));

    // 4. text fades out, then 5. loading finishes once it has left
    const beginExit = () => {
      if (cancelled) return;
      setPhase("none");
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setLoadingDone(true);
          setShowContent(true);
        }, EXIT_MS)
      );
    };

    const heroSlides = getProjectSlides(
      Object.values(projects)[0],
      window.innerWidth < 768
    );
    const hero = heroSlides[0];

    // Hold the curtain until the first thing behind it can actually paint. The
    // timeout is a hard ceiling, not a target.
    const heroReady = hero ? loadSlide(hero) : Promise.resolve();
    const ceiling = new Promise<void>((resolve) => {
      timers.push(setTimeout(resolve, MAX_HERO_WAIT_MS));
    });

    void Promise.race([heroReady, ceiling]).then(() => {
      if (cancelled) return;
      const remaining =
        MIN_VISIBLE_MS - EXIT_MS - (Date.now() - startedAt);
      timers.push(setTimeout(beginExit, Math.max(0, remaining)));
    });

    // Everything else is speculative and queued behind the hero.
    const prefetchRest = () => {
      if (cancelled) return;
      prefetchSlides(heroSlides.slice(1), PREFETCH_PRIORITY.adjacent);
      prefetchAllProjectHeroes(projects, PREFETCH_PRIORITY.nearby);
    };
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(prefetchRest, { timeout: 2000 });
    } else {
      timers.push(setTimeout(prefetchRest, 300));
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
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
              unoptimized
              priority
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
