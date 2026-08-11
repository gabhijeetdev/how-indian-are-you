import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";

// Events we accept. Anything else is rejected — this endpoint stores
// anonymous product events only, never personal data.
const VALID_EVENTS = new Set([
  "quiz_started",
  "question_answered",
  "quiz_completed",
  "share_clicked",
  "whatsapp_clicked",
  "challenge_created",
]);

const app = express();
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "10kb" }));

/**
 * Storage layer. Defaults to an in-memory array so the MVP runs with zero
 * setup. Set MYSQL_HOST (and friends) to switch to MySQL — see
 * db/schema.sql for the table definition and db/mysqlStore.js for the swap.
 */
const useMySQL = Boolean(process.env.MYSQL_HOST);
let store;

if (useMySQL) {
  const { createMySQLStore } = await import("./db/mysqlStore.js");
  store = await createMySQLStore();
} else {
  const memory = [];
  store = {
    async insertEvent(row) {
      memory.push(row);
    },
    async getStats() {
      const completions = memory.filter((e) => e.event === "quiz_completed");
      const totalPlays = completions.length;
      const avgScore = totalPlays ? completions.reduce((sum, e) => sum + (e.score ?? 0), 0) / totalPlays : 0;
      const totalShares = memory.filter((e) => ["share_clicked", "whatsapp_clicked"].includes(e.event)).length;
      return { totalPlays, averageScore: Math.round(avgScore * 100) / 100, totalShares };
    },
  };
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/analytics", async (req, res) => {
  const { event, score, questionId, correct, method, timestamp } = req.body || {};

  if (!VALID_EVENTS.has(event)) {
    return res.status(400).json({ error: "Unknown event type." });
  }

  try {
    await store.insertEvent({
      event,
      score: typeof score === "number" ? Math.max(0, Math.min(10, score)) : null,
      questionId: typeof questionId === "number" ? questionId : null,
      correct: typeof correct === "boolean" ? correct : null,
      method: typeof method === "string" ? method.slice(0, 40) : null,
      createdAt: Number.isFinite(timestamp) ? new Date(timestamp) : new Date(),
    });
    res.status(204).end();
  } catch (err) {
    console.error("Failed to record analytics event:", err);
    res.status(500).json({ error: "Could not record event." });
  }
});

app.get("/api/stats", async (_req, res) => {
  try {
    const stats = await store.getStats();
    res.json(stats);
  } catch (err) {
    console.error("Failed to load stats:", err);
    res.status(500).json({ error: "Could not load stats." });
  }
});

app.listen(PORT, () => {
  console.log(`How Indian Are You? API listening on port ${PORT} (store: ${useMySQL ? "MySQL" : "in-memory"})`);
});
