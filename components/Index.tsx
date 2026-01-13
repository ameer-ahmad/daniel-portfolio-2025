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
      initial={{ width: "143px", x: "-40px", opacity: 0, minWidth: "143px" }}
      animate={{ x: loadingDone ? 0 : "-40px", opacity: loadingDone ? 1 : 0 }}
      whileHover={{ width: "346px", minWidth: "346px" }}
      transition={{
        x: {
          type: "spring",
          stiffness: 40,
          damping: 20,
          mass: 1,
        },
        opacity: {
          type: "spring",
          stiffness: 40,
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
      
      <div className="flex flex-col gap-[20px] pr-[20px] min-w-[300px] box-content">
      <span className="header-text !capitalize">Index</span>
        {Object.keys(projects).map((project) => (
          <motion.div
            initial={{ x: 0, opacity: 0.36 }}
            animate={{ opacity: isActive(project) ? 1 : 0.36, x: isActive(project) ? 6 : 0 }}
            whileHover={{ x: 6 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            key={project}
            className={`${isActive(project) ? "opacity-[1]" : "opacity-[0.36]"} cursor-pointer italic`}
            onClick={() => setActiveId(project)}
          >
            <div className="flex items-center gap-[8px] relative">
              <motion.div
                className="w-[4px] h-[4px] rounded-full bg-[#1c1c1c] absolute top-[50%] -translate-y-[50%] left-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive(project) ? 1 : 0 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
              />
              <motion.span
              initial={{ x: 0 }}
              animate={{ x: isActive(project) ? 12 : 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
              }}
              className="font-[600] not-italic">{projects[project].id < 10 ? '0' : ''}{projects[project].id}</motion.span>
            </div>
            <div>
              <span className="title" dangerouslySetInnerHTML={{ __html: projects[project].title }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
