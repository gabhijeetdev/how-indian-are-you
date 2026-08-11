import React, { useEffect, useRef, useState } from "react";

export function drawResultCard(canvas, { score, badge, percentile }) {
  const ctx = canvas.getContext("2d");
  const S = 1080;
  canvas.width = S;
  canvas.height = S;

  const grad = ctx.createLinearGradient(0, 0, S, S);
  grad.addColorStop(0, "#FFFCF5");
  grad.addColorStop(1, "#FBF2DF");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  const barH = 26;
  ctx.fillStyle = "#FF9933";
  ctx.fillRect(0, 0, S, barH);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, barH, S, barH);
  ctx.fillStyle = "#0E7C3A";
  ctx.fillRect(0, barH * 2, S, barH);

  ctx.fillStyle = "#FF9933";
  ctx.fillRect(0, S - barH, S, barH);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, S - barH * 2, S, barH);
  ctx.fillStyle = "#0E7C3A";
  ctx.fillRect(0, S - barH * 3, S, barH);

  ctx.save();
  ctx.translate(S / 2, S / 2);
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#0B3D91";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 300, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 300, Math.sin(a) * 300);
    ctx.stroke();
  }
  ctx.restore();

  ctx.textAlign = "center";

  ctx.font = "72px sans-serif";
  ctx.fillStyle = "#17213B";
  ctx.fillText("🇮🇳", S / 2, 220);

  ctx.font = "800 54px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#17213B";
  ctx.fillText("HOW INDIAN ARE YOU?", S / 2, 300);

  ctx.font = "800 190px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#0B3D91";
  ctx.fillText(`${score}/10`, S / 2, 520);

  const badgeText = badge.name;
  ctx.font = "700 40px 'Baloo 2', sans-serif";
  const pillW = ctx.measureText(badgeText).width + 90;
  const pillH = 78;
  const pillX = S / 2 - pillW / 2;
  const pillY = 570;
  ctx.fillStyle = "#0B3D91";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`${badge.emoji} ${badgeText}`, S / 2, pillY + 52);

  ctx.font = "500 32px 'Inter', sans-serif";
  ctx.fillStyle = "#5B5A54";
  ctx.fillText(`You scored higher than ${percentile}% of players`, S / 2, 720);

  ctx.font = "600 30px 'Inter', sans-serif";
  ctx.fillStyle = "#17213B";
  ctx.fillText("Independence Day 2026", S / 2, 800);

  ctx.font = "800 44px 'Baloo 2', sans-serif";
  ctx.fillStyle = "#FF9933";
  ctx.fillText("CAN YOU BEAT ME?", S / 2, 900);
}

/**
 * Renders the canvas off-screen, shows a PNG preview, and exposes the
 * canvas ref (via onReady) so the parent can trigger a download.
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
  }, [score]);

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
