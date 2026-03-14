CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE user_role AS ENUM ('owner', 'member');
CREATE TYPE user_access_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
CREATE TYPE access_request_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE workflow_trigger_type AS ENUM ('scheduled', 'manual', 'webhook', 'replay', 'test');
CREATE TYPE workflow_run_status AS ENUM ('queued', 'running', 'succeeded', 'partially_failed', 'failed', 'cancelled');
CREATE TYPE source_platform AS ENUM ('reddit', 'job_board', 'community', 'directory', 'website', 'custom');
CREATE TYPE source_kind AS ENUM ('subreddit', 'rss_feed', 'job_board', 'forum', 'tag_page', 'custom');
CREATE TYPE source_state AS ENUM ('candidate', 'validated', 'evergreen', 'archived', 'disabled');
CREATE TYPE source_monitoring_mode AS ENUM ('ignored', 'monitored', 'scanned', 'always_scanned');
CREATE TYPE source_run_kind AS ENUM ('discovery_validation', 'monitoring_scan', 'backfill', 'manual');
CREATE TYPE opportunity_status AS ENUM ('new', 'interesting', 'qualified', 'watch', 'ignored', 'duplicate', 'acted_on');
CREATE TYPE opportunity_routing_action AS ENUM ('none', 'review', 'notion', 'telegram');
CREATE TYPE opportunity_intent AS ENUM ('unknown', 'job', 'opportunity', 'noise');
CREATE TYPE classification_type AS ENUM ('rules', 'ai', 'hybrid', 'manual');
CREATE TYPE alert_channel AS ENUM ('telegram', 'notion', 'email', 'slack', 'dashboard');
CREATE TYPE alert_status AS ENUM ('pending', 'sent', 'failed', 'skipped');
CREATE TYPE review_action AS ENUM ('mark_interesting', 'mark_qualified', 'mark_watch', 'mark_ignored', 'mark_duplicate', 'mark_acted_on', 'reopen', 'add_note');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL UNIQUE,
  display_name TEXT,
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'member',
  access_status user_access_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT NOT NULL,
  display_name TEXT,
  message TEXT,
  status access_request_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  linked_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_key TEXT NOT NULL,
  workflow_name TEXT,
  execution_reference TEXT,
  trigger_type workflow_trigger_type NOT NULL DEFAULT 'scheduled',
  status workflow_run_status NOT NULL DEFAULT 'queued',
  initiated_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  source_count INTEGER NOT NULL DEFAULT 0,
  item_count_in INTEGER NOT NULL DEFAULT 0,
  item_count_out INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform source_platform NOT NULL,
  kind source_kind NOT NULL,
  normalized_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT,
  external_id TEXT,
  canonical_url TEXT,
  feed_url TEXT,
  description TEXT,
  state source_state NOT NULL DEFAULT 'candidate',
  monitoring_mode source_monitoring_mode NOT NULL DEFAULT 'monitored',
  is_active BOOLEAN NOT NULL DEFAULT true,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  scan_interval_minutes INTEGER,
  discovered_via_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  discovered_by_query TEXT,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_scanned_at TIMESTAMPTZ,
  last_successful_run_at TIMESTAMPTZ,
  source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  search_document tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      coalesce(name, '') || ' ' ||
      coalesce(slug, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(canonical_url, '')
    )
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE source_discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  discovery_query TEXT NOT NULL,
  discovery_title TEXT,
  discovery_excerpt TEXT,
  discovery_url TEXT,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE source_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  run_kind source_run_kind NOT NULL DEFAULT 'monitoring_scan',
  status workflow_run_status NOT NULL DEFAULT 'queued',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  items_in INTEGER NOT NULL DEFAULT 0,
  items_out INTEGER NOT NULL DEFAULT 0,
  matched_opportunities_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT,
  run_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  first_seen_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  last_seen_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  duplicate_of_opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  platform source_platform NOT NULL,
  source_record_key TEXT NOT NULL UNIQUE,
  content_fingerprint TEXT,
  source_native_id TEXT,
  canonical_url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT,
  published_at TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  score INTEGER NOT NULL DEFAULT 0,
  confidence INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 100),
  status opportunity_status NOT NULL DEFAULT 'new',
  routing_action opportunity_routing_action NOT NULL DEFAULT 'review',
  intent opportunity_intent NOT NULL DEFAULT 'unknown',
  is_job BOOLEAN,
  ai_reason TEXT,
  location_text TEXT,
  category TEXT,
  extracted_entities JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  search_document tsvector GENERATED ALWAYS AS (
    to_tsvector(
      'simple',
      coalesce(title, '') || ' ' ||
      coalesce(content, '') || ' ' ||
      coalesce(author_name, '') || ' ' ||
      coalesce(location_text, '') || ' ' ||
      coalesce(category, '')
    )
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  classification_type classification_type NOT NULL,
  provider TEXT,
  model_name TEXT,
  verdict TEXT,
  is_positive BOOLEAN,
  score INTEGER,
  confidence INTEGER CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 100),
  reason TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action review_action NOT NULL,
  from_status opportunity_status,
  to_status opportunity_status,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
  channel alert_channel NOT NULL,
  status alert_status NOT NULL DEFAULT 'pending',
  destination TEXT,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name CITEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE source_tags (
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (source_id, tag_id)
);

CREATE TABLE opportunity_tags (
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, tag_id)
);

CREATE UNIQUE INDEX access_requests_pending_email_unique
  ON access_requests (email)
  WHERE status = 'pending';

CREATE INDEX users_access_status_idx ON users (access_status);
CREATE INDEX users_role_idx ON users (role);

CREATE INDEX access_requests_status_requested_at_idx
  ON access_requests (status, requested_at DESC);

CREATE INDEX workflow_runs_workflow_key_started_at_idx
  ON workflow_runs (workflow_key, started_at DESC);

CREATE INDEX workflow_runs_status_started_at_idx
  ON workflow_runs (status, started_at DESC);

CREATE INDEX sources_platform_state_idx
  ON sources (platform, state);

CREATE INDEX sources_monitoring_mode_confidence_idx
  ON sources (monitoring_mode, confidence DESC);

CREATE INDEX sources_last_seen_at_idx
  ON sources (last_seen_at DESC);

CREATE INDEX sources_search_document_idx
  ON sources
  USING GIN (search_document);

CREATE INDEX source_discoveries_source_id_discovered_at_idx
  ON source_discoveries (source_id, discovered_at DESC);

CREATE INDEX source_discoveries_query_discovered_at_idx
  ON source_discoveries (discovery_query, discovered_at DESC);

CREATE INDEX source_runs_source_id_started_at_idx
  ON source_runs (source_id, started_at DESC);

CREATE INDEX source_runs_workflow_run_id_idx
  ON source_runs (workflow_run_id);

CREATE INDEX opportunities_source_id_last_seen_at_idx
  ON opportunities (source_id, last_seen_at DESC);

CREATE INDEX opportunities_status_confidence_score_idx
  ON opportunities (status, confidence DESC, score DESC);

CREATE INDEX opportunities_routing_action_created_at_idx
  ON opportunities (routing_action, created_at DESC);

CREATE INDEX opportunities_content_fingerprint_idx
  ON opportunities (content_fingerprint);

CREATE INDEX opportunities_published_at_idx
  ON opportunities (published_at DESC);

CREATE INDEX opportunities_search_document_idx
  ON opportunities
  USING GIN (search_document);

CREATE INDEX classifications_opportunity_id_created_at_idx
  ON classifications (opportunity_id, created_at DESC);

CREATE INDEX classifications_workflow_run_id_idx
  ON classifications (workflow_run_id);

CREATE INDEX reviews_opportunity_id_created_at_idx
  ON reviews (opportunity_id, created_at DESC);

CREATE INDEX reviews_reviewer_user_id_created_at_idx
  ON reviews (reviewer_user_id, created_at DESC);

CREATE INDEX alerts_opportunity_id_created_at_idx
  ON alerts (opportunity_id, created_at DESC);

CREATE INDEX alerts_status_created_at_idx
  ON alerts (status, created_at DESC);

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER access_requests_set_updated_at
BEFORE UPDATE ON access_requests
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER workflow_runs_set_updated_at
BEFORE UPDATE ON workflow_runs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER sources_set_updated_at
BEFORE UPDATE ON sources
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER source_runs_set_updated_at
BEFORE UPDATE ON source_runs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER opportunities_set_updated_at
BEFORE UPDATE ON opportunities
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER tags_set_updated_at
BEFORE UPDATE ON tags
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
