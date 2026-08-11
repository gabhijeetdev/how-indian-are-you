import React, { useState } from "react";
import { Share2, Copy, Download, MessageCircle, Trophy, Check } from "lucide-react";
import { buildWhatsAppUrl, shareNative, copyToClipboard, buildShareText, buildChallengeLink, trackEvent } from "../utils/sharing";

export default function ShareButtons({ score, getCanvas }) {
  const [copied, setCopied] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);

  const handleWhatsApp = () => {
    trackEvent("whatsapp_clicked", { score });
    window.open(buildWhatsAppUrl(score), "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    trackEvent("share_clicked", { score });
    await shareNative(score);
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
    link.download = "how-indian-are-you.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleChallenge = async () => {
    const ok = await copyToClipboard(buildChallengeLink(score));
    if (ok) {
      setChallengeCopied(true);
      trackEvent("challenge_created", { score });
      window.setTimeout(() => setChallengeCopied(false), 2000);
    }
  };

  const iconBtnStyle = { borderRadius: 14, padding: "14px 10px", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 340, marginBottom: 12 }}>
        <button className="btn btn-primary" style={iconBtnStyle} onClick={handleWhatsApp}>
          <MessageCircle size={18} /> WhatsApp
        </button>
        <button className="btn btn-secondary" style={iconBtnStyle} onClick={handleNativeShare}>
          <Share2 size={18} /> Share
        </button>
        <button className="btn btn-secondary" style={iconBtnStyle} onClick={handleCopy}>
          {copied ? <Check size={18} color="var(--green)" /> : <Copy size={18} />} {copied ? "Copied" : "Copy Link"}
        </button>
        <button className="btn btn-secondary" style={iconBtnStyle} onClick={handleDownload}>
          <Download size={18} /> Save Card
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
