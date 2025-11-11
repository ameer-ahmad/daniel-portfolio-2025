"use client";

import { motion } from "framer-motion";
import { ProjectType } from "@/data/projects";

export default function Information({
  project,
}: {
  project: ProjectType[keyof ProjectType];
}) {
  return (
    <motion.div
      initial={{ width: "142px" }}
      whileHover={{ width: "346px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
      className="p-[20px] h-[calc(100vh-60px)] bg-white shadow-glow text-[#1c1c1c] overflow-x-hidden overflow-y-auto"
    >
      <div className="flex flex-col pr-[20px] min-w-[300px] box-content italic">
        <span className="header-text not-italic">{project.title}</span>
        <span className="mt-[20px]">{project.desc}</span>
        {project.date && <span className="mt-[20px]">{project.date}</span>}
        {project.details && <span className="">{project.details}</span>}
        {project.extra && <span className="mt-[20px]">{project.extra}</span>}
      </div>
    </motion.div>
  );
}
