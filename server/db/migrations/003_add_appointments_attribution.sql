ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS attribution jsonb;
