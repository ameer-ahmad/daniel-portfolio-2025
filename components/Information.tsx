"use client";

import { motion } from "framer-motion";
import { ProjectType } from "@/data/projects";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";

export default function Information({
  project,
}: {
  project: ProjectType[keyof ProjectType];
}) {
  const { loadingDone } = useLoadingDone();
  return (
    <motion.div
      initial={{ width: "143px", x: "-90px", opacity: 0, minWidth: "143px" }}
      animate={{ x: loadingDone ? 0 : "-90px", opacity: loadingDone ? 1 : 0 }}
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
      className="p-[20px] h-[calc(100vh-60px)] bg-white shadow-glow text-[#1c1c1c] overflow-x-hidden overflow-y-auto"
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
        {project.details && <span className="">{project.details}</span>}
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
