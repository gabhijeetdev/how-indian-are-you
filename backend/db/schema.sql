-- Optional MySQL schema. Only needed if you set MYSQL_HOST in the backend
-- env; otherwise the API runs on an in-memory store with zero setup.

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
);
