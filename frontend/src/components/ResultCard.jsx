import React, { useEffect, useRef, useState } from "react";

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  // Fallback for engines without native roundRect.
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawResultCard(canvas, { score, badge, percentile }) {
  const ctx = canvas.getContext("2d");
  const S = 1080;
  canvas.width = S;
  canvas.height = S;

  // Background wash
  const grad = ctx.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, "#FFFCF5");
  grad.addColorStop(0.55, "#FFF6E4");
  grad.addColorStop(1, "#FBF2DF");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  // Diagonal tricolor corner washes (top-left saffron, bottom-right green)
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = "#FF9933";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(360, 0);
  ctx.lineTo(0, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#0E7C3A";
  ctx.beginPath();
  ctx.moveTo(S, S);
  ctx.lineTo(S - 360, S);
  ctx.lineTo(S, S - 300);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Thin tricolor rules, top & bottom
  const barH = 14;
  ["#FF9933", "#FFFFFF", "#0E7C3A"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, i * barH, S, barH);
  });
  ["#0E7C3A", "#FFFFFF", "#FF9933"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, S - (i + 1) * barH, S, barH);
  });

  // Ashoka Chakra watermark motif, centered behind the content
  ctx.save();
  ctx.translate(S / 2, S / 2 - 40);
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#0B3D91";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 320, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 320, Math.sin(a) * 320);
    ctx.stroke();
  }
  ctx.restore();

  ctx.textAlign = "center";

  // Header
  ctx.font = "72px sans-serif";
  ctx.fillStyle = "#17213B";
  ctx.fillText("🇮🇳", S / 2, 150);

  ctx.font = "800 46px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#17213B";
  ctx.fillText("HOW INDIAN", S / 2 - 5, 216);
  ctx.fillStyle = "#FF9933";
  const howW = ctx.measureText("HOW INDIAN ").width;
  ctx.textAlign = "left";
  ctx.fillText("ARE YOU?", S / 2 - howW / 2 + howW, 216);
  ctx.textAlign = "center";

  ctx.font = "600 26px 'Inter', sans-serif";
  ctx.fillStyle = "#5B5A54";
  ctx.fillText("The 60-Second India Challenge", S / 2, 258);

  // "YOUR SCORE" pill
  ctx.font = "700 24px 'Baloo 2', sans-serif";
  const pillLabel = "YOUR SCORE";
  const lblW = ctx.measureText(pillLabel).width + 60;
  roundRectPath(ctx, S / 2 - lblW / 2, 296, lblW, 52, 26);
  ctx.fillStyle = "#17213B";
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(pillLabel, S / 2, 331);

  // Big score
  ctx.font = "800 190px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#FF9933";
  const scoreStr = `${score}`;
  const slashW = ctx.measureText(" / ").width;
  const totalW = ctx.measureText(`${score} / 10`).width;
  let cursor = S / 2 - totalW / 2;
  ctx.textAlign = "left";
  ctx.fillText(scoreStr, cursor, 570);
  cursor += ctx.measureText(scoreStr).width;
  ctx.fillStyle = "#17213B";
  ctx.fillText(" / ", cursor, 570);
  cursor += slashW;
  ctx.fillStyle = "#0E7C3A";
  ctx.fillText("10", cursor, 570);
  ctx.textAlign = "center";

  // Ribbon-style badge box
  ctx.font = "800 46px 'Baloo 2', sans-serif";
  const badgeLabel = badge.name.toUpperCase();
  const badgeW = Math.max(ctx.measureText(badgeLabel).width + 160, 420);
  const badgeH = 150;
  const badgeX = S / 2 - badgeW / 2;
  const badgeY = 610;

  roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 20);
  ctx.fillStyle = "#0B2A5B";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#D9A441";
  ctx.stroke();

  ctx.font = "36px sans-serif";
  ctx.fillStyle = "#D9A441";
  ctx.fillText(badge.emoji, S / 2, badgeY + 46);

  ctx.font = "800 44px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(badgeLabel, S / 2, badgeY + 96);

  // Green sub-ribbon inside the badge box for the short tagline
  const tagline = score >= 9 ? "Almost perfect. Impressive!" : score >= 7 ? "Great knowledge!" : score >= 5 ? "Good effort!" : score >= 3 ? "Keep exploring!" : "Give it another go!";
  ctx.font = "600 26px 'Inter', sans-serif";
  const tagW = ctx.measureText(tagline).width + 50;
  roundRectPath(ctx, S / 2 - tagW / 2, badgeY + 110, tagW, 40, 20);
  ctx.fillStyle = "#0E7C3A";
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(tagline, S / 2, badgeY + 137);

  // Percentile line
  ctx.font = "500 30px 'Inter', sans-serif";
  ctx.fillStyle = "#5B5A54";
  ctx.fillText(`You scored higher than ${percentile}% of players`, S / 2, badgeY + 220);

  // Score-based message, wrapped
  ctx.font = "600 28px 'Inter', sans-serif";
  ctx.fillStyle = "#17213B";
  const lines = wrapText(ctx, badge.message, 780);
  let msgY = badgeY + 270;
  lines.slice(0, 3).forEach((line) => {
    ctx.fillText(line, S / 2, msgY);
    msgY += 38;
  });

  // Independence Day tag
  ctx.font = "italic 700 40px 'Baloo 2', 'Inter', sans-serif";
  ctx.fillStyle = "#0B3D91";
  ctx.fillText("Happy Independence Day!", S / 2, msgY + 46);

  // Footer CTA bar
  const footH = 96;
  ctx.fillStyle = "#0B2A5B";
  ctx.fillRect(0, S - barH * 3 - footH, S, footH);
  ctx.font = "700 30px 'Inter', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillStyle = "#FF9933";
  ctx.fillText("SHARE & CHALLENGE YOUR FRIEND!", S / 2 + 150, S - barH * 3 - footH / 2 - 4);
}

/**
 * Renders the canvas off-screen, shows a PNG preview, and exposes the
 * canvas ref (via onReady) so the parent can trigger a share or download.
 * onReady only fires once the canvas has actually finished drawing, so
 * Share/Save never fire against a blank canvas.
 */
export default function ResultCard({ score, badge, percentile, onReady }) {
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawResultCard(canvasRef.current, { score, badge, percentile });
    try {
      setPreviewUrl(canvasRef.current.toDataURL("image/png"));
    } catch {
      setPreviewUrl(null);
    }
    onReady?.(canvasRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, badge, percentile]);

  return (
    <>
      {previewUrl && (
        <div className="card" style={{ width: "100%", maxWidth: 300, aspectRatio: "1/1", overflow: "hidden", marginBottom: 20, boxShadow: "0 10px 30px rgba(11,61,145,0.12)" }}>
          <img src={previewUrl} alt="Your shareable result card preview" style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden="true" />
    </>
  );
}