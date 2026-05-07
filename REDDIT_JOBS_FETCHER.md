# Reddit Jobs Fetcher

This repo includes a Reddit ingestion worker that replaces the old blocked RSS polling flow with a containerized webhook feeder.

Files:
- `scripts/reddit-jobs-scraper.mjs`
- `Dockerfile.reddit-jobs`
- `deploy/reddit-jobs.env.example`

## Why This Exists

The previous `n8n` workflow depended on Reddit RSS endpoints. Since those feeds are now unreliable or blocked, this worker polls Reddit JSON listings directly from your VPS and sends normalized opportunity payloads to an `n8n` webhook, following the same pattern used for LinkedIn jobs.

## What It Does

1. Polls `new.json` for a configured list of subreddits.
2. Normalizes each post into the app's opportunity shape.
3. Applies lightweight hiring/opportunity scoring.
4. Filters out obvious self-promo and low-signal posts.
5. Sends batches to your `n8n` webhook.

## Run Locally

```bash
npm run scraper:reddit:jobs -- --subreddits "forhire|freelance_forhire|hiring|jobs|remotejs" --limit 25 --dryRun true
```

## Environment Variables

- `REDDIT_WEBHOOK_URL`
- `REDDIT_RUN_MODE=once|loop`
- `REDDIT_INTERVAL_MINUTES`
- `REDDIT_SUBREDDITS`
- `REDDIT_LIMIT`
- `REDDIT_MAX_JOBS`
- `REDDIT_FETCH_DELAY_MS`
- `REDDIT_INCLUDE_NSFW=true|false`
- `REDDIT_DRY_RUN=true|false`

Use `|` as the separator for subreddit names.

## Container

Build:

```bash
docker build -f Dockerfile.reddit-jobs -t reddit-jobs-scraper .
```

Run:

```bash
docker run -d \
  --name reddit-jobs-scraper \
  --restart unless-stopped \
  --env-file deploy/reddit-jobs.env.example \
  reddit-jobs-scraper
```

## n8n Setup

1. Create a new workflow or extend the existing opportunities workflow.
2. Add a `Webhook` node.
3. Set method to `POST`.
4. Set path to `reddit-jobs`.
5. Copy the production webhook URL.
6. Put that URL in `REDDIT_WEBHOOK_URL`.
7. Add a `Code` node after the webhook.
8. Use this code:

```javascript
const body = $json;
const jobs = Array.isArray(body.jobs) ? body.jobs : [];

return jobs.map((job) => ({
  json: {
    source: body.source,
    fetched_at: body.fetched_at,
    webhook_context: body.context,
    ...job,
  },
}));
```

9. Connect that node into the same downstream Postgres/AI pipeline you already use for LinkedIn jobs.
10. Upsert by `source_record_key`.
11. Map at least these fields:
    - `platform`
    - `source_normalized_key`
    - `source_name`
    - `source_record_key`
    - `source_native_id`
    - `canonical_url`
    - `title`
    - `author_name`
    - `published_at`
    - `content`
    - `score`
    - `confidence`
    - `routing_action`
    - `intent`
    - `is_job`
    - `parse_quality`
    - `validation_flags`
    - `extracted_entities`
    - `raw_payload`
12. If new or changed, enqueue AI classification.
13. Activate the workflow.

## Notes

- This replaces the old RSS-based scan. The worker sends normalized JSON payloads, not literal RSS XML.
- If Reddit starts throttling more aggressively, increase `REDDIT_FETCH_DELAY_MS` and reduce the subreddit list size per container.
- If you want to preserve the exact historical scoring logic, you can keep the heavier filtering inside `n8n`, but this worker already removes most obvious noise before webhook delivery.
