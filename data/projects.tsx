export type ProjectType = {
  [key: string]: {
    id: number;
    title: string;
    desc: string;
    image?: string;
    mobile?: string;
    bg: string;
    video?: string;
    date?: string;
    details?: string;
    extra?: string;
  };
};

export const projects: ProjectType = {
  "exhibition-poster": {
    id: 1,
    title: "Exhibition poster",
    desc: "Pluriversal Typography in Local and Global Contexts",
    image: "/hongik-poster.jpg",
    mobile: "/hongik-poster-mobile.jpg",
    bg: "white",
    date: "January 2024",
    details: "20 x 44 cm",
    extra: "Exhibited as part of Swash & Serif 8",
  },
  "double-sided-poster": {
    id: 2,
    title: "Double-sided poster",
    desc: "How can materiality/craft be applied to create type that challenges the ubiquitous nature of digital design?",
    image: "/circuit-posters.jpg",
    mobile: "/circuit-poster-mobile.jpg",
    bg: "white",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "thesis-book": {
    id: 3,
    title: "Thesis book with works and essays",
    desc: "Analog to Digital, Design Thesis",
    image: "/thesis-book-covers.jpg",
    mobile: "/thesis-book-covers-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "thesis-book-essay-spreads": {
    id: 4,
    title: "Thesis book essay spreads",
    desc: "Analog to Digital, Design Thesis",
    image: "/analog-to-digital-1.jpg",
    mobile: "/analog-to-digital-1-mobile.jpg",
    bg: "black",
    date: "January 2024",
  },
  "thesis-book-content-spreads": {
    id: 5,
    title: "Thesis book content spreads",
    desc: "Analog to Digital, Design Thesis",
    image: "/analog-to-digital-2.jpg",
    mobile: "/analog-to-digital-2-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "analog-to-digital-finals-spreads": {
    id: 6,
    title: "Thesis book finals spreads",
    desc: "Analog to Digital, Design Thesis",
    image: "/analog-to-digital-3.jpg",
    mobile: "/analog-to-digital-3-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "analog-to-digital-scroll-poster": {
    id: 7,
    title: "Experimental long-format scroll poster",
    desc: "Analog to Digital, Design Thesis",
    image: "/chineseposter.jpg",
    mobile: "/scroll-poster-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "analog-to-digital-materiality": {
    id: 8,
    title: "Experiments with Digital Materiality",
    desc: "Analog to Digital, Design Thesis",
    image: "/3d-type.jpg",
    mobile: "/3d-letters-mobile.jpg",
    bg: "white",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "reconfigurable-typography": {
    id: 9,
    title: "A blueprint to physical making",
    desc: "Reconfigurable Typography A-Z",
    image: "/reconfig-type.jpg",
    mobile: "/reconfigurable-mobile.jpg",
    bg: "white",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "texas-rangers-ticket-renewal": {
    id: 10,
    title:
      "Single-page website for season ticket holders, project led by John Dermody",
    desc: "2024 Texas Rangers Ticket Renewal",
    video: "/rangers-video.mp4",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "exran-sans": {
    id: 11,
    title: "Type specimen for ongoing work-in-process display typeface",
    desc: "Exran Sans",
    image: "/typespecimen.jpg",
    mobile: "/exran-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
  "experimental-poster": {
    id: 12,
    title: "Experimental poster",
    desc: "40th Science Olympiad at Michigan State University",
    image: "/so-poster.jpg",
    mobile: "/so-poster-mobile.jpg",
    bg: "black",
    date: "January 2024",
    details: "20 x 44 cm",
  },
};
