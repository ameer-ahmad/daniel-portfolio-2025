"use client";

import Index from "@/components/Index";
import Information from "@/components/Information";
import Project from "@/components/project";
import { projects } from "@/data/projects";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { useLayoutEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Play from "@/components/Play";

export default function Home() {
  const { activeId, playActive } = useActiveProject();

  const y = useMotionValue(0);
  const ySpring = useSpring(y, {
    stiffness: 80,
    damping: 20,
  });

  const x = useMotionValue(0);
  const xSpring = useSpring(x, {
    stiffness: 80,
    damping: 20,
  });

  useLayoutEffect(() => {
    const container = document.getElementById("ProjectsContainer");
    const activeProject = document.getElementById(activeId);

    if (!container || !activeProject) return;

    const containerTop = container.getBoundingClientRect().top;
    const projectTop = activeProject.getBoundingClientRect().top;

    y.set(-(projectTop - containerTop));
  }, [activeId]);

  useLayoutEffect(() => {
    x.set(playActive ? -window.innerWidth : 0);
  }, [playActive, x]);
  return (
    <>
      <LoadingScreen />
      <motion.div 
      style={{ x: xSpring }}
      className="flex w-[200vw]">
        <div className="flex">
          <Index />
          <div className="w-full h-full relative">
            <motion.div
              style={{ y: ySpring }}
              className="relative"
              id="ProjectsContainer"
            >
              {Object.keys(projects).map((project, i) => (
                <div
                  key={project}
                  className="w-full h-full flex overflow-y-clip"
                  id={project}
                >
                  <Information project={projects[project]} />
                  <Project
                    project={projects[project]}
                    firstProject={i === 0 ? true : false}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
        <div className="flex w-screen h-[calc(100vh-60px)] bg-black">
          <Play />
        </div>
      </motion.div>
    </>
  );
}
