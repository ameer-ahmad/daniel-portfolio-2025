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
  const firstProjectHeightOffset = 60;

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

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    window.addEventListener("pageshow", resetScroll);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") resetScroll();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pageshow", resetScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Helper function to set animation flag with auto-clear
  const startAnimation = () => {
    isAnimating.current = true;
    // Clear animation flag after spring animation completes (stiffness 80, damping 20 typically takes ~500-700ms)
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      isAnimating.current = false;
    }, 50);
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

        if (shouldAnimate) {
          startAnimation();
        }
        const targetY = getProjectY(container, activeId);
        if (targetY !== null) {
          y.set(targetY);
        }
      });
    };

    const handleOrientationChange = () => {
      // Small delay to ensure viewport has updated after orientation change
      setTimeout(() => updateY(false), 100);
    };

    // Initial update - don't set isAnimating for initial load
    requestAnimationFrame(() => {
      const targetY = getProjectY(container, activeId);
      if (targetY !== null) {
        y.set(targetY);
      }
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
  const projectKeys = Object.keys(projects);
  const getProjectY = (container: HTMLElement, projectId: string) => {
    const activeProject = document.getElementById(projectId);
    if (!activeProject) return null;
    const containerTop = container.getBoundingClientRect().top;
    const projectTop = activeProject.getBoundingClientRect().top;
    const index = projectKeys.indexOf(projectId);
    const stepOffset = index > 0 ? firstProjectHeightOffset : 0;
    return -(projectTop - containerTop + stepOffset);
  };

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

                // Calculate new Y position
                let newY = initialY.current + deltaY;

                // Clamp overscroll at boundaries
                if (deltaY > 0 && currentIndex === 0) {
                  // At first project, allow scrolling up but limit to 100px
                  const maxOverscroll = 100;
                  newY = Math.min(initialY.current + maxOverscroll, newY);
                } else if (deltaY < 0 && currentIndex === projectKeys.length - 1) {
                  // At last project, allow scrolling down but limit to 180px
                  const maxOverscroll = 180;
                  newY = Math.max(initialY.current - maxOverscroll, newY);
                }

                y.set(newY);
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

                  // If at boundary and trying to scroll in that direction, snap back with spring
                  if ((isAtFirstProject && tryingToScrollUp) || (isAtLastProject && tryingToScrollDown)) {
                    const currentProject = document.getElementById(activeId);
                    const targetY = getProjectY(container, activeId);
                    if (targetY !== null) {
                      startAnimation();
                      y.set(targetY);
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
                      const targetY = getProjectY(container, activeId);
                      if (targetY !== null) {
                        startAnimation();
                        y.set(targetY);
                      }
                    }
                  } else {
                    // Snap back to current project if scrolled less than 20%
                    const targetY = getProjectY(container, activeId);
                    if (targetY !== null) {
                      startAnimation();
                      y.set(targetY);
                    }
                  }
                });
              }}
            >
              {/* Beginning boundary message */}
              <div className="w-full h-[100px] bg-[#f8f8f8] md:hidden flex flex-col gap-[4px] items-center justify-center boundary-message-top">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g opacity="0.38" clipPath="url(#clip0_1639_7810)">
                    <path d="M3.75 12.75C3.279 12.6487 2.90925 12.4868 2.5965 12.2265C2.44441 12.0998 2.30523 11.9584 2.181 11.8043C1.5 10.962 1.5 9.7125 1.5 7.209C1.5 4.7055 1.5 3.45525 2.181 2.613C2.30523 2.45889 2.44441 2.31745 2.5965 2.19075C3.4275 1.5 4.659 1.5 7.125 1.5H10.875C13.341 1.5 14.5733 1.5 15.4035 2.19075C15.5555 2.31825 15.694 2.459 15.819 2.613C16.5 3.45525 16.5 4.70625 16.5 7.209C16.5 9.711 16.5 10.962 15.819 11.8043C15.6948 11.9584 15.5556 12.0998 15.4035 12.2265C15.0908 12.4868 14.721 12.6487 14.25 12.75" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4.5 9.75H5.49975M5.49975 9.75L6.375 16.5M5.49975 9.75H9M9 9.75H12.5002M9 9.75V16.5M13.5 9.75H12.5002M12.5002 9.75L11.625 16.5M6 7.5C6.04425 6.036 6.9465 6 8.2485 6H9.7515C11.0535 6 11.9565 6.036 12 7.5" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 12.375H12M6.333 15H11.667" stroke="#1C1C1C" strokeWidth="1.5" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1639_7810">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-[#1c1c1c] text-sm opacity-[0.38]">You have reached the top, swipe down for more!</p>
              </div>

              {projectKeys.map((project, i) => {
                const zIndex = projectKeys.length - i;

                return (
                <div
                  key={project}
                  className={`w-full relative ${i === 0 ? "h-[calc(100dvh-60px)] md:h-[calc(100vh-60px)]" : "h-[100dvh] md:h-[100dvh]"} flex clip-content`}
                  id={project}
                  style={{ zIndex }}
                >
                  <Information project={projects[project]} firstProject={i === 0 ? true : false} />
                  <Project
                    project={projects[project]}
                    firstProject={i === 0 ? true : false}
                  />
                </div>
                );
              })}

              {/* End boundary message */}
              <div className="w-full h-[180px] bg-[#f8f8f8] md:hidden flex flex-col items-center gap-[4px] justify-start boundary-message-bottom">
                <svg className="mt-[29px]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <g opacity="0.38" clipPath="url(#clip0_1639_7800)">
                    <path d="M13.5888 15.553C17.2078 13.0187 18.087 8.03028 15.5527 4.41132C13.0193 0.792366 8.03073 -0.0867748 4.41173 2.44825M13.5888 15.553C9.96983 18.0864 4.9805 17.2073 2.44704 13.5883C-0.0864171 9.96935 0.792734 4.98088 4.41173 2.44825M13.5888 15.553L4.41173 2.44825" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.0619 3.77881C12.046 8.49529 8.25585 11.1495 2.021 12.9102" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.84847 1.04492C10.1789 5.23664 12.5619 8.63961 16.7649 10.9243M1.23535 7.07572C5.06154 8.8196 7.44381 12.2226 8.15257 16.9543" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1639_7800">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-[#1c1c1c] text-sm opacity-[0.38]">You have reached the end, thanks for viewing!</p>
              </div>
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
