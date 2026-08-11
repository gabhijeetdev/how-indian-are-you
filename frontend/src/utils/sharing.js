// Backend base URL. In dev, Vite proxies /api to the Express server (see vite.config.js
// if you add a proxy) — or set VITE_API_URL in a .env file for production.
const API_URL = import.meta.env.VITE_API_URL || "";

export function buildShareText(score) {
  return `🇮🇳 I scored ${score}/10 on the *How Indian Are You?* challenge!\n\nThink you can beat me? 👀`;
}

export function buildWhatsAppUrl(score) {
  return `https://wa.me/?text=${encodeURIComponent(buildShareText(score))}`;
}

export async function shareNative(score) {
  if (navigator.share) {
    try {
      await navigator.share({ text: buildShareText(score), title: "How Indian Are You?" });
      return true;
    } catch {
      return false; // user cancelled
    }
  }
  return copyToClipboard(buildShareText(score));
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function buildChallengeLink(score) {
  try {
    const url = new URL(window.location.href);
    url.pathname = "/";
    url.search = `?challenge=${score}`;
    return `I scored ${score}/10 on How Indian Are You? Beat me: ${url.toString()}`;
  } catch {
    return `Play "How Indian Are You?" — I scored ${score}/10, beat me if you can! 🇮🇳`;
  }
}

/**
 * Fire-and-forget anonymous analytics event. Never blocks the UI and never
 * throws — if the backend isn't deployed/reachable, this silently no-ops so
 * the quiz keeps working with zero backend dependency.
 * @param {string} event - e.g. "quiz_started", "question_answered"
 * @param {object} [payload]
 */
export function trackEvent(event, payload = {}) {
  if (!API_URL) return;
  try {
    fetch(`${API_URL}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload, timestamp: Date.now() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the app */
  }
}
