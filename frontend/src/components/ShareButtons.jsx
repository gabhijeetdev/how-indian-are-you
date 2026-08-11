import React, { useState } from "react";
import { Share2, Download, Trophy } from "lucide-react";
import { shareNative, copyToClipboard, buildChallengeLink, trackEvent } from "../utils/sharing";

export default function ShareButtons({ score, getCanvas }) {
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleNativeShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const canvas = getCanvas?.();
      await shareNative(score, canvas);
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = () => {
    const canvas = getCanvas?.();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `how-indian-are-you-${score}-10.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    trackEvent("card_downloaded", { score });
  };

  const handleChallenge = async () => {
    const ok = await copyToClipboard(buildChallengeLink(score));
    if (ok) {
      setChallengeCopied(true);
      trackEvent("challenge_created", { score });
      window.setTimeout(() => setChallengeCopied(false), 2000);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Main Native Share Button */}
      <button
        className="btn btn-primary"
        style={{
          width: "100%",
          borderRadius: 14,
          padding: "16px 10px",
          fontSize: 16,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
        onClick={handleNativeShare}
        disabled={sharing}
        aria-busy={sharing}
      >
        <Share2 size={20} /> {sharing ? "Opening share sheet…" : "Share Your Result"}
      </button>

      {/* Challenge Link */}
      <button
        className="btn"
        style={{
          width: "100%",
          borderRadius: 14,
          padding: "14px 10px",
          fontSize: 15,
          background: "#EAF1FE",
          color: "var(--chakra)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onClick={handleChallenge}
      >
        <Trophy size={18} /> {challengeCopied ? "Challenge link copied!" : "Challenge a Friend"}
      </button>

      {/* Save Image (Desktop / Fallback) */}
      <button
        className="btn btn-secondary"
        style={{
          borderRadius: 14,
          padding: "12px 10px",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
        onClick={handleDownload}
      >
        <Download size={16} /> Save Image
      </button>
    </div>
  );
}