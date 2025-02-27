import clonepen from "@/public/clonepen.png";
import notesapp from "@/public/notesapp.png";
import tetris from "@/public/Tetris.png";
import yoom from "@/public/yoom.png";
import infinitecraft from "@/public/infinitecraft.png";
import zennotes from "@/public/zennotes.png";
import fizzi from "@/public/fizzi.png";
import brainfuck from "@/public/brainfuck.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const projectsData = [
  {
    title: "Zen Notes",
    description:
    "A notion like notes taking app with markdown support. Supports collaboration & real-time updates as well as AI summarization & translation",
    tags: ["Next.js", "Firebase", "Cloudfare", 'Clerk', "LiveBlocks"],
    imageUrl: zennotes,
    redirectURL: "https://zen-notes-keshav.vercel.app/",
  },
  {
    title: "Fizzi - Soda for Gutsy People",
    description:
      "An immersive 3D landing page for Fizzi Soda using ThreeJS, featuring interactive animations and seamless content management.",
    tags: ["Next.js", "TS", "Tailwind", "GSAP", "React-Fiber", "Prismic"],
    imageUrl: fizzi,
    redirectURL: "https://fizzi-drinks.vercel.app/",
  },
  {
    title: "BrainFuck Interpreter",
    description:
      "An interpreter for an extension of the brainfuck programming language made in javascript. Engineered and optimized to perform 1Billion operations in under 6 seconds.",
    tags: ["Vanilla JS", "Web-Workers"],
    imageUrl: brainfuck,
    redirectURL: "https://github.com/Keshav-Madhav/Making-BF2",
  },
  {
    title: "Infinite Craft",
    description:
      "A merge and craft game made using GBT-4o to have infinite possibilities. Create any item by combining any two items.",
    tags: ["Next.js", "Open-AI", "Tailwind", "Framer", "LangChain"],
    imageUrl: infinitecraft,
    redirectURL: "https://infinite-craft-nine.vercel.app/",
  },
  {
    title: "ClonePen- A CodePen Clone",
    description:
      "I created a clone of CodePen. It has features like saving pens, editing pens, viewing pens and deleting pens.",
    tags: ["ReactJS", "TypeScript", "Firebase", "Tailwind"],
    imageUrl: clonepen,
    redirectURL: "https://codepen-clone-dae8e.web.app/home",
  },
  {
    title: "Tetris Game",
    description:
      "A Tetris game made in react with proper game mechanics. Has easy of live features such as piece preview and pause/resume.",
    tags: ["React", "Next.js", "Tailwind", "Framer"],
    imageUrl: tetris,
    redirectURL: "https://tetris-keshav-madhav.netlify.app/",
  },
  // {
  //   title: "A notes app",
  //   description:
  //     "A notes app where you can create, edit and delete notes. You can also add voice notes and video notes.",
  //   tags: ["React", "TypeScript", "Tailwind", "Zustand", "Framer"],
  //   imageUrl: notesapp,
  //   redirectURL: "https://a-notes-app.netlify.app/",
  // },
  {
    title: "Yoom - Video Meetings",
    description:
      "A video calling web application with functionality to create instant meetings, join meetings and schedule meetings.",
    tags: ["React", "Next.js", "stream.io", "Tailwind", "Clerk"],
    imageUrl: yoom,
    redirectURL: "https://zoom-clone-black-sigma.vercel.app/",
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Redux",
  "Zustand",
  "Framer Motion",
  "GSAP",
  "Three.js",
  "Prismic CMS", 
  "Firebase",
  "MongoDB",
  "Convex "
] as const;
