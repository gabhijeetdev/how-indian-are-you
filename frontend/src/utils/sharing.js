// Backend base URL. In dev, Vite proxies /api to the Express server (see vite.config.js
// if you add a proxy) — or set VITE_API_URL in a .env file for production.
const APP_URL = typeof window !== "undefined" ? window.location.origin : "https://howindianareyou.app";

export function buildShareText(score) {
  return `I scored ${score}/10 on "How Indian Are You?" 🇮🇳 Think you can beat me?`;
}

export function buildChallengeLink(score) {
  return `${APP_URL}/?challenge=${score}`;
}

export function buildWhatsAppUrl(score) {
  const text = `${buildShareText(score)} ${buildChallengeLink(score)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    if (!canvas) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

/**
 * Opens the device's native share sheet with the result-card image attached
 * whenever possible, so it can be dropped straight into WhatsApp Status,
 * Instagram Stories, or sent directly to a friend. Falls back to a text+link
 * share, and finally to clipboard, for browsers that don't support file
 * sharing (most desktop browsers).
 *
 * @param {number} score
 * @param {HTMLCanvasElement | null} canvas - the rendered result card, if available
 * @returns {Promise<boolean>} whether a share/copy action actually completed
 */
export async function shareNative(score, canvas) {
  const text = buildShareText(score);
  const url = buildChallengeLink(score);

  try {
    const blob = canvas ? await canvasToBlob(canvas) : null;

    if (blob) {
      const file = new File([blob], "how-indian-are-you.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "How Indian Are You?",
          text: `${text} ${url}`,
        });
        trackEvent("share_clicked", { score, method: "native_image" });
        return true;
      }
    }

    if (navigator.share) {
      await navigator.share({ title: "How Indian Are You?", text, url });
      trackEvent("share_clicked", { score, method: "native_text" });
      return true;
    }
  } catch (err) {
    // User cancelling the share sheet is not an error worth reporting.
    if (err?.name === "AbortError") return false;
    console.error("Native share failed, falling back to clipboard:", err);
  }

  // Desktop / unsupported browsers: fall back to copying a shareable message.
  const ok = await copyToClipboard(`${text} ${url}`);
  if (ok) trackEvent("share_clicked", { score, method: "clipboard_fallback" });
  return ok;
}

export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", name, params);
    } else if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    } else if (process.env.NODE_ENV !== "production") {
      console.debug("[track]", name, params);
    }
  } catch {
    // Analytics failures should never break the app.
  }
}