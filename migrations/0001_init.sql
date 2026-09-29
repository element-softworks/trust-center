CREATE TABLE IF NOT EXISTS trust_configs (
  id TEXT PRIMARY KEY,
  yaml TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS document_requests (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  document TEXT NOT NULL,
  company TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_document_requests_created_at
  ON document_requests (created_at DESC);
