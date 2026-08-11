import React from "react";

/** Decorative full chakra, used as a background motif (not interactive). */
export function ChakraMotif({ size = 220, opacity = 0.06, style = {} }) {
  const spokes = Array.from({ length: 24 });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity, ...style }} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--chakra)" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" fill="var(--chakra)" />
      {spokes.map((_, i) => (
        <line key={i} x1="50" y1="50" x2="50" y2="6" stroke="var(--chakra)" strokeWidth="1.6" transform={`rotate(${(i * 360) / 24} 50 50)`} />
      ))}
    </svg>
  );
}

/** The countdown ring shown during the quiz — spokes deplete as time runs out. */
export default function Timer({ secondsLeft, totalSeconds }) {
  const size = 92;
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, secondsLeft / totalSeconds);
  const offset = circumference * (1 - pct);
  const urgent = secondsLeft <= 10;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="50" y1="50" x2="50" y2="14" stroke="var(--line)" strokeWidth="1.4" transform={`rotate(${(i * 360) / 24} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={urgent ? "var(--wrong)" : "var(--chakra)"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke .3s ease" }}
        />
        <circle cx="50" cy="50" r="5" fill={urgent ? "var(--wrong)" : "var(--chakra)"} />
      </svg>
      <div
        className="display"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          color: urgent ? "var(--wrong)" : "var(--ink)",
        }}
        aria-live="polite"
        aria-label={`${secondsLeft} seconds remaining`}
      >
        {secondsLeft}
      </div>
    </div>
  );
}
