"use client";
import { motion } from "framer-motion";
import "@/app/globals.css";
import { useState } from "react";

export default function NavBar() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  return (
    <motion.div
      initial={{ height: "60px" }}
      animate={{ height: isInfoOpen ? "339px" : "60px" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
      className="bg-white text-[#1c1c1c]  px-[20px] shadow-glow"
    >
      <div className="flex items-center justify-between w-full h-[60px]">
        <div className="flex items-center gap-[210px]">
          <span className="header-text w-[217px]">Daniel Shui</span>
          <span
            onClick={toggleInfo}
            className="header-text flex items-center gap-[2px] cursor-pointer"
          >
            INFO
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
            >
              <rect
                x="4.25"
                y="7"
                width="1.5"
                height="1.5"
                stroke="#1C1C1C"
                strokeWidth="1.5"
              />
              <rect
                x="4.25"
                y="2"
                width="1.5"
                height="1.5"
                stroke="#1C1C1C"
                strokeWidth="1.5"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-center gap-[40px] pr-[8px]">
          <span className="header-text cursor-pointer">Work</span>
          <span className="header-text cursor-pointer">Play</span>
        </div>
      </div>
      <div className="flex mt-[20px] justify-start gap-[20px] w-full h-[279px] text-[14px] line-height-[20px]">
        <motion.span
          initial={{ color: "rgba(0, 0, 0, 0)" }}
          animate={{
            color: isInfoOpen ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)",
          }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 1,
          }}
          className="w-[407px]"
        >
          Toronto-based multidisciplinary designer developing digital and print
          projects for individuals, businesses, and organizations across various
          sectors. With a keen eye for details and a passion for experimentation
          + aesthetics, he specializes in crafting distinctive and cohesive
          visual experiences.
          <br />
          <br />
          His practice encompasses editorial/layout design, typography, brand
          development, creative direction, UI/UX, & more. He has worked on
          projects for clients both big and small, including the Chicago Bulls,
          Crypto.com Arena, Texas Rangers, Olympics, FIFA, FC Barcelona, & many
          more.
        </motion.span>
        <motion.div
          initial={{ color: "rgba(0, 0, 0, 0)" }}
          animate={{
            color: isInfoOpen ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)",
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
            Special thanks to Ameer Ahmad, for programming this website.
            Designed by Daniel Shui. Last updated on{" "}
            <span className="italic">05/07/25.</span>
          </span>
          <ul>
            <li>Email</li>
            <li>Are.na</li>
            <li>Instagram</li>
            <li>Resume</li>
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
