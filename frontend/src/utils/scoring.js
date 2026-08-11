// Reusable scoring utility. Keep this the single source of truth for
// score -> badge mapping so Result.jsx and ResultCard.jsx never drift apart.

export const BADGES = {
  EXPLORER: { name: "INDIA EXPLORER", message: "There's still plenty of India left to discover!", emoji: "🧭" },
  ENTHUSIAST: { name: "INDIA ENTHUSIAST", message: "You know your India pretty well!", emoji: "🌟" },
  PROUD: { name: "PROUD INDIAN", message: "That's a solid score. 🇮🇳", emoji: "🏆" },
  EXPERT: { name: "INDIA EXPERT", message: "Almost perfect. Impressive!", emoji: "🎯" },
  MASTER: { name: "INDIA MASTER", message: "10/10! You really know your India.", emoji: "👑" },
};

/**
 * @param {number} score - 0 to 10
 * @returns {{name: string, message: string, emoji: string}}
 */
export function getBadge(score) {
  if (score <= 3) return BADGES.EXPLORER;
  if (score <= 6) return BADGES.ENTHUSIAST;
  if (score <= 8) return BADGES.PROUD;
  if (score === 9) return BADGES.EXPERT;
  return BADGES.MASTER;
}

// Illustrative "anonymous percentile" — for fun, not a real statistical claim.
const PERCENTILE_TABLE = { 0: 4, 1: 8, 2: 14, 3: 22, 4: 33, 5: 45, 6: 58, 7: 71, 8: 84, 9: 93, 10: 98 };

/**
 * @param {number} score - 0 to 10
 * @returns {number} percentile 0-100
 */
export function getPercentile(score) {
  return PERCENTILE_TABLE[score] ?? 50;
}
