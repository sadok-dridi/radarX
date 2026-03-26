import "server-only";

import { Pool } from "pg";
import type { QueryResultRow } from "pg";

export type DashboardOpportunity = {
  id: string;
  title: string;
  source: string;
  platform: string;
  score: number;
  confidence: number;
  status: string;
  action: string;
  publishedAt: string | null;
  location: string | null;
  summary: string;
  reason: string | null;
  canonicalUrl: string;
};

export type DashboardOverview = {
  stats: Array<{ label: string; value: string; detail: string }>;
  opportunities: DashboardOpportunity[];
  runs: Array<{
    id: string;
    name: string;
    status: string;
    trigger: string;
    startedAt: string | null;
    duration: string | null;
    itemsOut: number;
  }>;
  recentFailuresCount: number;
};

export type SourceCard = {
  id: string;
  name: string;
  state: string;
  monitoringMode: string;
  confidence: number;
  lastSeen: string | null;
  lastRun: string;
};

type OpportunityRow = {
  id: string;
  title: string;
  source_name: string | null;
  platform: string;
  score: number | null;
  confidence: number | null;
  status: string | null;
  routing_action: string | null;
  published_at: string | null;
  location_text: string | null;
  content: string | null;
  ai_reason: string | null;
  canonical_url: string;
};

type OverviewStatsRow = {
  total_opportunities: string;
  high_confidence_leads: string;
  pending_ai_tasks: string;
  active_sources: string;
  recent_failures: string;
};

type RunRow = {
  id: string;
  workflow_name: string | null;
  workflow_key: string;
  status: string;
  trigger_type: string | null;
  started_at: string | null;
  finished_at: string | null;
  item_count_out: number | null;
};

type SourceRow = {
  id: string;
  name: string;
  state: string;
  monitoring_mode: string;
  confidence: number | null;
  last_seen_at: string | null;
  last_successful_run_at: string | null;
};

type DetailRow = OpportunityRow & {
  author_name: string | null;
  intent: string | null;
  is_job: boolean | null;
  created_at: string;
  updated_at: string;
};

type ClassificationRow = {
  id: string;
  provider: string | null;
  model_name: string | null;
  verdict: string | null;
  confidence: number | null;
  reason: string | null;
  created_at: string;
};

let pool: Pool | null = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  return pool;
}

async function withPool<T>(callback: (db: Pool) => Promise<T>): Promise<T | null> {
  const db = getPool();
  if (!db) {
    return null;
  }

  try {
    return await callback(db);
  } catch {
    return null;
  }
}

function mapOpportunity(row: OpportunityRow): DashboardOpportunity {
  const content = (row.content || "").trim();

  return {
    id: row.id,
    title: row.title,
    source: row.source_name || "Unknown source",
    platform: row.platform,
    score: Number(row.score || 0),
    confidence: Number(row.confidence || 0),
    status: row.status || "new",
    action: row.routing_action || "review",
    publishedAt: row.published_at,
    location: row.location_text,
    summary: content ? content.slice(0, 220) + (content.length > 220 ? "..." : "") : "No content captured yet.",
    reason: row.ai_reason,
    canonicalUrl: row.canonical_url,
  };
}

function formatDuration(startedAt: string | null, finishedAt: string | null) {
  if (!startedAt || !finishedAt) return null;

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  const diffSeconds = Math.max(0, Math.round((end - start) / 1000));
  if (diffSeconds < 60) return `${diffSeconds}s`;

  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export async function getDashboardOverview(): Promise<DashboardOverview | null> {
  return withPool(async (db) => {
    const [statsResult, opportunitiesResult, runsResult] = await Promise.all([
      db.query<OverviewStatsRow>(`
        SELECT
          (SELECT COUNT(*) FROM opportunities) AS total_opportunities,
          (SELECT COUNT(*) FROM opportunities WHERE confidence >= 80) AS high_confidence_leads,
          (SELECT COUNT(*) FROM ai_tasks WHERE status = 'pending') AS pending_ai_tasks,
          (SELECT COUNT(*) FROM sources WHERE is_active = true) AS active_sources,
          (SELECT COUNT(*) FROM workflow_runs WHERE status IN ('failed', 'partially_failed') AND started_at >= NOW() - INTERVAL '24 hours') AS recent_failures
      `),
      db.query<OpportunityRow>(`
        SELECT
          o.id,
          o.title,
          COALESCE(s.name, 'Unknown source') AS source_name,
          o.platform::text AS platform,
          o.score,
          o.confidence,
          o.status::text AS status,
          o.routing_action::text AS routing_action,
          o.published_at,
          o.location_text,
          o.content,
          o.ai_reason,
          o.canonical_url
        FROM opportunities o
        LEFT JOIN sources s ON s.id = o.source_id
        WHERE o.status != 'ignored' AND o.is_job IS NOT NULL
        ORDER BY o.last_seen_at DESC
        LIMIT 6
      `),
      db.query<RunRow>(`
        SELECT
          id,
          workflow_name,
          workflow_key,
          status::text AS status,
          trigger_type::text AS trigger_type,
          started_at,
          finished_at,
          item_count_out
        FROM workflow_runs
        ORDER BY started_at DESC
        LIMIT 5
      `),
    ]);

    const statsRow = statsResult.rows[0];

    return {
      stats: [
        {
          label: "Total opportunities",
          value: String(statsRow?.total_opportunities || 0),
          detail: `${statsRow?.high_confidence_leads || 0} high-confidence leads captured`,
        },
        {
          label: "Active sources",
          value: String(statsRow?.active_sources || 0),
          detail: "Validated and evergreen sources currently enabled",
        },
        {
          label: "Pending AI tasks",
          value: String(statsRow?.pending_ai_tasks || 0),
          detail: "Waiting for local worker classification",
        },
        {
          label: "Latest workflow runs",
          value: String(runsResult.rows.length),
          detail: runsResult.rows.length ? `${runsResult.rows[0]?.status} most recent status` : "No run history yet",
        },
      ],
      opportunities: opportunitiesResult.rows.map((row: OpportunityRow) => mapOpportunity(row)),
      runs: runsResult.rows.map((row: RunRow) => ({
        id: row.id,
        name: row.workflow_name || row.workflow_key,
        status: row.status,
        trigger: row.trigger_type || "scheduled",
        startedAt: row.started_at,
        duration: formatDuration(row.started_at, row.finished_at),
        itemsOut: Number(row.item_count_out || 0),
      })),
      recentFailuresCount: Number(statsRow?.recent_failures || 0),
    };
  });
}

export async function getOpportunitiesList(filters?: {
  search?: string;
  status?: string;
  sort?: string;
  field?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: DashboardOpportunity[]; totalCount: number; totalPages: number } | null> {
  return withPool(async (db) => {
    let baseWhere = "WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;
    let searchParamIndex: number | null = null;

    if (filters?.search) {
      baseWhere += ` AND o.search_document @@ websearch_to_tsquery('english', $${paramIndex})`;
      params.push(filters.search);
      searchParamIndex = paramIndex;
      paramIndex++;
    }
    
    if (filters?.field && filters.field !== "all") {
      const fieldTerms: Record<string, string> = {
        software: "(developer OR engineer OR software OR react OR node OR frontend OR backend OR fullstack OR python OR web)",
        video: "(video OR edit OR editor OR premiere OR after effects OR capcut OR animation OR motion)",
        design: "(design OR designer OR figma OR photoshop OR illustrator OR UI OR UX OR graphic)",
        marketing: "(marketing OR SEO OR growth OR ads OR social media OR campaign OR outreach)",
        writing: "(writer OR writing OR copywriter OR content OR blog OR translation OR script)",
        admin: "(admin OR virtual assistant OR VA OR support OR customer service OR data entry)"
      };

      const fieldTerm = fieldTerms[filters.field];
      if (fieldTerm) {
        baseWhere += ` AND o.search_document @@ websearch_to_tsquery('english', $${paramIndex})`;
        params.push(fieldTerm);
        // If there's no custom search but there is a field, use field for smart ranking
        if (!searchParamIndex) {
          searchParamIndex = paramIndex;
        }
        paramIndex++;
      }
    }

    if (filters?.status && filters.status !== "all") {
      if (filters.status === "unreviewed_noise") {
        baseWhere += ` AND (o.status = 'ignored' OR o.is_job IS NULL)`;
      } else {
        baseWhere += ` AND o.status::text = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }
    } else {
      baseWhere += ` AND o.is_job IS NOT NULL`;
    }

    // Get total count
    const countResult = await db.query<{ count: string }>(
      `SELECT COUNT(*) FROM opportunities o ${baseWhere}`,
      params
    );
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const limit = filters?.limit || 12;
    const page = filters?.page || 1;
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    let orderBy = "ORDER BY o.last_seen_at DESC NULLS LAST";
    if (searchParamIndex && filters?.sort === "smart") {
      orderBy = `ORDER BY ts_rank(o.search_document, websearch_to_tsquery('english', $${searchParamIndex})) DESC, o.score DESC NULLS LAST, o.last_seen_at DESC NULLS LAST`;
    } else if (filters?.sort === "smart") {
      orderBy = "ORDER BY o.score DESC NULLS LAST, o.confidence DESC NULLS LAST, o.last_seen_at DESC NULLS LAST";
    } else if (filters?.sort === "confidence") {
      orderBy = "ORDER BY o.confidence DESC NULLS LAST, o.score DESC NULLS LAST, o.last_seen_at DESC NULLS LAST";
    }

    let query = `
      SELECT
        o.id,
        o.title,
        COALESCE(s.name, 'Unknown source') AS source_name,
        o.platform::text AS platform,
        o.score,
        o.confidence,
        o.status::text AS status,
        o.routing_action::text AS routing_action,
        o.published_at,
        o.location_text,
        o.content,
        o.ai_reason,
        o.canonical_url
      FROM opportunities o
      LEFT JOIN sources s ON s.id = o.source_id
      ${baseWhere}
      ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const queryParams = [...params, limit, offset];

    const result = await db.query<OpportunityRow>(query, queryParams);

    return {
      items: result.rows.map((row: OpportunityRow) => mapOpportunity(row)),
      totalCount,
      totalPages,
    };
  });
}

export async function getOpportunityDetail(id: string): Promise<
  | {
      opportunity: DashboardOpportunity & {
        authorName: string | null;
        intent: string | null;
        isJob: boolean | null;
        createdAt: string;
        updatedAt: string;
        content: string | null;
      };
      classifications: Array<{
        id: string;
        provider: string | null;
        modelName: string | null;
        verdict: string | null;
        confidence: number | null;
        reason: string | null;
        createdAt: string;
      }>;
      reviews: Array<{
        id: string;
        userName: string | null;
        fromStatus: string;
        toStatus: string;
        note: string | null;
        createdAt: string;
      }>;
    }
  | null
> {
  return withPool(async (db) => {
    const opportunityResult = await db.query<DetailRow>(
      `
        SELECT
          o.id,
          o.title,
          COALESCE(s.name, 'Unknown source') AS source_name,
          o.platform::text AS platform,
          o.score,
          o.confidence,
          o.status::text AS status,
          o.routing_action::text AS routing_action,
          o.published_at,
          o.location_text,
          o.content,
          o.ai_reason,
          o.canonical_url,
          o.author_name,
          o.intent::text AS intent,
          o.is_job,
          o.created_at,
          o.updated_at
        FROM opportunities o
        LEFT JOIN sources s ON s.id = o.source_id
        WHERE o.id = $1
        LIMIT 1
      `,
      [id],
    );

    const row = opportunityResult.rows[0];
    if (!row) {
      return null;
    }

    const classificationsResult = await db.query<ClassificationRow>(
      `
        SELECT
          id,
          provider,
          model_name,
          verdict,
          confidence,
          reason,
          created_at
        FROM classifications
        WHERE opportunity_id = $1
        ORDER BY created_at DESC
      `,
      [id],
    );

    const reviewsResult = await db.query(
      `
        SELECT
          r.id,
          r.from_status,
          r.to_status,
          r.note,
          r.created_at,
          u.display_name,
          u.email
        FROM reviews r
        LEFT JOIN users u ON u.id = r.reviewer.reviewer_user_id
        WHERE r.opportunity_id = $1
        ORDER BY r.created_at DESC
      `,
      [id],
    );

    return {
      opportunity: {
        ...mapOpportunity(row),
        authorName: row.author_name,
        intent: row.intent,
        isJob: row.is_job,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        content: row.content,
      },
      classifications: classificationsResult.rows.map((item: ClassificationRow) => ({
        id: item.id,
        provider: item.provider,
        modelName: item.model_name,
        verdict: item.verdict,
        confidence: item.confidence !== null ? Number(item.confidence) : null,
        reason: item.reason,
        createdAt: item.created_at,
      })),
      reviews: reviewsResult.rows.map((item) => ({
        id: item.id,
        userName: item.display_name || item.email || "Unknown User",
        fromStatus: item.from_status,
        toStatus: item.to_status,
        note: item.note,
        createdAt: item.created_at,
      })),
    };
  });
}

export async function getSourcesList(): Promise<SourceCard[] | null> {
  return withPool(async (db) => {
    const result = await db.query<SourceRow>(`
      SELECT
        id,
        name,
        state::text AS state,
        monitoring_mode::text AS monitoring_mode,
        confidence,
        last_seen_at,
        last_successful_run_at
      FROM sources
      ORDER BY confidence DESC, last_seen_at DESC NULLS LAST
      LIMIT 60
    `);

    return result.rows.map((row: SourceRow) => ({
      id: row.id,
      name: row.name,
      state: row.state,
      monitoringMode: row.monitoring_mode,
      confidence: Number(row.confidence || 0),
      lastSeen: row.last_seen_at,
      lastRun: row.last_successful_run_at ? "Success" : "No successful run yet",
    }));
  });
}

export async function getReviewsList() {
  return withPool(async (db) => {
    const result = await db.query(
      `
        SELECT
          r.id,
          r.from_status,
          r.to_status,
          r.note,
          r.created_at,
          u.display_name,
          u.email,
          o.title as opportunity_title,
          o.id as opportunity_id
        FROM reviews r
        LEFT JOIN users u ON u.id = r.reviewer.reviewer_user_id
        LEFT JOIN opportunities o ON o.id = r.opportunity_id
        ORDER BY r.created_at DESC
        LIMIT 50
      `
    );

    return result.rows.map((item) => ({
      id: item.id,
      userName: item.display_name || item.email || "Unknown User",
      fromStatus: item.from_status,
      toStatus: item.to_status,
      note: item.note,
      createdAt: item.created_at,
      opportunityTitle: item.opportunity_title,
      opportunityId: item.opportunity_id,
    }));
  });
}
