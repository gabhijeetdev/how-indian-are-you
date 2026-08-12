const APP_URL = typeof window !== "undefined" ? window.location.origin : "https://howindianareyou.app";

export function buildShareText(score) {
  return `I scored ${score}/10 on "HOW WELL DO YOU KNOW INDIA?" 🇮🇳 Think you can beat me?`;
}

export function buildChallengeLink(score) {
  return `${APP_URL}/?challenge=${score}`;
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
          title: "HOW WELL DO YOU KNOW INDIA?",
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
    if (err?.name === "AbortError") return false;
    console.error("Native share failed, falling back to clipboard:", err);
  }

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
    
  }
}