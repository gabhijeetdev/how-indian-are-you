import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import ResultCard from "../components/ResultCard";
import ShareButtons from "../components/ShareButtons";
import { getBadge, getPercentile } from "../utils/scoring";

function Confetti() {
  const colors = ["#FF9933", "#0E7C3A", "#0B3D91", "#FFFFFF"];
  const pieces = Array.from({ length: 36 });
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 40 }} aria-hidden="true">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const dur = 2.4 + Math.random() * 1.8;
        const delay = Math.random() * 0.6;
        const color = colors[i % colors.length];
        const w = 6 + Math.random() * 5;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{ left: `${left}%`, width: w, height: w * 1.6, background: color, borderRadius: 2, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score;
  const canvasRef = useRef(null);

  // Guard against someone landing here directly (refresh, bad link, etc.)
  if (score === undefined || score === null) {
    return (
      <div className="fade-in" style={{ padding: "60px 24px", textAlign: "center" }}>
        <p className="display" style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>No result to show</p>
        <p style={{ color: "var(--ink-soft)", marginBottom: 20 }}>Looks like you landed here without finishing a challenge.</p>
        <button className="btn btn-primary" style={{ borderRadius: 999, padding: "12px 28px" }} onClick={() => navigate("/")}>
          Start the Challenge
        </button>
      </div>
    );
  }

  const badge = getBadge(score);
  const percentile = getPercentile(score);
  const showConfetti = score >= 7;

  return (
    <div className="fade-in" style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 18px 50px" }}>
      {showConfetti && <Confetti />}
      <div className="tricolor-thin" style={{ width: 60, marginBottom: 18 }} />

      <div className="pop-in" style={{ textAlign: "center", marginBottom: 18 }}>
        <p className="display" style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--ink-soft)" }}>
          YOUR SCORE
        </p>
        <p className="display" style={{ margin: "4px 0 6px", fontSize: 64, fontWeight: 800, color: "var(--chakra)" }}>
          {score} / 10
        </p>
        <div className="display" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--chakra)", color: "#fff", padding: "8px 20px", borderRadius: 999, fontWeight: 700, fontSize: 16 }}>
          <span aria-hidden="true">{badge.emoji}</span> {badge.name}
        </div>
        <p style={{ marginTop: 12, fontSize: 15, color: "var(--ink-soft)", fontWeight: 500, maxWidth: 320 }}>{badge.message}</p>
        <p style={{ marginTop: 6, fontSize: 13, color: "var(--ink-soft)" }}>You scored higher than {percentile}% of players</p>
      </div>

      <ResultCard score={score} badge={badge} percentile={percentile} onReady={(canvas) => (canvasRef.current = canvas)} />

      <ShareButtons score={score} getCanvas={() => canvasRef.current} />

      <button className="btn btn-secondary" style={{ borderRadius: 999, padding: "10px 24px", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }} onClick={() => navigate("/")}>
        <RotateCcw size={15} /> Play Again
      </button>
    </div>
  );
}
