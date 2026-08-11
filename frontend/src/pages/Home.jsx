import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, Users } from "lucide-react";
import { ChakraMotif } from "../components/Timer";
import { trackEvent } from "../utils/sharing";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [challengeScore, setChallengeScore] = useState(null);

  useEffect(() => {
    const c = searchParams.get("challenge");
    if (c !== null && !Number.isNaN(Number(c))) {
      setChallengeScore(Math.max(0, Math.min(10, Number(c))));
    }
  }, [searchParams]);

  const handleStart = () => {
    trackEvent("quiz_started");
    navigate("/quiz");
  };

  return (
    <div className="fade-in" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="tricolor" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", position: "relative", textAlign: "center" }}>
        <ChakraMotif size={340} opacity={0.05} style={{ position: "absolute", top: "8%", right: "-14%" }} />
        <ChakraMotif size={260} opacity={0.05} style={{ position: "absolute", bottom: "4%", left: "-16%" }} />

        {challengeScore !== null && (
          <div
            className="fade-in"
            style={{ marginBottom: 22, background: "#EAF1FE", border: "1px solid var(--chakra)", borderRadius: 14, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, maxWidth: 360 }}
          >
            <Users size={18} color="var(--chakra)" />
            <span>Your friend scored {challengeScore}/10. Can you beat them?</span>
          </div>
        )}

        <div style={{ fontSize: 40, marginBottom: 10 }} aria-hidden="true">
          🇮🇳
        </div>

        <h1 className="display" style={{ fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
          HOW INDIAN
          <br />
          ARE YOU?
        </h1>

        <p className="display" style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 700, color: "var(--chakra)", margin: "0 0 6px" }}>
          The 60-Second India Challenge
        </p>

        <p style={{ color: "var(--ink-soft)", fontSize: 15, margin: "0 0 30px", fontWeight: 500 }}>10 Questions &bull; 60 Seconds &bull; One Badge</p>

        <button className="btn btn-primary" style={{ fontSize: 18, padding: "16px 40px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 8 }} onClick={handleStart}>
          START CHALLENGE <ChevronRight size={20} />
        </button>

        <p style={{ marginTop: 16, fontSize: 13, color: "var(--ink-soft)", fontWeight: 500 }}>No Login &bull; Free &bull; Just for Fun</p>

        <p style={{ marginTop: 40, fontSize: 12, color: "var(--ink-soft)", maxWidth: 320, opacity: 0.8 }}>
          A lighthearted trivia challenge for Independence Day — not a citizenship test of any kind.
        </p>
      </div>
    </div>
  );
}
