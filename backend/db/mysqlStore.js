import mysql from "mysql2/promise";

export async function createMySQLStore() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // Ensure the table exists (idempotent) — see schema.sql for the same DDL.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      event VARCHAR(40) NOT NULL,
      score TINYINT NULL,
      question_id INT NULL,
      correct BOOLEAN NULL,
      method VARCHAR(40) NULL,
      created_at DATETIME NOT NULL,
      INDEX idx_event (event),
      INDEX idx_created_at (created_at)
    )
  `);

  return {
    async insertEvent({ event, score, questionId, correct, method, createdAt }) {
      await pool.execute(
        `INSERT INTO analytics_events (event, score, question_id, correct, method, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [event, score, questionId, correct, method, createdAt]
      );
    },
    async getStats() {
      const [[totals]] = await pool.query(
        `SELECT COUNT(*) AS totalPlays, AVG(score) AS averageScore
         FROM analytics_events WHERE event = 'quiz_completed'`
      );
      const [[shares]] = await pool.query(
        `SELECT COUNT(*) AS totalShares FROM analytics_events
         WHERE event IN ('share_clicked', 'whatsapp_clicked')`
      );
      return {
        totalPlays: totals.totalPlays || 0,
        averageScore: totals.averageScore ? Math.round(totals.averageScore * 100) / 100 : 0,
        totalShares: shares.totalShares || 0,
      };
    },
  };
}
