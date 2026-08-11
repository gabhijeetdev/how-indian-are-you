import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import ProgressBar from "../components/ProgressBar";
import QuestionCard from "../components/QuestionCard";
import { QUESTIONS, TOTAL_TIME_SECONDS } from "../data/questions";
import { trackEvent } from "../utils/sharing";

export default function Quiz() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME_SECONDS);

  const scoreRef = useRef(0);
  const indexRef = useRef(0);
  const finishedRef = useRef(false);

  const question = QUESTIONS[index];

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    trackEvent("quiz_completed", { score: scoreRef.current });
    navigate("/result", { state: { score: scoreRef.current } });
  }, [navigate]);

  // Global 60-second countdown for the whole quiz.
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          finish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finish]);

  const advance = useCallback(() => {
    const next = indexRef.current + 1;
    if (next >= QUESTIONS.length) {
      finish();
      return;
    }
    indexRef.current = next;
    setIndex(next);
    setSelected(null);
    setLocked(false);
  }, [finish]);

  const handleSelect = (optIdx) => {
    if (locked) return;
    setSelected(optIdx);
    setLocked(true);
    const correct = optIdx === question.answer;
    if (correct) scoreRef.current += 1;
    trackEvent("question_answered", { questionId: question.id, correct });
    window.setTimeout(advance, 850);
  };

  if (!question) {
    // Defensive empty state — should not happen with a fixed 10-question set.
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Something went wrong loading this question. Please restart the challenge.</p>
        <button className="btn btn-primary" style={{ borderRadius: 999, padding: "10px 24px", marginTop: 12 }} onClick={() => navigate("/")}>
          Back to Start
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "20px 18px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <p className="display" style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14, color: "var(--ink-soft)" }}>
            Question {index + 1} of {QUESTIONS.length}
          </p>
          <ProgressBar current={index} total={QUESTIONS.length} />
        </div>
        <Timer secondsLeft={secondsLeft} totalSeconds={TOTAL_TIME_SECONDS} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <QuestionCard question={question} selected={selected} locked={locked} onSelect={handleSelect} />
      </div>
    </div>
  );
}
