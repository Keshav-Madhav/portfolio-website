const ADJECTIVES = [
  "Curious",
  "Playful",
  "Sleepy",
  "Glowing",
  "Fearless",
  "Quiet",
  "Witty",
  "Tiny",
  "Cosmic",
  "Velvet",
  "Lucid",
  "Eager",
  "Stoic",
  "Wandering",
  "Restless",
  "Hidden",
];

const NOUNS = [
  "Otter",
  "Fox",
  "Comet",
  "Lantern",
  "Pixel",
  "Heron",
  "Shadow",
  "Ember",
  "Owl",
  "Drift",
  "Echo",
  "Moth",
  "Glyph",
  "Rune",
  "Cipher",
  "Specter",
];

const COLORS = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#84cc16",
  "#14b8a6",
];

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export type Identity = { name: string; color: string };

export function getOrCreateIdentity(): Identity {
  if (typeof window === "undefined") {
    return { name: `${pick(ADJECTIVES)} ${pick(NOUNS)}`, color: pick(COLORS) };
  }

  let name = localStorage.getItem("cursor-name");
  let color = localStorage.getItem("cursor-color");

  if (!name) {
    name = `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
    localStorage.setItem("cursor-name", name);
  }
  if (!color) {
    color = pick(COLORS);
    localStorage.setItem("cursor-color", color);
  }

  return { name, color };
}

export function setIdentityName(name: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cursor-name", name);
}
