"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import {
  PREFETCH_PRIORITY,
  getProjectSlides,
  loadSlide,
  prefetchAllProjectHeroes,
  prefetchSlides,
} from "@/app/(lib)/mediaSlides";
import { projects } from "@/data/projects";

/** The intro choreography runs this long; we never cut it short. */
const INTRO_MS = 7750;
/** Ceiling on waiting for the hero, so a bad connection can never trap the user. */
const MAX_HERO_WAIT_MS = 9000;

export default function LoadingScreen() {
  const setLoadingDone = useLoadingDone((s) => s.setLoadingDone);
  const [showGif, setShowGif] = useState(false);
  const [showText, setShowText] = useState(false);
  const [slideText, setSlideText] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    timers.push(setTimeout(() => setShowGif(true), 1000));
    timers.push(setTimeout(() => setShowText(true), 4000));
    timers.push(setTimeout(() => setSlideText(true), 4750));
    timers.push(setTimeout(() => setHideText(true), 6750));

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
      const remaining = INTRO_MS - (Date.now() - startedAt);
      timers.push(
        setTimeout(() => {
          if (cancelled) return;
          setLoadingDone(true);
          setShowContent(true);
        }, Math.max(0, remaining))
      );
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showGif ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 1 }}
        className="h-[125px] w-[125px] flex relative"
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
          className="w-[125px] h-[125px] absolute top-0 bg-white z--2"
        />
      </motion.div>
    </motion.div>
  );
}
