import React, { useState } from "react";
import { Share2, Copy, Download, MessageCircle, Trophy, Check } from "lucide-react";
import { buildWhatsAppUrl, shareNative, copyToClipboard, buildShareText, buildChallengeLink, trackEvent } from "../utils/sharing";

export default function ShareButtons({ score, getCanvas }) {
  const [copied, setCopied] = useState(false);
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
  const handleWhatsAppText = () => {
    trackEvent("whatsapp_clicked", { score, method: "text_link" });
    window.open(buildWhatsAppUrl(score), "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildShareText(score));
    if (ok) {
      setCopied(true);
      trackEvent("share_clicked", { score, method: "copy_link" });
      window.setTimeout(() => setCopied(false), 2000);
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

  const iconBtnStyle = { borderRadius: 14, padding: "12px 10px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };

  return (
    <>
      {/* Primary CTA — this is the one that posts the actual badge image */}
      <button
        className="btn btn-primary"
        style={{
          width: "100%",
          maxWidth: 340,
          borderRadius: 14,
          padding: "16px 10px",
          fontSize: 16,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 8,
        }}
        onClick={handleNativeShare}
        disabled={sharing}
        aria-busy={sharing}
      >
        <Share2 size={20} /> {sharing ? "Opening share sheet…" : "Share Your Badge"}
      </button>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "var(--ink-soft)", textAlign: "center", maxWidth: 320 }}>
        Posts the badge image itself — pick WhatsApp Status, Instagram Stories, or send it directly to a friend.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 340, marginBottom: 12 }}>
        <button className="btn btn-secondary" style={iconBtnStyle} onClick={handleWhatsAppText}>
          <MessageCircle size={16} /> WhatsApp (text)
        </button>
        <button className="btn btn-secondary" style={iconBtnStyle} onClick={handleCopy}>
          {copied ? <Check size={16} color="var(--green)" /> : <Copy size={16} />} {copied ? "Copied" : "Copy Link"}
        </button>
        <button className="btn btn-secondary" style={{ ...iconBtnStyle, gridColumn: "1 / -1" }} onClick={handleDownload}>
          <Download size={16} /> Save Card to Photos
        </button>
      </div>

      <button
        className="btn"
        style={{ width: "100%", maxWidth: 340, borderRadius: 14, padding: "14px 10px", fontSize: 15, background: "#EAF1FE", color: "var(--chakra)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 22 }}
        onClick={handleChallenge}
      >
        <Trophy size={18} /> {challengeCopied ? "Challenge link copied!" : "Challenge a Friend"}
      </button>
    </>
  );
}