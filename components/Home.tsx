"use client"

import Index from "@/components/Index";
import Information from "@/components/Information";
import Project from "@/components/project";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const { activeId } = useActiveProject();
  const [topOffset, setTopOffset] = useState(0);

  useEffect(() => {
    const activeProject = document.getElementById(activeId)
    setTopOffset(activeProject?.offsetTop || 0)
  }, [activeId]);
  return (
    <>
    <LoadingScreen />
    <div className="flex">
      <Index />
      <div className="w-full h-full relative">
        <motion.div
        initial={{top: 0}}
        animate={{top: `-${topOffset}px`}}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 1,
          }}
          className="relative"
          id="ProjectsContainer"
        >
          {Object.keys(projects).map((project, i) => (
            <div key={project} className="w-full h-full flex overflow-y-clip" id={project}>
              <Information project={projects[project]} />
              <Project project={projects[project]} firstProject={i === 0 ? true : false} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  );
}
