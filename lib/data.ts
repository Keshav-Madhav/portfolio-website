import clonepen from "@/public/clonepen.png";
import notesapp from "@/public/notesapp.png";
import tetris from "@/public/Tetris.png";

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
    tags: ["React", "TypeScript", "Tailwind", "Zustand", "Framer Motion"],
    imageUrl: notesapp,
    redirectURL: "https://a-notes-app.netlify.app/",
  },
  {
    title: "Tetris Game",
    description:
      "A Tetris game made in react with the help of react hooks. It has features like start, pause, resume and restart.",
    tags: ["React", "Next.js", "SQL", "Tailwind", "Framer"],
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
