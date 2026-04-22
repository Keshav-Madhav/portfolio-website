import { nav } from "./data";

export type SectionName = (typeof nav)[number]["name"];

export type AccentColor =
  | "violet"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo";
