"use client";

import { ProjectType } from "@/data/projects";
import Image from "next/image";

export default function Project({
  project, firstProject
}: {
  project: ProjectType[keyof ProjectType];
  firstProject: boolean
}) {
  return (
    <div className="w-[calc(100%-142px)] h-[-webkit-fill-available] shadow-glow py-[90px] px-[134px] bg-white">
      <div className="w-full h-full relative">
        {project.image && (
          <Image
            src={`/daniel-portfolio-2025/images${project.image}`}
            alt={project.title}
            fill
            sizes="100%"
            className="object-contain"
            priority={firstProject}
          />
        )}
      </div>
    </div>
  );
}
