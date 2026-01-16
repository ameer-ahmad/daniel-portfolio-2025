"use client";

import { motion } from "framer-motion";
import { ProjectType } from "@/data/projects";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useEffect, useState } from "react";

export default function Information({
  project,
}: {
  project: ProjectType[keyof ProjectType];
}) {
  const { loadingDone } = useLoadingDone();

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);

    // Handle resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitialWidth = () => {
    if (windowWidth === 0) return "143px"; // SSR fallback
    if (windowWidth < 768) return "0px";
    if (windowWidth < 1024) return "100px"; // Tablet
    return "143px"; // Desktop
  };

  const initialWidth = getInitialWidth();

  return (
    <motion.div
      initial={{
        width: initialWidth,
        x: "-90px",
        opacity: 0,
        minWidth: initialWidth,
      }}
      animate={{
        x: loadingDone ? 0 : "-90px",
        opacity: loadingDone ? 1 : 0,
        width: initialWidth,
        minWidth: initialWidth,
      }}
      whileHover={{ width: "447px", minWidth: "447px" }}
      transition={{
        x: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        },
        opacity: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        },
        width: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        },
        minWidth: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        },
      }}
      className="p-[0px] md:p-[20px] h-[calc(100vh-60px)] bg-white text-[#1c1c1c] overflow-x-hidden overflow-y-auto"
    >
      <div className="flex flex-col pr-[20px] min-w-[407px] box-content italic">
        <span
          className="header-text italic !capitalize"
          dangerouslySetInnerHTML={{ __html: project.subtitle }}
        />
        <span
          className="mt-[20px] !not-italic"
          dangerouslySetInnerHTML={{ __html: project.desc }}
        />
        {project.date && <span className="mt-[20px]">{project.date}</span>}
        {project.details && <span className="" dangerouslySetInnerHTML={{ __html: project.details }}></span>}
        {project.extra && (
          <span
            className="mt-[20px] not-italic"
            dangerouslySetInnerHTML={{ __html: project.extra }}
          ></span>
        )}
      </div>
    </motion.div>
  );
}
