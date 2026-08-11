import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
