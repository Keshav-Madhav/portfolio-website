import clonepen from "@/public/clonepen.png";
import notesapp from "@/public/notesapp.png";
import tetris from "@/public/Tetris.png";
import yoom from "@/public/yoom.png";
import infinitecraft from "@/public/infinitecraft.png";

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
    title: "ClonePen- A CodePen Clone",
    description:
      "I created a clone of CodePen. It has features like saving pens, editing pens, viewing pens and deleting pens.",
    tags: ["ReactJS", "TypeScript", "Firebase", "Tailwind"],
    imageUrl: clonepen,
    redirectURL: "https://codepen-clone-dae8e.web.app/home",
  },
  {
    title: "A notes app",
    description:
      "A notes app where you can create, edit and delete notes. You can also add voice notes and video notes.",
    tags: ["React", "TypeScript", "Tailwind", "Zustand", "Framer"],
    imageUrl: notesapp,
    redirectURL: "https://a-notes-app.netlify.app/",
  },
  {
    title: "Yoom - Video Meetings",
    description:
      "A video calling web application with functionality to create instant meetings, join meetings and schedule meetings.",
    tags: ["React", "Next.js", "stream.io", "Tailwind", "Clerk"],
    imageUrl: yoom,
    redirectURL: "https://zoom-clone-black-sigma.vercel.app/",
  },
  {
    title: "Infinite Craft",
    description:
      "A merge and craft game made using GBT-4o to have infinite possibilities. Create any item by combining any two items.",
    tags: ["Next.js", "Open-AI", "Tailwind", "Framer", "LangChain"],
    imageUrl: infinitecraft,
    redirectURL: "https://tetris-keshav-madhav.netlify.app/",
  },
  {
    title: "Tetris Game",
    description:
      "A Tetris game made in react with the help of react hooks. It has features like start, pause, resume and restart.",
    tags: ["React", "Next.js", "Tailwind", "Framer"],
    imageUrl: tetris,
    redirectURL: "https://tetris-keshav-madhav.netlify.app/",
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Tailwind",
  "Redux",
  "Zustand",
  "Python",
  "Framer Motion",
] as const;
