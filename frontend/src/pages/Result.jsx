import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import ResultCard from "../components/ResultCard";
import ShareButtons from "../components/ShareButtons";
import { getBadge, getPercentile } from "../utils/scoring";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 8;
  const canvasRef = useRef(null);

  const badge = getBadge(score);
  const percentile = getPercentile(score);

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px 40px",
        boxSizing: "border-box",
      }}
    >
      <ResultCard score={score} badge={badge} percentile={percentile} onReady={(canvas) => (canvasRef.current = canvas)} />

      <ShareButtons score={score} getCanvas={() => canvasRef.current} />

      <button
        className="btn btn-secondary"
        style={{
          marginTop: 16,
          borderRadius: 999,
          padding: "10px 24px",
          fontSize: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--line)",
          background: "#fff",
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <RotateCcw size={15} /> Play Again
      </button>
    </div>
  );
}