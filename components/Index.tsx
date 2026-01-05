"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { useEffect } from "react";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";

export default function Index() {
  const { activeId, setActiveId, isActive } = useActiveProject();
  const { loadingDone } = useLoadingDone();
  useEffect(() => {
    if (!activeId && Object.keys(projects).length > 0) {
      setActiveId(Object.keys(projects)[0]);
      console.log(activeId);
    }
  }, []);


  return (
    <motion.div
      initial={{ width: "142px", x: "-40px", opacity: 0 }}
      animate={{ x: loadingDone ? 0 : "-40px", opacity: loadingDone ? 1 : 0 }}
      whileHover={{ width: "346px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
        duration: 0.8,
      }}
      className="p-[20px] h-[calc(100vh-60px)] bg-white shadow-glow text-[#1c1c1c] overflow-x-hidden overflow-y-auto"
    >
      
      <div className="flex flex-col gap-[20px] pr-[20px] min-w-[300px] box-content">
      <span className="header-text">Index</span>
        {Object.keys(projects).map((project) => (
          <div
            key={project}
            className={`${isActive(project) ? "opacity-[1]" : "opacity-[0.36]"} cursor-pointer italic`}
            onClick={() => setActiveId(project)}
          >
            <ul>
              <li className="font-bold not-italic">{projects[project].id < 10 ? '0' : ''}{projects[project].id}</li>
            </ul>
            <div>
              <span>{projects[project].title},</span> {projects[project].desc}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
