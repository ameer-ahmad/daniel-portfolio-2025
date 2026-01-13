export type VideoItem = string | { src: string; aspectRatio?: string };
export type ImageItem = string | { src: string; aspectRatio?: string };

export type MediaItem =
  | string
  | ImageItem[]
  | { type: "image"; src: string; aspectRatio?: string }
  | { type: "images"; srcs: ImageItem[] }
  | { type: "video"; src: string; aspectRatio?: string }
  | { type: "videos"; srcs: VideoItem[] };

export type ProjectType = {
  [key: string]: {
    id: number;
    title: string;
    subtitle: string;
    desc: string;
    images?: MediaItem[];
    video?: string;
    date?: string;
    details?: string;
    extra: string;
  };
};

export const projects: ProjectType = {
  "texas-rangers": {
    id: 1,
    title:
      "Texas Rangers Renewals 2026, <span class='lowercase not-italic'>websites</span>",
    subtitle:
      "Texas Rangers Renewals 2026, <span class='lowercase not-italic'>websites</span>",
    desc: "Entering the 2026 MLB season, the Texas Rangers wanted a new look that stood out as much as their big offseason changes. This campaign spanned across a series of websites, including season ticket renewals, suites, new sales, and 20-game package plans.<br /><br />I led the design direction from end-to-end, including the web experience, interfaces, navigation, and creation of new assets. My designs for these websites drew from their latest branding campaign, “Neon Roadhouse”.",
    images: [
      {
        type: "videos",
        srcs: [
          { src: "/rangers-home.mp4", aspectRatio: "960:619" },
          { src: "/mobile-rangers.mp4", aspectRatio: "285:619" },
        ],
      },
      { type: "video", src: "/rangers-loader.mp4", aspectRatio: "1283:849" },
      {
        type: "images",
        srcs: [
          { src: "/cutout-01.png", aspectRatio: "201:508" },
          { src: "/cutout-02.png", aspectRatio: "246:509" },
          { src: "/cutout-03.png", aspectRatio: "411:509" },
          { src: "/cutout-04.png", aspectRatio: "305:509" },
        ],
      },
      {
        type: "images",
        srcs: [
          { src: "/rangers-components-1.1.jpg", aspectRatio: "671:471" },
          { src: "/rangers-components-1.jpg", aspectRatio: "571:897" },
        ],
      },
      
      { type: "image", src: "/rangers-components-2.jpg" },
      { type: "image", src: "/all-for-texas.jpg" },
    ],
    date: "July 2025",
    details: "Website Series",
    extra: "",
  },
  "analog-digital": {
    id: 2,
    title:
      "Analog to Digital, <span class='lowercase not-italic'>thesis book</span>",
    subtitle:
      "Analog to Digital, <span class='lowercase not-italic'>thesis book</span>",
    desc: "Analog to Digital is the culmination of work produced for my graphic design bachelor’s thesis. It compiles a year’s worth of essays, research, experiments, and final work, which seeks to reintroduce physical experimentation into today’s overwhelmingly software-driven design processes. My projects specifically focus on my interest in typography, with each emphasizing materiality, unexpected play, and form. This was done to create letterforms that weren’t just meant to be read but also experienced and seen.<br /><br />Each copy was hand-bound and includes a manually typeset corrugated cover, a nod back to the contents in the book. The majority of the book was printed through RISO, with different papers and inks used to distinguish the stages within it.",
    images: [
      { type: "image", src: "/covers.jpg" },
      { type: "image", src: "/analog-to-digital-1-2.jpg" },
      { type: "image", src: "/analog-to-digital-1-1.jpg" },
      { type: "image", src: "/analog-to-digital-1.jpg" },
    ],
    date: "May 2024",
    details: "14 x 21 cm<br />268 pages",
    extra: "",
  },
  "exhibition-poster": {
    id: 3,
    title:
      "Pluriversal Typography in Local and Global Contexts, <span class='lowercase not-italic'>Exhibition Poster</span>",
    subtitle:
      "Pluriversal Typography in Local and Global Contexts, <span class='lowercase not-italic'>Exhibition Poster</span>",
    desc: "In this international cultural exchange, students from OCAD and Hongik University collaborated in Seoul in honour of the sixtieth anniversary of diplomatic relations between South Korea and Canada. The exhibition shows the final works of a week-long intensive workshop, site-visits related to Korean culture, and the celebration of Hangul Day.<br /><br />Taking advantage of the angular construction found throughout the Korean Hangul alphabet, the letterform graphic is created through light beams. Using spotlights, I cast light on surfaces from different angles to create organic letterforms reminiscent of traditional Korean calligraphy (서예), representing the cultural focus of the exhibition. The poster is printed on black paper using multiple layers of white RISO ink.",
    images: [
      "/korean-poster.png",
      ["/korean-poster-2.png", "/korean-poster-3.png"],
    ],
    date: "January 2024",
    details: "20 x 44 cm",
    extra:
      "Exhibited as part of <a href='https://swashandserif.ca/shows/eight' target='_blank' rel='noreferrer' class='underline squiggle'>Swash & Serif 8</a>",
  },
  exran: {
    id: 4,
    title:
      "Exran, <span class='lowercase not-italic'><span class='uppercase'>WIP</span> sans serif typeface</span>",
    subtitle:
      "Exran, <span class='lowercase not-italic'><span class='uppercase'>WIP</span> sans serif typeface</span>",
    desc: "Exran is a contemporary neo-grotesque sans-serif typeface built for versatility. It is unique, featuring contrasting stroke widths, distinctive terminals, and lowered ascenders/descenders throughout its letterforms. This typeface seeks to excel whether on screen or print, body copy or header.<br /><br /><ol class='numbered-list'><li>Curved terminals always end at a 20° angle with the exception of the lowercase “a”.</li><li>Specific lowercase letterforms (a, b, d, g, m, n, p, q, r, and u) have their overhanging terminals tapered.</li><li>Each letterform has a noticeable and consistent amount of stroke width contrast.</li><li>The lowercase “a” does not have its round terminal angled because of a stylistic choice to preserve its natural/organic shape.</li><li>Crossbars of the lower-case letters “a” and “e” are aligned.</li></ol>",
    images: [
      { type: "image", src: "/exran.jpg" },
      { type: "image", src: "/exran-window.jpg" },
    ],
    date: "2023-Ongoing",
    details: "Typeface",
    extra: "",
  },
  olympiad: {
    id: 5,
    title:
      "40th Science Olympiad at Michigan State University, <span class='lowercase not-italic'>event poster</span>",
    subtitle:
      "40th Science Olympiad at Michigan State University, <span class='lowercase not-italic'>event poster</span>",
    desc: "The Science Olympiad is one of the largest STEM competitions in the USA, uniting students, teachers, and volunteers across the 50 states in their passion for science. In anticipation of their 40th annual event at Michigan State University, I designed an experimental concept poster.<br /><br />For this project, the idea was to create visually interesting letterforms by combining analog and digital design processes, an idea I was exploring concurrently in my thesis project. This method of designing and its unique results reflected the observational and experimental nature of science itself.<br /><br />The “S and O” were created through experimentation with different cause-and-effect reactions on liquid substrates, leading to some organic forms. In the end, this project was showcased at Swash & Serif, Toronto’s only annual typographic and lettering exhibition.",
    images: [
      { type: "image", src: "/so-poster.jpg" },
      { type: "image", src: "/s-horizontal.png" },
      { type: "image", src: "/o-vertical.png" },
    ],
    date: "April 2024",
    details: "28 x 43 cm",
    extra:
      "Exhibited as part of <a href='https://swashandserif.ca/shows/eight' target='_blank' rel='noreferrer' class='underline squiggle'>Swash & Serif 8</a>",
  },
};
