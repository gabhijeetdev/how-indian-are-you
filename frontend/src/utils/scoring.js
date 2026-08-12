const BADGES = [
  {
    min: 9,
    emoji: "🏆",
    name: "🇮🇳 PROUDLY INDIAN",
    message: "You know your India incredibly well! Keep exploring. Keep learning. Keep making India proud.",
  },
  {
    min: 7,
    emoji: "🎖️",
    name: "PROUDLY PATRIOT",
    message: "Seriously impressive! You clearly know your country inside out — a couple more and you're a legend.",
  },
  {
    min: 5,
    emoji: "🌟",
    name: "RISING EXPLORER",
    message: "Solid effort! You know the basics well — a little more exploring and you'll be unstoppable.",
  },
  {
    min: 3,
    emoji: "🌱",
    name: "CURIOUS BEGINNER",
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

const PERCENTILE_TABLE = [5, 12, 22, 34, 48, 61, 73, 84, 92, 97, 99];

export function getPercentile(score) {
  const clamped = Math.max(0, Math.min(10, Number(score) || 0));
  return PERCENTILE_TABLE[clamped];
}