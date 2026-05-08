import crypto from "node:crypto";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const DEFAULT_HEADERS = {
  "user-agent":
    process.env.REDDIT_USER_AGENT ||
    "radarX-reddit-radar/1.0 (+https://www.reddit.com; contact: admin@example.com)",
  accept: "application/json,text/plain,*/*",
  "accept-language": "en-US,en;q=0.9",
  pragma: "no-cache",
  "cache-control": "no-cache",
};

let redditToken = null;

const SUBREDDIT_SEARCH_KEYWORDS = [
  "freelance",
  "freelancing",
  "hiring",
  "for hire",
  "jobs",
  "remote jobs",
  "contract work",
  "startup",
  "founders",
  "small business",
  "agency",
  "entrepreneur",
  "automation",
  "workflow",
  "web development",
  "website",
  "online business",
  "upwork",
  "fiverr",
  "freelancer",
];

const SOURCE_JOB_KEYWORDS = [
  "looking for",
  "need help",
  "need someone",
  "hire",
  "hiring",
  "for hire",
  "paid",
  "budget",
  "quote",
  "rate",
  "contract",
  "freelancer",
  "consultant",
  "agency",
  "outsourcing",
];

const SOURCE_BUILD_KEYWORDS = [
  "build",
  "create",
  "develop",
  "set up",
  "implement",
  "design",
  "custom",
  "automation",
  "workflow",
  "script",
  "api",
  "bot",
  "dashboard",
  "website",
  "landing page",
  "mvp",
  "integration",
  "crm",
];

const SOURCE_PAIN_KEYWORDS = [
  "manual",
  "artist",
  "time-consuming",
  "inefficient",
  "scale",
  "process",
  "messy",
  "spreadsheet",
  "follow up",
  "lead management",
  "reporting",
  "operations",
];

const SOURCE_BAD_KEYWORDS = [
  "game",
  "artist",
  "gaming",
  "politics",
  "president",
  "news",
  "memes",
  "entertainment",
  "movie",
  "tv",
  "music",
  "opinion",
  "thoughts",
  "what do you think",
  "discussion only",
];

const EMPLOYER_KEYWORDS = [
  "we are hiring",
  "looking to hire",
  "need someone to",
  "need a developer",
  "seeking a",
  "job opening",
  "position available",
  "contract role",
  "[hiring]",
  "hiring",
];

const MONEY_KEYWORDS = ["$", "usd", "budget", "paid", "salary", "rate", "/hr", "per hour", "payment"];

const DELIVERY_KEYWORDS = [
  "build",
  "develop",
  "create",
  "automation",
  "workflow",
  "api",
  "bot",
  "dashboard",
  "landing page",
  "website",
  "mvp",
  "integration",
  "scraping",
  "n8n",
];

const URGENCY_KEYWORDS = ["asap", "urgent", "immediately", "this week", "right away", "soon"];

const SELF_PROMO_KEYWORDS = [
  "[for hire]",
  "[available]",
  "open for work",
  "commission open",
  "looking for work",
  "available for work",
];

const HARD_NEGATIVES = [
  "i am looking for",
  "need a job",
  "my journey",
  "case study",
  "guide",
  "discussion",
  "rant",
  "showcase",
  "i built",
  "we built",
  "i launched",
  "thoughts on",
  "is it possible",
];

function parseCliArgs(argv) {
  const parsed = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = "true";
      continue;
    }

    parsed[key] = next;
    i += 1;
  }

  return parsed;
}

function listFromEnv(value, fallback = []) {
  if (!value) return fallback;
  const raw = String(value);
  const separator = raw.includes("|") ? "|" : raw.includes("\n") ? "\n" : ",";
  return raw
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function countMatches(text, words) {
  return words.reduce((total, word) => total + (text.includes(word) ? 1 : 0), 0);
}

function cleanString(value = "") {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#32;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/\u0000/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function md5(value) {
  return crypto.createHash("md5").update(String(value || "")).digest("hex");
}

function hoursSince(timestamp) {
  if (!timestamp) return Infinity;
  const parsed = new Date(timestamp).getTime();
  if (Number.isNaN(parsed)) return Infinity;
  return (Date.now() - parsed) / (1000 * 60 * 60);
}

function daysSince(timestamp) {
  if (!timestamp) return Infinity;
  const parsed = new Date(timestamp).getTime();
  if (Number.isNaN(parsed)) return Infinity;
  return (Date.now() - parsed) / (1000 * 60 * 60 * 24);
}

function publishedAtFromRawPost(rawPost) {
  if (!rawPost?.created_utc) return null;
  const parsed = new Date(Number(rawPost.created_utc) * 1000);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function newestPublishedAt(rawPosts) {
  let newest = null;

  for (const rawPost of rawPosts) {
    const publishedAt = publishedAtFromRawPost(rawPost);
    if (!publishedAt) continue;
    if (!newest || new Date(publishedAt) > new Date(newest)) newest = publishedAt;
  }

  return newest;
}

function isFreshPost(post, maxAgeDays) {
  if (!maxAgeDays) return true;
  return daysSince(post.published_at) <= maxAgeDays;
}

async function getRedditAccessToken(config) {
  if (!config.redditClientId || !config.redditClientSecret) return null;
  if (redditToken && redditToken.expiresAt > Date.now() + 60_000) return redditToken.value;

  const credentials = Buffer.from(`${config.redditClientId}:${config.redditClientSecret}`).toString("base64");
  const response = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      authorization: `Basic ${credentials}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Reddit OAuth failed with HTTP ${response.status}${body ? `: ${body.slice(0, 240)}` : ""}`);
  }

  const payload = await response.json();
  redditToken = {
    value: payload.access_token,
    expiresAt: Date.now() + Number(payload.expires_in || 3600) * 1000,
  };
  return redditToken.value;
}

async function redditApiUrl(config, path, params = {}) {
  const token = await getRedditAccessToken(config);
  const base = token ? "https://oauth.reddit.com" : "https://www.reddit.com";
  const url = new URL(`${base}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }
  return { url: url.toString(), token };
}

async function fetchJson(config, path, params = {}) {
  const { url, token } = await redditApiUrl(config, path, params);
  const headers = token ? { ...DEFAULT_HEADERS, authorization: `Bearer ${token}` } : DEFAULT_HEADERS;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url}${body ? `: ${body.slice(0, 240)}` : ""}`);
  }

  return response.json();
}

async function fetchPublicText(url) {
  const response = await fetch(url, { headers: { ...DEFAULT_HEADERS, accept: "application/rss+xml,application/xml,text/xml,*/*" } });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url}${body ? `: ${body.slice(0, 240)}` : ""}`);
  }

  return response.text();
}

function extractXml(value, regex) {
  const match = String(value || "").match(regex);
  return match ? cleanString(match[1]) : "";
}

function extractXmlRaw(value, regex) {
  const match = String(value || "").match(regex);
  return match ? match[1].trim() : "";
}

function extractSubredditFromLink(link) {
  if (!link || !link.includes("/r/")) return "";
  return link.split("/r/")[1]?.split("/")[0]?.toLowerCase() || "";
}

function atomEntries(xml) {
  return String(xml || "").match(/<entry>([\s\S]*?)<\/entry>/g) || [];
}

async function withWorkflowRun(pool, workflowKey, workflowName, triggerType, fn) {
  const started = await pool.query(
    `INSERT INTO workflow_runs (workflow_key, workflow_name, trigger_type, status, started_at, updated_at)
     VALUES ($1, $2, $3::workflow_trigger_type, 'running', now(), now())
     RETURNING id`,
    [workflowKey, workflowName, triggerType],
  );
  const runId = started.rows[0].id;

  try {
    const result = await fn(runId);
    await pool.query(
      `UPDATE workflow_runs
       SET status = $2::workflow_run_status,
           finished_at = now(),
           source_count = $3,
           item_count_in = $4,
           item_count_out = $5,
           error_count = $6,
           summary = $7::jsonb,
           updated_at = now()
       WHERE id = $1`,
      [
        runId,
        result.errorCount > 0 ? "partially_failed" : "succeeded",
        result.sourceCount || 0,
        result.itemCountIn || 0,
        result.itemCountOut || 0,
        result.errorCount || 0,
        JSON.stringify(result.summary || {}),
      ],
    );
    return result;
  } catch (error) {
    await pool.query(
      `UPDATE workflow_runs
       SET status = 'failed', finished_at = now(), error_count = 1, error_summary = $2, updated_at = now()
       WHERE id = $1`,
      [runId, error instanceof Error ? error.message : String(error)],
    );
    throw error;
  }
}

function scoreDiscoveredSource(source) {
  const title = (source.title || "").toLowerCase();
  const desc = (source.description || "").toLowerCase();
  const link = source.link || "";
  let score = 0;

  score += countMatches(desc, SOURCE_JOB_KEYWORDS) * 5;
  score += countMatches(desc, SOURCE_BUILD_KEYWORDS) * 3;
  score += countMatches(desc, SOURCE_PAIN_KEYWORDS) * 2;
  if (desc.includes("script") || desc.includes("api")) score += 2;
  if (desc.includes("tool") || desc.includes("workflow")) score += 2;
  score -= countMatches(title, SOURCE_BAD_KEYWORDS) * 4;
  score -= countMatches(desc, SOURCE_BAD_KEYWORDS) * 3;
  if (desc.length > 120) score += 1;
  if (link.includes("/r/")) score += 1;

  if (score < 5) return null;

  return {
    score,
    category: score >= 10 ? "High-value" : score >= 7 ? "Good" : "Medium",
  };
}

function confidenceForSource(scored, existing) {
  const now = new Date();
  const firstSeen = existing?.first_seen_at ? new Date(existing.first_seen_at) : now;
  const lastSeenPrev = existing?.last_seen_at ? new Date(existing.last_seen_at) : now;
  const daysSinceLastSeen = Math.floor((now - lastSeenPrev) / (1000 * 60 * 60 * 24));
  const weeksAlive = Math.max(1, Math.floor((now - firstSeen) / (1000 * 60 * 60 * 24 * 7)));
  let confidence = scored.score * 10;

  confidence += Math.min(weeksAlive * 5, 30);
  if (scored.category.includes("High")) confidence += 20;
  else if (scored.category.includes("Good")) confidence += 10;

  if (daysSinceLastSeen > 60) confidence = 0;
  else if (daysSinceLastSeen > 30) confidence -= 30;
  else if (daysSinceLastSeen > 7) confidence -= 10;

  confidence = Math.max(0, Math.min(100, confidence));

  if (confidence >= 90) return { confidence, status: "Evergreen", action: "Always scanned" };
  if (confidence >= 70) return { confidence, status: "Validated", action: "Scanned" };
  if (confidence >= 30) return { confidence, status: "Candidate", action: "Monitored" };
  return { confidence, status: "Archived", action: "Ignored" };
}

function mapSourceState(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "evergreen") return "evergreen";
  if (normalized === "validated") return "validated";
  if (normalized === "archived") return "archived";
  return "candidate";
}

function mapMonitoringMode(action) {
  const normalized = String(action || "").toLowerCase();
  if (normalized === "always scanned") return "always_scanned";
  if (normalized === "scanned") return "scanned";
  if (normalized === "ignored") return "ignored";
  return "monitored";
}

function normalizeDiscoveredSubreddit(raw, query) {
  const subreddit = String(raw.display_name || raw.display_name_prefixed || raw.url || "")
    .replace(/^r\//i, "")
    .replace(/^\/r\//i, "")
    .replace(/\/$/, "")
    .trim()
    .toLowerCase();
  if (!subreddit) return null;

  const link = raw.url ? `https://www.reddit.com${raw.url}` : `https://www.reddit.com/r/${subreddit}/`;
  const description = cleanString(raw.public_description || raw.description || raw.title || "");

  return {
    subreddit,
    title: cleanString(raw.title || `r/${subreddit}`),
    description,
    link,
    updated: raw.created_utc ? new Date(raw.created_utc * 1000).toISOString() : new Date().toISOString(),
    source: "reddit_json",
    parsedAt: new Date().toISOString(),
    query,
    raw,
  };
}

function parseDiscoveredSubredditsFromRss(xml, query) {
  const resultsMap = new Map();

  for (const entry of atomEntries(xml)) {
    const title = extractXml(entry, /<title[^>]*>([\s\S]*?)<\/title>/);
    const link = extractXmlRaw(entry, /<link[^>]*href="([^"]+)"/);
    const updated = extractXml(entry, /<updated[^>]*>([\s\S]*?)<\/updated>/);
    const description = extractXml(entry, /<content[^>]*>([\s\S]*?)<\/content>/);
    const subreddit = extractSubredditFromLink(link);
    if (!subreddit) continue;

    const source = {
      subreddit,
      title,
      description,
      link,
      updated: updated || new Date().toISOString(),
      source: "reddit_rss",
      parsedAt: new Date().toISOString(),
      query,
      raw: entry,
    };
    const existing = resultsMap.get(subreddit);

    if (!existing || description.length > (existing.description || "").length || source.updated > existing.updated) {
      resultsMap.set(subreddit, source);
    }
  }

  return Array.from(resultsMap.values());
}

async function fetchDiscoveredSubreddits(config, keyword) {
  if (config.redditClientId && config.redditClientSecret) {
    const payload = await fetchJson(config, "/subreddits/search.json", {
      q: keyword,
      limit: config.discoveryLimit,
      raw_json: 1,
    });

    return (payload?.data?.children || [])
      .map((child) => normalizeDiscoveredSubreddit(child?.data || {}, keyword))
      .filter(Boolean);
  }

  const rssUrl = `https://www.reddit.com/subreddits/search.rss?q=${encodeURIComponent(keyword)}`;
  const xml = await fetchPublicText(rssUrl);
  return parseDiscoveredSubredditsFromRss(xml, keyword);
}

async function discoverSubreddits(config, pool) {
  const keywords = config.discoveryKeywords;
  const resultsMap = new Map();
  const errors = [];

  for (const keyword of keywords) {
    try {
      for (const source of await fetchDiscoveredSubreddits(config, keyword)) {
        const existing = resultsMap.get(source.subreddit);
        if (!existing || source.description.length > (existing.description || "").length || source.updated > existing.updated) {
          resultsMap.set(source.subreddit, source);
        }
      }
    } catch (error) {
      errors.push({ keyword, error: error instanceof Error ? error.message : String(error) });
    }

    await sleep(config.fetchDelayMs);
  }

  const discovered = Array.from(resultsMap.values());
  const scored = [];

  for (const source of discovered) {
    const score = scoreDiscoveredSource(source);
    if (score) scored.push({ ...source, ...score });
  }

  if (config.dryRun) {
    console.log(JSON.stringify({ mode: "discover", discovered: discovered.length, scored }, null, 2));
    return { sourceCount: scored.length, itemCountIn: discovered.length, itemCountOut: scored.length, errorCount: errors.length, summary: { errors } };
  }

  const keys = scored.map((source) => `reddit:subreddit:${source.subreddit}`);
  const existingRows = keys.length
    ? await pool.query(`SELECT normalized_key, first_seen_at, last_seen_at FROM sources WHERE normalized_key = ANY($1::text[])`, [keys])
    : { rows: [] };
  const existingMap = new Map(existingRows.rows.map((row) => [row.normalized_key, row]));
  let upserted = 0;

  for (const source of scored) {
    const normalizedKey = `reddit:subreddit:${source.subreddit}`;
    const confidence = confidenceForSource(source, existingMap.get(normalizedKey));

    await pool.query(
      `INSERT INTO sources (
         platform, kind, normalized_key, name, slug, external_id, canonical_url, feed_url,
         state, monitoring_mode, relevance_score, confidence, discovered_by_query,
         first_seen_at, last_seen_at, last_scanned_at, last_successful_run_at, source_metadata
       )
       VALUES (
         'reddit', 'subreddit', $1, $2, $3, $4, $5, $6,
         $7::source_state, $8::source_monitoring_mode, $9, $10, $11,
         COALESCE($12::timestamptz, now()), now(), now(), now(), $13::jsonb
       )
       ON CONFLICT (normalized_key)
       DO UPDATE SET
         name = EXCLUDED.name,
         slug = EXCLUDED.slug,
         external_id = EXCLUDED.external_id,
         canonical_url = EXCLUDED.canonical_url,
         feed_url = EXCLUDED.feed_url,
         state = EXCLUDED.state,
         monitoring_mode = EXCLUDED.monitoring_mode,
         relevance_score = EXCLUDED.relevance_score,
         confidence = EXCLUDED.confidence,
         discovered_by_query = COALESCE(EXCLUDED.discovered_by_query, sources.discovered_by_query),
         last_seen_at = EXCLUDED.last_seen_at,
         last_scanned_at = now(),
         last_successful_run_at = now(),
         source_metadata = EXCLUDED.source_metadata,
         updated_at = now()`,
      [
        normalizedKey,
        `r/${source.subreddit}`,
        source.subreddit,
        source.subreddit,
        source.link,
        `${source.link.replace(/\/$/, "")}.rss`,
        mapSourceState(confidence.status),
        mapMonitoringMode(confidence.action),
        source.score,
        confidence.confidence,
        source.query,
        existingMap.get(normalizedKey)?.first_seen_at || null,
        JSON.stringify({ ...source, status: confidence.status, action: confidence.action, confidence: confidence.confidence }),
      ],
    );
    upserted += 1;
  }

  return {
    sourceCount: upserted,
    itemCountIn: discovered.length,
    itemCountOut: upserted,
    errorCount: errors.length,
    summary: { discovered: discovered.length, scored: scored.length, upserted, errors },
  };
}

async function loadActiveSources(pool) {
  const result = await pool.query(
    `SELECT
       id,
       COALESCE(NULLIF(slug, ''), NULLIF(external_id, ''), regexp_replace(name, '^r/', '', 'i')) AS subreddit,
       state,
       confidence,
       monitoring_mode,
       last_scanned_at
     FROM sources
     WHERE platform = 'reddit'
       AND is_active = true
       AND state IN ('validated', 'evergreen')
       AND monitoring_mode IN ('scanned', 'always_scanned')
     ORDER BY
       CASE WHEN monitoring_mode = 'always_scanned' THEN 0 ELSE 1 END,
       confidence DESC,
       last_scanned_at NULLS FIRST`,
  );

  return result.rows
    .filter((row) => row.subreddit)
    .map((row) => ({ ...row, subreddit: String(row.subreddit).trim().toLowerCase() }))
    .filter((row) => row.monitoring_mode === "always_scanned" || hoursSince(row.last_scanned_at) >= 6);
}

function normalizePost(rawPost, subreddit) {
  const permalink = rawPost.permalink || "";
  const canonicalUrl = permalink ? `https://www.reddit.com${permalink}` : rawPost.url || "";
  const title = cleanString(rawPost.title || "");
  const content = cleanString(rawPost.selftext || rawPost.selftext_html || "");

  if (!title || !canonicalUrl) return null;

  return {
    source_normalized_key: `reddit:subreddit:${subreddit.toLowerCase()}`,
    source_record_key: canonicalUrl,
    canonical_url: canonicalUrl,
    source_native_id: rawPost.id || canonicalUrl.split("/comments/")[1]?.split("/")[0] || null,
    subreddit,
    title,
    content,
    text: `${title}\n\n${content}`.trim(),
    author_name: rawPost.author || null,
    published_at: rawPost.created_utc ? new Date(rawPost.created_utc * 1000).toISOString() : null,
    ups: Number(rawPost.ups || 0),
    num_comments: Number(rawPost.num_comments || 0),
    over_18: Boolean(rawPost.over_18),
    raw_payload: rawPost,
  };
}

function scoreUnseenPost(post) {
  const text = `${post.title || ""} ${post.content || ""}`.toLowerCase();

  if (!text.trim()) return null;
  if (post.over_18) return null;
  if (countMatches(text, HARD_NEGATIVES) > 0) return null;
  if (countMatches(text, SELF_PROMO_KEYWORDS) > 0) return null;
  if (text.length < 80) return null;

  const employerHits = countMatches(text, EMPLOYER_KEYWORDS);
  const moneyHits = countMatches(text, MONEY_KEYWORDS);
  const deliveryHits = countMatches(text, DELIVERY_KEYWORDS);
  const urgencyHits = countMatches(text, URGENCY_KEYWORDS);

  if (employerHits === 0) return null;

  let score = 0;
  score += employerHits * 35;
  score += moneyHits * 22;
  score += deliveryHits * 8;
  score += urgencyHits * 6;
  if (text.length > 400) score += 8;
  if (text.length > 800) score += 10;
  if ((post.num_comments || 0) >= 5) score += 4;
  if ((post.ups || 0) >= 10) score += 4;
  if (score < 80) return null;

  let decision = "needs_ai";
  let confidence = Math.min(82, 40 + Math.floor(score / 3));
  let routingAction = "review";
  const strongEmployer = employerHits >= 2;
  const strongCommercialSignal = moneyHits >= 1 || deliveryHits >= 3;

  if (score >= 130 && strongEmployer && strongCommercialSignal) {
    decision = "direct_accept";
    confidence = Math.min(96, 58 + Math.floor(score / 2.5));
  }

  if (score >= 150) routingAction = "telegram";

  return {
    ...post,
    intent: "job",
    job_score: score,
    score,
    decision,
    needs_ai: decision === "needs_ai",
    routing_action: routingAction,
    confidence,
    heuristic_reason: `employer:${employerHits}, money:${moneyHits}, delivery:${deliveryHits}, urgency:${urgencyHits}`,
    ai_input_text: `${post.title || ""}\n\n${post.content || ""}`.slice(0, 950),
  };
}

async function fetchSubredditPosts(config, subreddit, limit) {
  if (config.redditClientId && config.redditClientSecret) {
    const payload = await fetchJson(config, `/r/${encodeURIComponent(subreddit)}/new.json`, { limit, raw_json: 1 });
    return (payload?.data?.children || []).map((child) => child?.data).filter(Boolean);
  }

  const rssUrl = `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/new/.rss`;
  const xml = await fetchPublicText(rssUrl);
  return atomEntries(xml)
    .slice(0, limit)
    .map((entry) => {
      const title = extractXml(entry, /<title[^>]*>([\s\S]*?)<\/title>/);
      const url = extractXmlRaw(entry, /<link[^>]*href="([^"]+)"/);
      const author = extractXml(entry, /<name[^>]*>([\s\S]*?)<\/name>/).replace(/^\/u\//, "");
      const published = extractXml(entry, /<published[^>]*>([\s\S]*?)<\/published>/);
      const rawContent = extractXmlRaw(entry, /<content[^>]*>([\s\S]*?)<\/content>/);
      const content = cleanString(rawContent);

      return {
        id: url.split("/comments/")[1]?.split("/")[0] || null,
        permalink: url.startsWith("https://www.reddit.com") ? url.replace("https://www.reddit.com", "") : "",
        url,
        title,
        selftext: content,
        author,
        created_utc: published ? Math.floor(new Date(published).getTime() / 1000) : null,
        ups: 0,
        num_comments: 0,
        over_18: false,
        raw_rss_entry: entry,
      };
    })
    .filter((post) => post.title && (post.permalink || post.url));
}

function sourceScanDecision(source, rawPosts, config) {
  const newest = newestPublishedAt(rawPosts);
  const ageDays = daysSince(newest);
  const currentConfidence = Number(source.confidence || 0);

  if (!rawPosts.length || ageDays > config.sourceArchiveAfterDays) {
    return {
      newest,
      state: "archived",
      monitoringMode: "ignored",
      confidence: 0,
      reason: !rawPosts.length ? "no_posts_returned" : `newest_post_older_than_${config.sourceArchiveAfterDays}_days`,
    };
  }

  if (ageDays > config.sourceStaleAfterDays) {
    return {
      newest,
      state: "candidate",
      monitoringMode: "monitored",
      confidence: Math.max(0, currentConfidence - 30),
      reason: `newest_post_older_than_${config.sourceStaleAfterDays}_days`,
    };
  }

  if (ageDays > config.maxPostAgeDays) {
    return {
      newest,
      state: source.state || "validated",
      monitoringMode: source.monitoring_mode || "scanned",
      confidence: Math.max(0, currentConfidence - 10),
      reason: `newest_post_older_than_${config.maxPostAgeDays}_days`,
    };
  }

  return {
    newest,
    state: source.state || "validated",
    monitoringMode: source.monitoring_mode || "scanned",
    confidence: Math.min(100, Math.max(currentConfidence, 70)),
    reason: "fresh_posts_available",
  };
}

async function updateSourceScanState(pool, source, rawPosts, config) {
  if (!source.id) return null;

  const decision = sourceScanDecision(source, rawPosts, config);

  await pool.query(
    `UPDATE sources
     SET state = $2::source_state,
         monitoring_mode = $3::source_monitoring_mode,
         confidence = $4,
         last_seen_at = COALESCE($5::timestamptz, last_seen_at),
         last_scanned_at = now(),
         last_successful_run_at = now(),
         source_metadata = source_metadata || $6::jsonb,
         updated_at = now()
     WHERE id = $1`,
    [
      source.id,
      decision.state,
      decision.monitoringMode,
      decision.confidence,
      decision.newest,
      JSON.stringify({
        last_scan_health: {
          reason: decision.reason,
          newest_published_at: decision.newest,
          checked_at: new Date().toISOString(),
        },
      }),
    ],
  );

  return decision;
}

async function lookupExistingOpportunityKeys(pool, keys) {
  if (!keys.length) return new Set();
  const result = await pool.query(`SELECT source_record_key FROM opportunities WHERE source_record_key = ANY($1::text[])`, [keys]);
  return new Set(result.rows.map((row) => row.source_record_key));
}

async function upsertOpportunity(pool, item, isJob) {
  const result = await pool.query(
    `INSERT INTO opportunities (
       source_id, platform, source_record_key, content_fingerprint, source_native_id, canonical_url,
       title, content, author_name, published_at, first_seen_at, last_seen_at, score, confidence,
       status, routing_action, intent, is_job, ai_reason, extracted_entities, raw_payload
     )
     VALUES (
       (SELECT id FROM sources WHERE normalized_key = $1 LIMIT 1),
       'reddit', $2, md5(COALESCE($3, '') || '|' || COALESCE($4, '')), $5, $6,
       $7, $8, $9, CASE WHEN NULLIF($10, '') IS NULL THEN now() ELSE $10::timestamptz END,
       now(), now(), $11, $12, 'new',
       CASE WHEN LOWER($13) = 'telegram' THEN 'telegram'::opportunity_routing_action ELSE 'review'::opportunity_routing_action END,
       'job', $14, $15, $16::jsonb, $17::jsonb
     )
     ON CONFLICT (source_record_key)
     DO UPDATE SET
       last_seen_at = now(),
       score = GREATEST(opportunities.score, EXCLUDED.score),
       confidence = GREATEST(opportunities.confidence, EXCLUDED.confidence),
       routing_action = EXCLUDED.routing_action,
       ai_reason = COALESCE(EXCLUDED.ai_reason, opportunities.ai_reason),
       extracted_entities = EXCLUDED.extracted_entities,
       raw_payload = EXCLUDED.raw_payload,
       updated_at = now()
     RETURNING id, source_record_key, routing_action`,
    [
      item.source_normalized_key,
      item.source_record_key,
      item.title || "",
      item.text || item.content || "",
      item.source_native_id || null,
      item.canonical_url || "",
      item.title || "",
      item.content || "",
      item.author_name || "",
      item.published_at || "",
      Number(item.job_score || item.score || 0),
      Number(item.confidence || 0),
      item.routing_action || "review",
      isJob,
      item.ai_reason || item.heuristic_reason || "",
      JSON.stringify(item.extracted_entities || { subreddit: item.subreddit, ups: item.ups, num_comments: item.num_comments }),
      JSON.stringify(item),
    ],
  );

  return result.rows[0];
}

async function enqueueAiTask(pool, opportunityId, item) {
  await pool.query(
    `INSERT INTO ai_tasks (opportunity_id, status, provider_preference, priority, payload)
     VALUES ($1, 'pending', 'local', 80, $2::jsonb)
     ON CONFLICT DO NOTHING`,
    [
      opportunityId,
      JSON.stringify({
        source: "reddit",
        classifier: "reddit_job_batch",
        id: item.source_record_key,
        subreddit: item.subreddit,
        title: item.title,
        link: item.canonical_url,
        text: item.ai_input_text,
        heuristic_score: item.job_score,
        original: item,
      }),
    ],
  );
}

async function sendTelegramIfConfigured(config, item) {
  if (!config.telegramBotToken || !config.telegramChatId) return;

  const message = [
    "New Reddit job signal",
    `Subreddit: r/${item.subreddit || ""}`,
    `Score: ${item.job_score || item.score || 0}`,
    `Title: ${item.title || ""}`,
    item.canonical_url || item.link || "",
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: config.telegramChatId, text: message, disable_web_page_preview: false }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram failed with HTTP ${response.status}: ${body}`);
  }
}

async function scanJobs(config, pool) {
  const sources = config.scanSubreddits.length
    ? config.scanSubreddits.map((subreddit) => ({ id: null, subreddit: subreddit.toLowerCase(), monitoring_mode: "manual" }))
    : await loadActiveSources(pool);
  const seen = new Set();
  const posts = [];
  const errors = [];
  const staleSources = [];
  let skippedOldPosts = 0;

  for (const source of sources) {
    try {
      const rawPosts = await fetchSubredditPosts(config, source.subreddit, config.scanLimit);
      const sourceDecision = config.dryRun ? sourceScanDecision(source, rawPosts, config) : await updateSourceScanState(pool, source, rawPosts, config);
      if (sourceDecision && sourceDecision.reason !== "fresh_posts_available") {
        staleSources.push({ subreddit: source.subreddit, ...sourceDecision });
      }

      for (const rawPost of rawPosts) {
        const post = normalizePost(rawPost, source.subreddit);
        if (!post || seen.has(post.source_record_key)) continue;
        if (!isFreshPost(post, config.maxPostAgeDays)) {
          skippedOldPosts += 1;
          continue;
        }

        seen.add(post.source_record_key);
        posts.push(post);
      }
    } catch (error) {
      errors.push({ subreddit: source.subreddit, error: error instanceof Error ? error.message : String(error) });
    }

    await sleep(config.fetchDelayMs);
  }

  const existingKeys = config.dryRun ? new Set() : await lookupExistingOpportunityKeys(pool, posts.map((post) => post.source_record_key));
  const candidates = posts
    .filter((post) => !existingKeys.has(post.source_record_key))
    .map(scoreUnseenPost)
    .filter(Boolean);
  const direct = candidates.filter((item) => item.decision === "direct_accept");
  const needsAi = candidates
    .filter((item) => item.decision === "needs_ai")
    .sort((a, b) => (b.job_score || 0) - (a.job_score || 0))
    .slice(0, config.maxAiItemsPerRun);

  if (config.dryRun) {
    console.log(JSON.stringify({ mode: "scan", sources: sources.length, posts: posts.length, direct, needsAi }, null, 2));
    return {
      sourceCount: sources.length,
      itemCountIn: posts.length,
      itemCountOut: direct.length + needsAi.length,
      errorCount: errors.length,
      summary: { candidates: candidates.length, direct: direct.length, needsAi: needsAi.length, skippedOldPosts, staleSources, errors },
    };
  }

  let upserted = 0;
  let aiTasks = 0;
  let telegramSent = 0;

  for (const item of direct) {
    const row = await upsertOpportunity(pool, item, true);
    upserted += 1;

    if (row?.routing_action === "telegram") {
      try {
        await sendTelegramIfConfigured(config, item);
        telegramSent += 1;
      } catch (error) {
        errors.push({ telegram: item.source_record_key, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  for (const item of needsAi) {
    const row = await upsertOpportunity(pool, item, null);
    upserted += 1;
    if (row?.id) {
      await enqueueAiTask(pool, row.id, item);
      aiTasks += 1;
    }
  }

  return {
    sourceCount: sources.length,
    itemCountIn: posts.length,
    itemCountOut: upserted,
    errorCount: errors.length,
    summary: { candidates: candidates.length, direct: direct.length, needsAi: needsAi.length, upserted, aiTasks, telegramSent, skippedOldPosts, staleSources, errors },
  };
}

function buildConfig() {
  const cli = parseCliArgs(process.argv.slice(2));

  return {
    databaseUrl: cli.databaseUrl || process.env.DATABASE_URL || "",
    runMode: cli.mode || process.env.REDDIT_RADAR_RUN_MODE || process.env.REDDIT_RUN_MODE || "loop",
    task: cli.task || process.env.REDDIT_RADAR_TASK || "all",
    dryRun: toBool(cli.dryRun ?? process.env.REDDIT_RADAR_DRY_RUN ?? process.env.REDDIT_DRY_RUN, false),
    discoveryKeywords: listFromEnv(
      cli.discoveryKeywords || process.env.REDDIT_DISCOVERY_KEYWORDS,
      SUBREDDIT_SEARCH_KEYWORDS,
    ),
    discoveryLimit: toPositiveInt(cli.discoveryLimit || process.env.REDDIT_DISCOVERY_LIMIT, 25),
    discoveryIntervalHours: toPositiveInt(cli.discoveryIntervalHours || process.env.REDDIT_DISCOVERY_INTERVAL_HOURS, 168),
    scanIntervalMinutes: toPositiveInt(cli.scanIntervalMinutes || process.env.REDDIT_SCAN_INTERVAL_MINUTES, 30),
    scanLimit: toPositiveInt(cli.limit || process.env.REDDIT_LIMIT, 50),
    scanSubreddits: listFromEnv(cli.subreddits || process.env.REDDIT_SUBREDDITS, []),
    maxAiItemsPerRun: toPositiveInt(cli.maxAiItemsPerRun || process.env.REDDIT_MAX_AI_ITEMS_PER_RUN, 24),
    maxPostAgeDays: toPositiveInt(cli.maxPostAgeDays || process.env.REDDIT_MAX_POST_AGE_DAYS, 14),
    sourceStaleAfterDays: toPositiveInt(cli.sourceStaleAfterDays || process.env.REDDIT_SOURCE_STALE_AFTER_DAYS, 30),
    sourceArchiveAfterDays: toPositiveInt(cli.sourceArchiveAfterDays || process.env.REDDIT_SOURCE_ARCHIVE_AFTER_DAYS, 90),
    fetchDelayMs: toPositiveInt(cli.fetchDelayMs || process.env.REDDIT_FETCH_DELAY_MS, 2000),
    redditClientId: cli.redditClientId || process.env.REDDIT_CLIENT_ID || "",
    redditClientSecret: cli.redditClientSecret || process.env.REDDIT_CLIENT_SECRET || "",
    telegramBotToken: cli.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || "",
    telegramChatId: cli.telegramChatId || process.env.TELEGRAM_CHAT_ID || "",
  };
}

function createPool(config) {
  if (config.dryRun && !config.databaseUrl) {
    return null;
  }

  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required for the direct Postgres Reddit radar worker.");
  }

  return new Pool({ connectionString: config.databaseUrl, max: 4 });
}

async function runSelectedTask(config, pool, triggerType = "scheduled") {
  const results = [];

  if (config.task === "all" || config.task === "discover") {
    const result = config.dryRun
      ? await discoverSubreddits(config, pool)
      : await withWorkflowRun(pool, "reddit-subreddit-radar", "Reddit Subreddit Radar", triggerType, (runId) =>
          discoverSubreddits({ ...config, runId }, pool),
        );
    results.push({ task: "discover", result });
  }

  if (config.task === "all" || config.task === "scan") {
    const result = config.dryRun
      ? await scanJobs(config, pool)
      : await withWorkflowRun(pool, "reddit-job-radar", "Reddit Job Radar", triggerType, (runId) =>
          scanJobs({ ...config, runId }, pool),
        );
    results.push({ task: "scan", result });
  }

  console.log(JSON.stringify({ finishedAt: new Date().toISOString(), results }, null, 2));
}

async function main() {
  const config = buildConfig();
  const pool = createPool(config);

  try {
    if (config.runMode !== "loop") {
      await runSelectedTask(config, pool, "manual");
      return;
    }

    let lastDiscoveryAt = 0;

    while (true) {
      const now = Date.now();
      const shouldDiscover =
        config.task === "discover" ||
        config.task === "all" && now - lastDiscoveryAt >= config.discoveryIntervalHours * 60 * 60 * 1000;

      try {
        if (shouldDiscover) {
          await withWorkflowRun(pool, "reddit-subreddit-radar", "Reddit Subreddit Radar", "scheduled", (runId) =>
            discoverSubreddits({ ...config, runId }, pool),
          );
          lastDiscoveryAt = now;
        }

        if (config.task === "scan" || config.task === "all") {
          await withWorkflowRun(pool, "reddit-job-radar", "Reddit Job Radar", "scheduled", (runId) =>
            scanJobs({ ...config, runId }, pool),
          );
        }
      } catch (error) {
        console.error(error instanceof Error ? error.stack || error.message : error);
      }

      const sleepMinutes = config.task === "discover" ? config.discoveryIntervalHours * 60 : config.scanIntervalMinutes;
      await sleep(sleepMinutes * 60 * 1000);
    }
  } finally {
    if (config.runMode !== "loop" && pool) await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
