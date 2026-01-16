"use client";

import Index from "@/components/Index";
import Information from "@/components/Information";
import Project from "@/components/project";
import { projects } from "@/data/projects";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { useLayoutEffect, useRef, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Play from "@/components/Play";

export default function Home() {
  const { activeId, playActive, setActiveId } = useActiveProject();

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

  const touchStartY = useRef<number | null>(null);
  const initialY = useRef<number>(0);
  const finalDeltaY = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to set animation flag with auto-clear
  const startAnimation = () => {
    isAnimating.current = true;
    // Clear animation flag after spring animation completes (stiffness 80, damping 20 typically takes ~500-700ms)
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      isAnimating.current = false;
    }, 800);
  };

  useLayoutEffect(() => {
    const container = document.getElementById("ProjectsContainer");
    const activeProject = document.getElementById(activeId);

    if (!container || !activeProject) return;

    const updateY = (shouldAnimate: boolean = false) => {
      // Use requestAnimationFrame to ensure DOM has updated after orientation change
      requestAnimationFrame(() => {
        const container = document.getElementById("ProjectsContainer");
        const activeProject = document.getElementById(activeId);
        
        if (!container || !activeProject) return;
        
        const containerTop = container.getBoundingClientRect().top;
        const projectTop = activeProject.getBoundingClientRect().top;
        if (shouldAnimate) {
          startAnimation();
        }
        y.set(-(projectTop - containerTop));
      });
    };

    const handleOrientationChange = () => {
      // Small delay to ensure viewport has updated after orientation change
      setTimeout(() => updateY(false), 100);
    };

    // Initial update - don't set isAnimating for initial load
    requestAnimationFrame(() => {
      const containerTop = container.getBoundingClientRect().top;
      const projectTop = activeProject.getBoundingClientRect().top;
      y.set(-(projectTop - containerTop));
    });

    // When activeId changes, it's a programmatic change, so animate
    updateY(true);

    window.addEventListener("resize", () => updateY(false));
    window.addEventListener("orientationchange", handleOrientationChange);
    
    return () => {
      window.removeEventListener("resize", () => updateY(false));
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [activeId, y]);

  useLayoutEffect(() => {
    const updateX = () => {
      // Use requestAnimationFrame to ensure DOM has updated after orientation change
      requestAnimationFrame(() => {
        x.set(playActive ? -window.innerWidth : 0);
      });
    };

    const handleOrientationChange = () => {
      // Small delay to ensure viewport has updated after orientation change
      setTimeout(updateX, 100);
    };

    // Initial update
    requestAnimationFrame(() => {
      x.set(playActive ? -window.innerWidth : 0);
    });

    window.addEventListener("resize", updateX);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    return () => {
      window.removeEventListener("resize", updateX);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [playActive, x]);
  return (
    <>
      <LoadingScreen />
      <motion.div style={{ x: xSpring }} className="flex w-[200vw]">
        <div className="flex all-content">
          <Index />
          <div className="w-full h-full relative shadow-glow overflow-y-clip">
            <motion.div
              style={{ y: ySpring }}
              className="relative"
              id="ProjectsContainer"
              onTouchStart={(e) => {
                // Prevent touch if animation is in progress
                if (isAnimating.current) {
                  e.preventDefault();
                  touchStartY.current = null;
                  finalDeltaY.current = 0;
                  return;
                }
                touchStartY.current = e.touches[0].clientY;
                initialY.current = y.get();
                finalDeltaY.current = 0;
              }}
              onTouchMove={(e) => {
                // Prevent touch if animation is in progress
                if (isAnimating.current || touchStartY.current === null) return;
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - touchStartY.current;
                finalDeltaY.current = deltaY;
                
                const projectKeys = Object.keys(projects);
                const currentIndex = projectKeys.indexOf(activeId);
                
                // Prevent scrolling beyond boundaries
                if (deltaY > 0 && currentIndex === 0) {
                  // At first project, prevent scrolling up
                  return;
                }
                if (deltaY < 0 && currentIndex === projectKeys.length - 1) {
                  // At last project, prevent scrolling down
                  return;
                }
                
                y.set(initialY.current + deltaY);
              }}
              onTouchEnd={() => {
                // Prevent touch end if animation is in progress
                if (isAnimating.current) {
                  touchStartY.current = null;
                  return;
                }
                
                const deltaY = finalDeltaY.current;
                const screenHeight = window.innerHeight;
                const scrollPercentage = Math.abs(deltaY) / screenHeight;
                
                touchStartY.current = null;
                
                // Use requestAnimationFrame to ensure DOM has updated
                requestAnimationFrame(() => {
                  const container = document.getElementById("ProjectsContainer");
                  if (!container) return;
                  
                  const projectKeys = Object.keys(projects);
                  const currentIndex = projectKeys.indexOf(activeId);
                  
                  // Check if we're at boundaries and trying to scroll in that direction
                  const isAtFirstProject = currentIndex === 0;
                  const isAtLastProject = currentIndex === projectKeys.length - 1;
                  const tryingToScrollUp = deltaY > 0;
                  const tryingToScrollDown = deltaY < 0;
                  
                  // If at boundary and trying to scroll in that direction, just snap back
                  if ((isAtFirstProject && tryingToScrollUp) || (isAtLastProject && tryingToScrollDown)) {
                    const currentProject = document.getElementById(activeId);
                    if (currentProject) {
                      const containerTop = container.getBoundingClientRect().top;
                      const projectTop = currentProject.getBoundingClientRect().top;
                      startAnimation();
                      y.set(-(projectTop - containerTop));
                    }
                    return;
                  }
                  
                  // If scrolled more than 20% of screen, move to next/previous project
                  if (scrollPercentage > 0.2) {
                    let targetIndex: number;
                    
                    if (deltaY > 0) {
                      // Dragged down, content moves up, go to previous project (lower index)
                      targetIndex = Math.max(currentIndex - 1, 0);
                    } else {
                      // Dragged up, content moves down, go to next project (higher index)
                      targetIndex = Math.min(currentIndex + 1, projectKeys.length - 1);
                    }
                    
                    const targetProjectKey = projectKeys[targetIndex];
                    if (targetProjectKey && targetProjectKey !== activeId) {
                      startAnimation();
                      setActiveId(targetProjectKey);
                    } else {
                      // Snap back to current project
                      const currentProject = document.getElementById(activeId);
                      if (currentProject) {
                        const containerTop = container.getBoundingClientRect().top;
                        const projectTop = currentProject.getBoundingClientRect().top;
                        startAnimation();
                        y.set(-(projectTop - containerTop));
                      }
                    }
                  } else {
                    // Snap back to current project if scrolled less than 20%
                    const currentProject = document.getElementById(activeId);
                    if (currentProject) {
                      const containerTop = container.getBoundingClientRect().top;
                      const projectTop = currentProject.getBoundingClientRect().top;
                      startAnimation();
                      y.set(-(projectTop - containerTop));
                    }
                  }
                });
              }}
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
        <div className="flex w-screen h-[calc(100dvh-60px)] md:h-[calc(100vh-60px)] bg-black play-section">
          <Play />
        </div>
      </motion.div>
    </>
  );
}
