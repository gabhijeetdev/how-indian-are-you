import React from "react";
import { Check, X } from "lucide-react";

/** Small illustration for the image-based question — an original flat illustration, not a photo. */
function MonumentIllustration() {
  return (
    <svg viewBox="0 0 320 180" width="100%" height="140" role="img" aria-label="Illustration of a domed marble monument at sunset">
      <rect x="0" y="0" width="320" height="180" fill="#FDEBD8" />
      <circle cx="256" cy="46" r="26" fill="#FFC97A" opacity="0.9" />
      <rect x="0" y="140" width="320" height="40" fill="#E7CDA6" />
      <rect x="40" y="70" width="14" height="70" fill="#F3E7D8" />
      <rect x="266" y="70" width="14" height="70" fill="#F3E7D8" />
      <rect x="120" y="90" width="80" height="50" fill="#FBF3E7" stroke="#DDBF97" strokeWidth="2" />
      <path d="M120 90 Q160 40 200 90 Z" fill="#FBF3E7" stroke="#DDBF97" strokeWidth="2" />
      <circle cx="160" cy="62" r="6" fill="#DDBF97" />
      <path d="M130 140 v-24 a30 22 0 0 1 60 0 v24 Z" fill="#F6E9D6" stroke="#DDBF97" strokeWidth="2" />
    </svg>
  );
}

export default function QuestionCard({ question, selected, locked, onSelect }) {
  return (
    <div style={{ maxWidth: 520, width: "100%", margin: "0 auto" }}>
      <span
        className="display"
        style={{
          display: "inline-block",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "var(--chakra)",
          background: "#EAF1FE",
          padding: "4px 12px",
          borderRadius: 999,
          marginBottom: 14,
        }}
      >
        {question.category.toUpperCase()}
      </span>

      {question.type === "image" && (
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, border: "1px solid var(--line)" }}>
          <MonumentIllustration />
        </div>
      )}

      <h2 className="display" style={{ fontSize: "clamp(20px, 5.4vw, 26px)", fontWeight: 700, lineHeight: 1.25, margin: "0 0 22px" }}>
        {question.prompt}
      </h2>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: question.type === "tf" ? "1fr 1fr" : "1fr" }}>
        {question.options.map((opt, i) => {
          let cls = "answer";
          if (locked) {
            if (i === question.answer) cls += " correct";
            else if (i === selected) cls += " wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => onSelect(i)} disabled={locked} aria-pressed={selected === i}>
              <span>{opt}</span>
              {locked && i === question.answer && <Check size={20} color="var(--green)" />}
              {locked && i === selected && i !== question.answer && <X size={20} color="var(--wrong)" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
