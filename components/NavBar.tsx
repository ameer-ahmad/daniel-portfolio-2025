"use client";
import { motion } from "framer-motion";
import "@/app/globals.css";
import { useState } from "react";
import { useLoadingDone } from "@/app/(lib)/stores/useLoadingDone";
import { useActiveProject } from "@/app/(lib)/stores/useActiveProject";
export default function NavBar() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { loadingDone } = useLoadingDone();
  const { setPlayActive, setActiveId, playActive } = useActiveProject();
  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };
  const resetInfo = () => {
    if (playActive) {
      setPlayActive(false);
      setTimeout(() => {
        setActiveId("exhibition-poster");
      }, 800);
    } else {
      setActiveId("exhibition-poster");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: loadingDone ? 1 : 0, y: loadingDone ? 0 : "-100%" }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 20,
        mass: 1,
      }}
      className="relative z-[999] shadow-glow"
    >
      <motion.div
        initial={{ height: "60px" }}
        animate={{ height: isInfoOpen ? "339px" : "60px" }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 1,
        }}
        className="bg-white text-[#1c1c1c]  px-[20px] overflow-hidden relative z-[999]"
      >
        <div className="flex items-center justify-between w-full h-[60px]">
          <div className="flex items-start gap-[210px] h-[20px] w-[485px] mb-[2px] overflow-hidden relative">
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
              className="flex flex-col absolute right-0"
            >
              <motion.span
                whileHover="hovered"
                initial="initial"
                onClick={toggleInfo}
                className="header-text flex items-center gap-[2px] cursor-pointer h-full"
              >
                CLOSE
                  <motion.svg
                    variants={{
                      initial: { scale: 1 },
                      hovered: {
                        scale: 0.666666666,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
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
              </motion.span>
              <motion.span
                whileHover="hovered"
                initial="initial"
                onClick={toggleInfo}
                className="header-text flex items-center gap-[2px] cursor-pointer h-full"
              >
                INFO
                <motion.span className="grid grid-cols-2 w-[7px] h-[7px] gap-[1px]">
                  <motion.span
                    variants={{
                      initial: { scale: 1 },
                      hovered: {
                        scale: 0.666666666,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
                    className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                  ></motion.span>
                  <motion.span
                    variants={{
                      initial: { scale: 1 },
                      hovered: {
                        scale: 0.666666666,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
                    className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                  ></motion.span>
                  <motion.span
                    variants={{
                      initial: { scale: 1 },
                      hovered: {
                        scale: 0.666666666,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
                    className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                  ></motion.span>
                  <motion.span
                    variants={{
                      initial: { scale: 1 },
                      hovered: {
                        scale: 0.666666666,
                        transition: { duration: 0.25, ease: "easeOut" },
                      },
                    }}
                    className="w-[3px] h-[3px] rounded bg-[#1c1c1c] block"
                  ></motion.span>
                </motion.span>
              </motion.span>
            </motion.div>
          </div>
          <div className="flex justify-between items-center gap-[40px] pr-[8px] mb-[2px]">
            <motion.span
              whileHover="hovered"
              initial={{ opacity: 1 }}
              animate={{ opacity: playActive ? 0.38 : 1 }}
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
                  width: 4,
                  height: 4,
                  x: 1,
                  transition: { duration: 0.25, ease: "easeOut" },
                },
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
              }}
               className="w-[6px] h-[6px] border-[2px] m-[2px] solid #1c1c1c rounded-full block" />
            </motion.span>
            <motion.span
              whileHover="hovered"
              initial={{ opacity: 1 }}
              animate={{ opacity: playActive ? 1 : 0.38 }}
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
                  width: 4,
                  height: 4,
                  x: 1,
                  transition: { duration: 0.25, ease: "easeOut" },
                },
              }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 1,
              }}
               className="w-[6px] h-[6px] border-[2px] m-[2px] solid #1c1c1c rounded-full block" />
            </motion.span>
          </div>
        </div>
        <div className="flex mt-[20px] justify-start gap-[20px] w-full h-[279px] text-[14px] line-height-[20px]">
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
            className="w-[407px]"
          >
            Toronto-based multidisciplinary designer developing digital and
            print projects for individuals, businesses, and organizations across
            various sectors. With a keen eye for details and a passion for
            experimentation + aesthetics, he specializes in crafting distinctive
            and cohesive visual experiences.
            <br />
            <br />
            His practice encompasses editorial/layout design, typography, brand
            development, creative direction, UI/UX, & more. He has worked on
            projects for clients both big and small, including the Chicago
            Bulls, Crypto.com Arena, Texas Rangers, Olympics, FIFA, FC
            Barcelona, & many more.
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
            className="flex flex-col gap-[20px] w-[265px]"
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
                  href="mailto:danielshui.design@gmail.com"
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
              <li>Resume</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
