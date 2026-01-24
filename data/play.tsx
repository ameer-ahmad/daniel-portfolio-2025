import { MediaItem } from "./projects";

export type PlayType = {
  id: number;
  title: string;
  images?: MediaItem[];
};

export const playArray: PlayType[] = [
  {
    id: 1,
    title: "TouchDesigner experimentation",
    images: [{ type: "video", src: "/Sequence_01_1.mp4" }],
  },
  {
    id: 2,
    title: "<span class='italic'>NASC GEAR</span>, unused clothing brand concepts",
    images: [{ type: "image", src: "/nasc.png" }],
  },
  
  {
    id: 3,
    title:
      "<span class='italic'>Thesis experiments</span>, photogrammetry-scanned render of Letraset on circuit board",
    images: [{ type: "video", src: "/Finalvid.mp4" }],
  },
  {
    id: 4,
    title:
      "<span class='italic'>Thesis experiments</span>, double-sided print of Letraset on circuit board",
    images: [{ type: "image", src: "/closeup2-1.jpg" }],
  },
  {
    id: 5,
    title:
      "<span class='italic'>Digital Materiality</span>, Blender texture experimentations",
    images: [{ type: "image", src: "/digital-materiality-1.png" }],
  },
  {
    id: 6,
    title:
      "<span class='italic'>Thesis experiments</span>, foam-sealant letterforms",
    images: [{ type: "image", src: "/scroll-1.jpg" }],
  },
  {
    id: 7,
    title:
      "<span class='italic'>Reconfigurable Typography A-Z</span>, bound in book-form",
    images: [{ type: "image", src: "/img8341.jpg" }],
  },
  {
    id: 8,
    title:
      "<span class='italic'>Reconfigurable Typography A-Z</span>, unbound in poster-form",
    images: [{ type: "image", src: "/poster1-2.jpg" }],
  },
];
