import React, { useEffect, useRef } from "react";

export default function ResultCard({ score, badge, onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 600;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 1. Dynamic Background Gradient
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 380);
    bgGrad.addColorStop(0, "#FFFDF9");
    bgGrad.addColorStop(0.7, "#F7F0E3");
    bgGrad.addColorStop(1, "#EFE2CD");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Decorative Certificate Frame
    ctx.strokeStyle = "rgba(184, 134, 11, 0.3)";
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Tricolor Top & Bottom Accent Stripes
    ctx.fillStyle = "#FF9933";
    ctx.fillRect(16, 16, width - 32, 8);
    ctx.fillStyle = "#138808";
    ctx.fillRect(16, height - 24, width - 32, 8);

    const renderCanvas = (stambhImg = null) => {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 3. Header Text (Top Section)
      ctx.fillStyle = "#0B3D91";
      ctx.font = "900 26px system-ui, -apple-system, sans-serif";
      ctx.fillText("HOW WELL DO YOU KNOW INDIA?", width / 2, 52);

      ctx.fillStyle = "#775533";
      ctx.font = "600 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("THE 60-SECOND CHALLENGE", width / 2, 78);

      if (stambhImg) {
        ctx.save();
        ctx.globalAlpha = 0.95; 
        const imgW = 85;
        const imgH = 120;
        ctx.drawImage(stambhImg, (width - imgW) / 2, 98, imgW, imgH);
        ctx.restore();
      }

      // 5. Score Section 
      ctx.fillStyle = "#FF9933";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("YOUR SCORE", width / 2, 238);

      ctx.font = "900 68px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = score >= 7 ? "#138808" : score >= 4 ? "#0B3D91" : "#D9534F";
      ctx.fillText(`${score} / 10`, width / 2, 290);

      // 6. Central Badge Box (Reduced width, height, and font)
      const badgeW = 280; // Reduced from 360
      const badgeH = score >= 5 ? 54 : 48; // Reduced from 80 / 64
      const badgeX = (width - badgeW) / 2;
      const badgeY = 350;

      // Badge Drop Shadow
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.22)";
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;

      // Badge Border Gradient
      const borderGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
      if (score >= 7) {
        borderGrad.addColorStop(0, "#FFE082");
        borderGrad.addColorStop(0.5, "#FFB300");
        borderGrad.addColorStop(1, "#FF6F00");
      } else {
        borderGrad.addColorStop(0, "#42A5F5");
        borderGrad.addColorStop(1, "#0D47A1");
      }
      ctx.fillStyle = borderGrad;
      ctx.beginPath();
      ctx.roundRect(badgeX - 2.5, badgeY - 2.5, badgeW + 5, badgeH + 5, 16);
      ctx.fill();
      ctx.restore();

      // Badge Fill Gradient
      const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + badgeH);
      badgeGrad.addColorStop(0, "#0B3D91");
      badgeGrad.addColorStop(1, "#051D48");
      ctx.fillStyle = badgeGrad;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
      ctx.fill();

      // Badge Text
      ctx.fillStyle = score >= 7 ? "#FFD700" : "#FFFFFF";
      ctx.font = "800 16px system-ui, -apple-system, sans-serif"; // Slightly smaller text fit
      ctx.fillText(`${badge.emoji}  ${badge.name}`.toUpperCase(), width / 2, badgeY + badgeH / 2);

      // 7. Message Section (Dedicated Bottom Area)
      ctx.fillStyle = "#222222";
      ctx.font = "600 15px system-ui, -apple-system, sans-serif";
      const words = (badge.message || "").split(" ");
      let line = "";
      let lines = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        if (ctx.measureText(testLine).width > 460 && i > 0) {
          lines.push(line.trim());
          line = words[i] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      const startY = 450;
      const lineHeight = 22;
      lines.forEach((l, index) => {
        ctx.fillText(l, width / 2, startY + index * lineHeight);
      });

      // 8. Footer Bar
      ctx.fillStyle = "#0B3D91";
      ctx.fillRect(16, height - 56, width - 32, 32);

      ctx.fillStyle = "#FF9933";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("SHARE & CHALLENGE YOUR FRIENDS! 🇮🇳", width / 2, height - 40);

      onReady?.(canvas);
    };

    // Load Ashok Stambh Emblem
    const stambhImg = new Image();
    stambhImg.crossOrigin = "anonymous";
    stambhImg.src = "https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg";

    stambhImg.onload = () => renderCanvas(stambhImg);
    stambhImg.onerror = () => renderCanvas(null);
  }, [score, badge, onReady]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        margin: "0 auto 20px",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.18)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
}