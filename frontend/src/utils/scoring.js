const BADGES = [
  {
    min: 7,
    emoji: "🇮🇳 ",
    name: "PROUDLY INDIAN",
    message:
      "You know your India incredibly well! Keep exploring, keep learning, and keep making India proud.",
  },
  {
    min: 0,
    emoji: "🇮🇳",
    name: "PROUDLY INDIAN",
    message:
      "Great start! There’s so much more of India to discover. Keep exploring, keep learning",
  },
];

export function getBadge(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  return BADGES.find((b) => clamped >= b.min) ?? BADGES[BADGES.length - 1];
}

const PERCENTILE_TABLE = [5, 12, 22, 34, 48, 61, 73, 84, 92, 97, 99];

export function getPercentile(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  return PERCENTILE_TABLE[clamped];
}