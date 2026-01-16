"use client";
import { motion, AnimatePresence } from "framer-motion";
import "@/app/globals.css";
import { useState, useEffect } from "react";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
import { useMobileUI } from "@/app/(lib)/stores/useMobileUI";
import { projects } from "@/data/projects";
import { playArray } from "@/data/play";
export default function NavBar() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const { loadingDone } = useLoadingDone();
  const { setPlayActive, setActiveId, playActive, activeId } =
    useActiveProject();
  const {
    toggleIndex,
    isIndexOpen,
    toggleProjectInfo,
    isProjectInfoOpen,
    setIsIndexOpen,
    setIsProjectInfoOpen,
    currentPlayIndex,
    setCurrentPlayIndex,
  } = useMobileUI();

  const activeProject = activeId ? projects[activeId] : null;
  const activePlayItem = playArray[currentPlayIndex];

  const handleProjectInfoToggle = () => {
    if (isIndexOpen) setIsIndexOpen(false);
    toggleProjectInfo();
  };

  const handleIndexToggle = () => {
    if (isProjectInfoOpen) setIsProjectInfoOpen(false);
    toggleIndex();
  };
  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };
  const resetInfo = () => {
    if (playActive) {
      setPlayActive(false);
      setTimeout(() => {
        setActiveId("texas-rangers");
      }, 800);
    } else {
      setActiveId("texas-rangers");
    }
  };
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

  const getInitialHeight = () => {
    if (windowWidth === 0) return "339px"; // SSR fallback
    if (windowWidth < 768) return "auto"; // Mobile - fit content
    return "339px"; // Desktop
  };

  const initialHeight = getInitialHeight();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: loadingDone ? 1 : 0, y: loadingDone ? 0 : "-100%" }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        }}
        className="relative z-[999] shadow-glow"
      >
        <motion.div
          initial={{ height: "60px" }}
          animate={{ height: isInfoOpen ? initialHeight : "60px" }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 1,
          }}
          className="bg-white text-[#1c1c1c]  px-[20px] overflow-hidden relative z-[999]"
        >
          <div className="flex items-center justify-between w-full h-[60px]">
            <div className="flex items-start gap-[210px] h-[20px] w-full md:w-[485px] mb-[2px] overflow-hidden relative">
              <span
                className="header-text w-[217px] cursor-pointer"
                onClick={resetInfo}
              >
                Daniel Shui
              </span>
              <motion.div
                initial={{ top: "-20px" }}
                animate={{ top: isInfoOpen ? 0 : "-20px" }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
                onHoverStart={
                  windowWidth >= 768 ? () => setIsInfoHovered(true) : undefined
                }
                onHoverEnd={
                  windowWidth >= 768 ? () => setIsInfoHovered(false) : undefined
                }
                className="flex flex-col absolute right-0"
              >
                <span
                  onClick={toggleInfo}
                  className="header-text flex items-center gap-[2px] cursor-pointer h-full"
                >
                  CLOSE
                  <motion.svg
                    animate={{
                      scale:
                        windowWidth >= 768 && isInfoHovered ? 0.666666666 : 1,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                  >
                    <path
                      d="M8 2L2 8"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 2L8 8"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
                <span
                  onClick={toggleInfo}
                  className="header-text flex items-center gap-[2px] cursor-pointer h-full"
                >
                  INFO
                  <motion.span className="grid grid-cols-2 w-[7px] h-[7px] gap-[1px]">
                    <motion.span
                      animate={{
                        scale:
                          windowWidth >= 768 && isInfoHovered ? 0.666666666 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                    ></motion.span>
                    <motion.span
                      animate={{
                        scale:
                          windowWidth >= 768 && isInfoHovered ? 0.666666666 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                    ></motion.span>
                    <motion.span
                      animate={{
                        scale:
                          windowWidth >= 768 && isInfoHovered ? 0.666666666 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                    ></motion.span>
                    <motion.span
                      animate={{
                        scale:
                          windowWidth >= 768 && isInfoHovered ? 0.666666666 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                    ></motion.span>
                  </motion.span>
                </span>
              </motion.div>
            </div>
            <div className="hidden justify-between items-center gap-[40px] pr-[8px] mb-[2px] md:flex">
              <motion.span
                whileHover="hovered"
                initial={{ opacity: 1 }}
                animate={{ opacity: playActive ? 0.38 : 1 }}
                variants={{
                  initial: { opacity: 1 },
                  hovered: { opacity: 1 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
                className="header-text cursor-pointer w-[56px] flex items-center gap-[2px]"
                onClick={() => setPlayActive(false)}
              >
                Work
                <motion.span
                  initial={{ opacity: 0, width: 6, height: 6 }}
                  animate={{ opacity: playActive ? 0 : 1 }}
                  variants={{
                    initial: { width: 6, height: 6, x: 0 },
                    hovered: {
                      scale: 0.666666666,
                      transition: { duration: 0.25, ease: "easeInOut" },
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    mass: 1,
                  }}
                  className="w-[6px] h-[6px] border-[2px] m-[2px] solid #1c1c1c rounded-full block"
                />
              </motion.span>
              <motion.span
                whileHover="hovered"
                initial={{ opacity: 1 }}
                animate={{ opacity: playActive ? 1 : 0.38 }}
                variants={{
                  initial: { opacity: 1 },
                  hovered: { opacity: 1 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
                className="header-text cursor-pointer w-[56px] flex items-center gap-[2px]"
                onClick={() => setPlayActive(true)}
              >
                Play
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: playActive ? 1 : 0 }}
                  variants={{
                    initial: { width: 6, height: 6, x: 0 },
                    hovered: {
                      scale: 0.666666666,
                      transition: { duration: 0.25, ease: "easeInOut" },
                    },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    mass: 1,
                  }}
                  className="w-[6px] h-[6px] border-[2px] m-[2px] solid #1c1c1c rounded-full block"
                />
              </motion.span>
            </div>
          </div>
          <div className="flex mt-[20px] mb-[20px] md:mb-0 justify-start gap-[20px] w-full h-auto md:h-[279px] text-[14px] line-height-[20px] md:flex-row flex-col">
            <motion.span
              initial={{
                color: "rgba(0, 0, 0, 0)",
                pointerEvents: "none",
                y: "-20px",
              }}
              animate={{
                color: isInfoOpen ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)",
                pointerEvents: isInfoOpen ? "auto" : "none",
                y: isInfoOpen ? 0 : "-20px",
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
              }}
              className="w-full md:w-[407px]"
            >
              Multidisciplinary designer developing digital and print projects
              for individuals, businesses, and organizations across various
              sectors. His practice encompasses UI/UX, typography, brand
              development, creative direction, editorials, & more. He has worked
              on projects for clients both big and small, including the Chicago
              Bulls, Crypto.com Arena, Texas Rangers, Olympics, FIFA, FC
              Barcelona, & many more.
              <br />
              <br />
              Currently based in the city of Toronto, and is always interested
              in collaborations with others around the world. Please get in
              touch for any inquiries or to see additional work.
            </motion.span>
            <motion.div
              initial={{
                color: "rgba(0, 0, 0, 0)",
                pointerEvents: "none",
                y: "-20px",
              }}
              animate={{
                color: isInfoOpen ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)",
                pointerEvents: isInfoOpen ? "auto" : "none",
                y: isInfoOpen ? 0 : "-20px",
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
              }}
              className="flex flex-col gap-[20px] w-full md:w-[265px]"
            >
              <span className="">
                Special thanks to{" "}
                <a
                  href="https://ameerahmad.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline squiggle"
                >
                  Ameer Ahmad
                </a>
                , for programming this website. Designed by Daniel Shui. Last
                updated on <span className="italic">05/07/25.</span>
              </span>
              <ul className="navbar-links">
                <li>
                  <a
                    href="mailto:danielshui.des@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                    className="squiggle"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.are.na/daniel-shui-40niceg9sse/channels"
                    target="_blank"
                    rel="noreferrer"
                    className="squiggle"
                  >
                    Are.na
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/daniel.shui/"
                    target="_blank"
                    rel="noreferrer"
                    className="squiggle"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      {/* Mobile Work/Play/Info/Index Toggle - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: loadingDone ? 1 : 0, y: loadingDone ? 0 : 20 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        }}
        className="fixed justify-between w-[calc(100vw-40px)] bottom-[20px] left-[20px] z-[999] md:hidden flex items-center gap-[4px]"
      >
        <div className="flex items-center relative gap-[4px] bg-white border border-[#E3E3E3] rounded-full w-full max-w-[264px] p-[4px]">
          <motion.span
            whileHover="hovered"
            initial={{ opacity: 1 }}
            animate={{ opacity: playActive ? 0.38 : 1 }}
            variants={{
              initial: { opacity: 1 },
              hovered: { opacity: 1 },
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            className="header-text pb-[2px] pr-[2px] z-[2] flex justify-center items-center h-[50px] w-1/2 cursor-pointer flex items-center gap-[6px]"
            onClick={() => {
              setIsIndexOpen(false);
              setIsProjectInfoOpen(false);
              setPlayActive(false);
            }}
          >
            Work
          </motion.span>
          <motion.span
            whileHover="hovered"
            initial={{ opacity: 1 }}
            animate={{ opacity: playActive ? 1 : 0.38 }}
            variants={{
              initial: { opacity: 1 },
              hovered: { opacity: 1 },
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            className="header-text pb-[2px] pl-[2px] z-[2] flex justify-center items-center h-[50px] w-1/2 cursor-pointer flex items-center gap-[6px]"
            onClick={() => {
              setIsIndexOpen(false);
              setIsProjectInfoOpen(false);
              setPlayActive(true);
            }}
          >
            Play
          </motion.span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: playActive ? "calc(100% + 4px)" : 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            className="absolute left-[4px] top-1/2 -translate-y-1/2 w-[calc(50%-6px)] h-[52px] z-[1] mobile-glow bg-[#f8f8f8] rounded-full"
          />
        </div>
        <div className="flex items-center gap-[4px]">
          <motion.span
            className="header-text w-[60px] bg-white h-[60px] border border-[#E3E3E3] rounded-full flex justify-center items-center cursor-pointer relative overflow-hidden"
            onClick={handleProjectInfoToggle}
          >
            <div className="relative w-[18px] h-[18px] overflow-hidden">
              <motion.div
                initial={{ top: "0" }}
                animate={{ top: isProjectInfoOpen ? "-18px" : "0" }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
                className="flex flex-col absolute left-1/2 -translate-x-1/2"
              >
                <span className="flex justify-center items-center h-[18px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M9 9L9 12"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <rect
                      x="10"
                      y="5"
                      width="2"
                      height="2"
                      rx="1"
                      transform="rotate(90 10 5)"
                      fill="#1C1C1C"
                    />
                    <rect
                      x="2"
                      y="2"
                      width="14"
                      height="14"
                      rx="7"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className="flex justify-center items-center h-[18px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M14.0008 13.9998L4.00098 4"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.0008 4.00019L4.00098 14"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.div>
            </div>
          </motion.span>
          <motion.span
            className="header-text w-[60px] bg-white h-[60px] border border-[#E3E3E3] rounded-full flex justify-center items-center cursor-pointer relative overflow-hidden"
            onClick={handleIndexToggle}
          >
            <div className="relative w-[18px] h-[18px] overflow-hidden">
              <motion.div
                initial={{ top: "0" }}
                animate={{ top: isIndexOpen ? "-18px" : "0" }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 1,
                }}
                className="flex flex-col absolute left-1/2 -translate-x-1/2"
              >
                <span className="flex justify-center items-center h-[18px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M15.0002 13.5H7.00024"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 9H7"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7.00024 4.5H15.0002"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2.00024 13.5C2.00024 12.9477 2.44796 12.5 3.00024 12.5C3.55253 12.5 4.00024 12.9477 4.00024 13.5C4.00024 14.0523 3.55253 14.5 3.00024 14.5C2.44796 14.5 2.00024 14.0523 2.00024 13.5Z"
                      fill="#1C1C1C"
                    />
                    <rect
                      x="2"
                      y="8"
                      width="2"
                      height="2"
                      rx="1"
                      fill="#1C1C1C"
                    />
                    <path
                      d="M2 4.5C2 3.94772 2.44772 3.5 3 3.5C3.55228 3.5 4 3.94772 4 4.5C4 5.05228 3.55228 5.5 3 5.5C2.44772 5.5 2 5.05228 2 4.5Z"
                      fill="#1C1C1C"
                    />
                  </svg>
                </span>
                <span className="flex justify-center items-center h-[18px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M14.0008 13.9998L4.00098 4"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.0008 4.00019L4.00098 14"
                      stroke="#1C1C1C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.div>
            </div>
          </motion.span>
        </div>
        {/* Detached toolbars to avoid button overflow clipping */}
        <AnimatePresence>
          {isProjectInfoOpen &&
            ((playActive && activePlayItem) ||
              (!playActive && activeProject)) && (
              <>
                <motion.div
                  key="project-info-toolbar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    mass: 1,
                  }}
                  className="toolbar toolbar-info absolute bottom-full right-[0px] mb-[20px] w-[calc(100vw-40px)] bg-white shadow-glow p-[20px] rounded-[4px] z-[1000] max-h-[calc(100dvh-180px)] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col italic">
                    {playActive && activePlayItem ? (
                      <>
                        <span
                          className="header-text not-italic !capitalize"
                          dangerouslySetInnerHTML={{
                            __html: activePlayItem.title,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <span
                          className="header-text italic !capitalize"
                          dangerouslySetInnerHTML={{
                            __html:
                              activeProject?.subtitle ||
                              activeProject?.title ||
                              "",
                          }}
                        />
                        <span
                          className="!not-italic mt-[20px]"
                          dangerouslySetInnerHTML={{
                            __html: activeProject?.desc || "",
                          }}
                        />
                        {activeProject?.date && (
                          <span className="mt-[20px]">
                            {activeProject.date}
                          </span>
                        )}
                        {activeProject?.details && (
                          <span
                            className=""
                            dangerouslySetInnerHTML={{
                              __html: activeProject.details,
                            }}
                          ></span>
                        )}
                        {activeProject?.extra && (
                          <span
                            className="mt-[20px] not-italic"
                            dangerouslySetInnerHTML={{
                              __html: activeProject.extra,
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
                <motion.div
                  key="project-info-arrow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    mass: 1,
                  }}
                  className="arrow fixed bottom-[96px] right-[114px] transform translate-x-1/2 w-[12px] h-[6px] bg-white z-[1001]"
                ></motion.div>
              </>
            )}
        </AnimatePresence>
          <motion.div
            key="index-toolbar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isIndexOpen ? 1 : 0, y: isIndexOpen ? 0 : 10 }}
            exit={{ opacity: isIndexOpen ? 0 : 1, y: isIndexOpen ? 10 :   0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            className={`absolute bottom-full w-[calc(100vw-40px)] right-0 mb-[20px] bg-white shadow-glow p-[20px] rounded-[4px] z-[1000] max-h-[calc(100dvh-180px)] overflow-y-auto ${
              isIndexOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-[20px]">
              <span className="header-text !capitalize">Index</span>
              {playActive
                ? playArray.map((playItem, index) => (
                    <motion.div
                      key={playItem.id}
                      initial={{ x: 0, opacity: 0.36 }}
                      animate={{
                        opacity: currentPlayIndex === index ? 1 : 0.36,
                        x: currentPlayIndex === index ? 6 : 0,
                      }}
                      whileHover={{ x: 6 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        mass: 1,
                      }}
                      className={`${
                        currentPlayIndex === index
                          ? "opacity-[1]"
                          : "opacity-[0.36]"
                      } cursor-pointer italic`}
                      onClick={() => {
                        setCurrentPlayIndex(index);
                        setIsIndexOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-[8px] relative">
                        <motion.div
                          className="w-[4px] h-[4px] rounded-full bg-[#1c1c1c] absolute top-[50%] -translate-y-[50%] left-[3px]"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: currentPlayIndex === index ? 1 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 1,
                          }}
                        />
                        <motion.span
                          initial={{ x: 0 }}
                          animate={{
                            x: currentPlayIndex === index ? 12 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 1,
                          }}
                          className="font-[600] not-italic"
                        >
                          {playItem.id < 10 ? "0" : ""}
                          {playItem.id}
                        </motion.span>
                      </div>
                      <div>
                        <span
                          className="title"
                          dangerouslySetInnerHTML={{
                            __html: playItem.title,
                          }}
                        ></span>
                      </div>
                    </motion.div>
                  ))
                : Object.keys(projects).map((project) => (
                    <motion.div
                      key={project}
                      initial={{ x: 0, opacity: 0.36 }}
                      animate={{
                        opacity: activeId === project ? 1 : 0.36,
                        x: activeId === project ? 6 : 0,
                      }}
                      whileHover={{ x: 6 }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        mass: 1,
                      }}
                      className={`${
                        activeId === project ? "opacity-[1]" : "opacity-[0.36]"
                      } cursor-pointer italic`}
                      onClick={() => {
                        setActiveId(project);
                        setIsIndexOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-[8px] relative">
                        <motion.div
                          className="w-[4px] h-[4px] rounded-full bg-[#1c1c1c] absolute top-[50%] -translate-y-[50%] left-[3px]"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: activeId === project ? 1 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 1,
                          }}
                        />
                        <motion.span
                          initial={{ x: 0 }}
                          animate={{ x: activeId === project ? 12 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 20,
                            mass: 1,
                          }}
                          className="font-[600] not-italic"
                        >
                          {projects[project].id < 10 ? "0" : ""}
                          {projects[project].id}
                        </motion.span>
                      </div>
                      <div>
                        <span
                          className="title"
                          dangerouslySetInnerHTML={{
                            __html: projects[project].title,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
            </div>
          </motion.div>
          <motion.div
            key="index-arrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isIndexOpen ? 1 : 0, y: isIndexOpen ? 0 : 10 }}
            exit={{ opacity: isIndexOpen ? 0 : 1, y: isIndexOpen ? 10 : 0 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              mass: 1,
            }}
            className="arrow fixed bottom-[96px] right-[50px] transform translate-x-1/2 w-[12px] h-[6px] bg-white z-[1001]"
          ></motion.div>
      </motion.div>
    </>
  );
}
