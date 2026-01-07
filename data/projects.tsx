export type ProjectType = {
  [key: string]: {
    id: number;
    title: string;
    subtitle: string;
    desc: string;
    images?: (string | string[])[];
    video?: string;
    date?: string;
    details?: string;
    extra: string;
  };
};

export const projects: ProjectType = {
  "chicago-bulls": {
    id: 1,
    title: "Chicago Bulls 2025-26, <span class='lowercase not-italic'>renewal websites</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
  "analog-digital": {
    id: 2,
    title: "Analog to Digital, <span class='lowercase not-italic'>thesis book</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
  "exhibition-poster": {
    id: 3,
    title: "Pluriversal Typography in Local and Global Contexts, <span class='lowercase not-italic'>Exhibition Poster</span>",
    subtitle: "Pluriversal Typography in Local and Global Contexts, <span class='not-italic capitalize'>Exhibition Poster Design</span>",
    desc: "In this international cultural exchange, students from OCAD and Hongik University collaborated in Seoul in honour of the sixtieth anniversary of diplomatic relations between South Korea and Canada. The exhibition shows the final works of a week-long intensive workshop, site-visits related to Korean culture, and the celebration of Hangul Day.<br /><br />Taking advantage of the angular construction found throughout the Korean Hangul alphabet, the letterform graphic is created through light beams. Using spotlights, I cast light on surfaces from different angles to create organic letterforms reminiscent of traditional Korean calligraphy (서예), representing the cultural focus of the exhibition. The poster is printed on black paper using RISO.",
    images: ["/korean-poster.png", ["/korean-poster-2.png", "/korean-poster-3.png"]],
    date: "January 2024",
    details: "20 x 44 cm",
    extra:
      "Exhibited in part of <a href='https://swashserif8.com' target='_blank' rel='noreferrer' class='underline squiggle'>Swash & Serif 8</a>",
  },
  "texas-rangers": {
    id: 4,
    title: "Texas Rangers 2025-26, <span class='lowercase not-italic'>websites series</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
  "double-sided-poster": {
    id: 5,
    title: "How can materiality/craft be applied to create type that challenges the ubiquitous nature of digital design, <span class='lowercase not-italic'>double-sided poster</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
  "exran": {
    id: 6,
    title: "Exran, <span class='lowercase not-italic'><span class='uppercase'>WIP</span> sans serif typeface</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
  "olympiad": {
    id: 7,
    title: "40th Science Olympiad at Michigan State University, <span class='lowercase not-italic'>event poster</span>",
    subtitle: "",
    desc: "",
    images: [],
    date: "",
    details: "",
    extra:
      "",
  },
};
