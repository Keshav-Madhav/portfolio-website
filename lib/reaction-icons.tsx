import { memo } from "react";

// Reactions use a custom 3D illustration pack stored in /public/reactions/.
// Distinctive rendered look — chunky, warm gradients, shadow-baked — nothing
// like any OS emoji set. Each PNG is a unique character/object the visitor
// "throws" at the page.

export type ReactionKey =
  | "otter"
  | "goblin"
  | "mushroom"
  | "sloth"
  | "yoyo"
  | "crystal"
  | "mate"
  | "wilted";

export type Reaction = {
  key: ReactionKey;
  label: string;
  src: string;
};

export const REACTIONS: Reaction[] = [
  { key: "otter", label: "vibing", src: "/reactions/otter.png" },
  { key: "goblin", label: "goblin mode", src: "/reactions/goblin.png" },
  { key: "mushroom", label: "magic", src: "/reactions/mushroom.png" },
  { key: "sloth", label: "chill", src: "/reactions/sloth.png" },
  { key: "yoyo", label: "yoyo", src: "/reactions/yoyo.png" },
  { key: "crystal", label: "oracle", src: "/reactions/crystal.png" },
  { key: "mate", label: "mate", src: "/reactions/mate.png" },
  { key: "wilted", label: "wilted", src: "/reactions/wilted.png" },
];

export const REACTIONS_BY_KEY: Record<ReactionKey, Reaction> = REACTIONS.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {} as Record<ReactionKey, Reaction>,
);

export const ReactionIcon = memo(function ReactionIcon({
  reactionKey,
  size = 48,
  className,
}: {
  reactionKey: ReactionKey;
  size?: number;
  className?: string;
}) {
  const r = REACTIONS_BY_KEY[reactionKey];
  if (!r) return null;
  return (
    <img
      src={r.src}
      alt={r.label}
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      loading="eager"
      className={className}
      style={{ display: "block" }}
    />
  );
});
