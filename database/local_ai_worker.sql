CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'leased', 'processing', 'completed', 'failed', 'paused')),
  provider_preference TEXT NOT NULL DEFAULT 'local' CHECK (provider_preference IN ('local', 'api', 'hybrid')),
  provider_used TEXT,
  model_name TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  lease_until TIMESTAMPTZ,
  assigned_worker TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ai_worker_control (
  worker_name TEXT PRIMARY KEY,
  desired_state TEXT NOT NULL DEFAULT 'paused' CHECK (desired_state IN ('paused', 'running')),
  auto_resume BOOLEAN NOT NULL DEFAULT false,
  last_command TEXT,
  last_seen_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_tasks_one_active_per_opportunity
  ON ai_tasks (opportunity_id)
  WHERE status IN ('pending', 'leased', 'processing');

CREATE INDEX IF NOT EXISTS ai_tasks_status_priority_idx
  ON ai_tasks (status, priority ASC, created_at ASC);

CREATE INDEX IF NOT EXISTS ai_tasks_lease_until_idx
  ON ai_tasks (lease_until);

CREATE TRIGGER ai_tasks_set_updated_at
BEFORE UPDATE ON ai_tasks
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER ai_worker_control_set_updated_at
BEFORE UPDATE ON ai_worker_control
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
