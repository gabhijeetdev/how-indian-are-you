/**
 * Badge tiers, ordered high -> low. `min` is inclusive.
 * Messages are intentionally tuned: 8-10 = congratulatory, 5-7 = encouraging-positive,
 * 0-4 = encouraging-motivational (never harsh — this is just for fun).
 */
const BADGES = [
  {
    min: 9,
    emoji: "🏆",
    name: "India Expert",
    message: "You know your India incredibly well! Keep exploring. Keep learning. Keep making India proud.",
  },
  {
    min: 7,
    emoji: "🎖️",
    name: "Proud Patriot",
    message: "Seriously impressive! You clearly know your country inside out — a couple more and you're a legend.",
  },
  {
    min: 5,
    emoji: "🌟",
    name: "Rising Explorer",
    message: "Solid effort! You know the basics well — a little more exploring and you'll be unstoppable.",
  },
  {
    min: 3,
    emoji: "🌱",
    name: "Curious Beginner",
    message: "A great start! There's so much more of India to discover — give it another shot and watch your score climb.",
  },
  {
    min: 0,
    emoji: "💡",
    name: "India in the Making",
    message: "Everyone starts somewhere! Take another crack at it — you'll surprise yourself next time.",
  },
];

export function getBadge(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  return BADGES.find((b) => clamped >= b.min) ?? BADGES[BADGES.length - 1];
}

/** Rough, deterministic "you scored higher than X% of players" figure. */
const PERCENTILE_TABLE = [5, 12, 22, 34, 48, 61, 73, 84, 92, 97, 99];

export function getPercentile(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  return PERCENTILE_TABLE[clamped];
}