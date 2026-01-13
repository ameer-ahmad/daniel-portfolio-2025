"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    const basePath = '';
    
    const fontFaces = [
      // Black
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-Black.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-Black.woff') format('woff')`,
        ],
        weight: 900,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-BlackIt.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-BlackIt.woff') format('woff')`,
        ],
        weight: 900,
        style: "italic",
      },
      // Bold
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-Bold.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-Bold.woff') format('woff')`,
        ],
        weight: 700,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-BoldIt.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-BoldIt.woff') format('woff')`,
        ],
        weight: 700,
        style: "italic",
      },
      // Semibold
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-Semibold.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-Semibold.woff') format('woff')`,
        ],
        weight: 600,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-SemiboldIt.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-SemiboldIt.woff') format('woff')`,
        ],
        weight: 600,
        style: "italic",
      },
      // Regular
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-Regular.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-Regular.woff') format('woff')`,
        ],
        weight: 400,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-It.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-It.woff') format('woff')`,
        ],
        weight: 400,
        style: "italic",
      },
      // Light
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-Light.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-Light.woff') format('woff')`,
        ],
        weight: 300,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-LightIt.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-LightIt.woff') format('woff')`,
        ],
        weight: 300,
        style: "italic",
      },
      // ExtraLight
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-ExtraLight.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-ExtraLight.woff') format('woff')`,
        ],
        weight: 200,
        style: "normal",
      },
      {
        family: "Source Serif Pro",
        src: [
          `url('${basePath}/fonts/SourceSerifPro-ExtraLightIt.woff2') format('woff2')`,
          `url('${basePath}/fonts/SourceSerifPro-ExtraLightIt.woff') format('woff')`,
        ],
        weight: 200,
        style: "italic",
      },
    ];

    fontFaces.forEach((font) => {
      const fontFace = new FontFace(
        font.family,
        font.src.join(", "),
        {
          weight: font.weight.toString(),
          style: font.style,
          display: "swap",
        }
      );

      fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      }).catch((error) => {
        console.error(`Failed to load font: ${font.family} ${font.weight} ${font.style}`, error);
      });
    });
  }, []);

  return null;
}

