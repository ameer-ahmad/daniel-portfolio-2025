"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { motion } from "framer-motion";
export default function Project({
  project, firstProject
}: {
  project: ProjectType[keyof ProjectType];
  firstProject: boolean
}) {
  const { loadingDone } = useLoadingDone();
  return (
    <motion.div
      initial={{ opacity: 0, x: "-160px" }}
      animate={{ opacity: loadingDone ? 1 : 0, x: loadingDone ? 0 : "-160px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        duration: 0.8,
        damping: 20,
        mass: 1,
      }}
      className="overflow-y-clip w-[calc(100%-142px)] h-[-webkit-fill-available] shadow-glow py-[90px] px-[134px] bg-white">
      <div className="w-full h-full relative">
        {project.image && (
          <Image
            src={`${process.env.NODE_ENV === 'development' ? '/' : '/daniel-portfolio-2025/'}images${project.image}`}
            alt={project.title}
            fill
            sizes="100%"
            className="object-contain"
            priority={firstProject}
          />
        )}
      </div>
    </motion.div>
  );
}
