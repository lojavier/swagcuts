CREATE TABLE IF NOT EXISTS analytics_events (
  id text PRIMARY KEY,
  event_name text NOT NULL,
  session_id text,
  page_url text,
  referrer text,
  utm jsonb,
  properties jsonb,
  context jsonb,
  created_at timestamptz,
  received_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_event_name_idx ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS analytics_events_received_at_idx ON analytics_events (received_at DESC);
