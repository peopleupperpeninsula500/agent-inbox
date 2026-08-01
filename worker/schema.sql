-- Things you've sent for Claude to look at.
CREATE TABLE IF NOT EXISTS items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  url          TEXT,
  note         TEXT,
  source       TEXT,
  created_at   TEXT    NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'pending',  -- pending | done
  processed_at TEXT,
  verdict      TEXT
);

CREATE INDEX IF NOT EXISTS idx_items_status ON items (status, id DESC);

-- Credentials, when they weren't supplied as Worker secrets. A one-click deploy
-- has no way to set secrets up front, so the inbox generates its own on first
-- visit and stores them here. Secrets in the environment always win.
CREATE TABLE IF NOT EXISTS config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Failed passcode attempts, so the login box can't be brute-forced.
CREATE TABLE IF NOT EXISTS throttle (
  ip           TEXT    PRIMARY KEY,
  fails        INTEGER NOT NULL DEFAULT 0,
  window_start INTEGER NOT NULL
);
