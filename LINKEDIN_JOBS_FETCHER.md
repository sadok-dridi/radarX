# LinkedIn Jobs Fetcher

This repo includes a LinkedIn jobs fetcher built around LinkedIn guest job endpoints.

Files:
- `scripts/linkedin-jobs-scraper.mjs`
- `Dockerfile.linkedin-jobs`
- `deploy/linkedin-jobs.env.example`

## What It Does

1. Searches LinkedIn jobs guest results by keyword and location.
2. Fetches each job detail page.
3. Extracts normalized job data.
4. Adds `score`, `confidence`, `parse_quality`, and `validation_flags`.
5. Sends batches to your `n8n` webhook.

## Run Locally

```bash
npm run scraper:linkedin:jobs -- --keywords "full stack|developpeur full stack|مطور ويب" --locations "Tunisia|Remote" --pages 1 --maxJobs 10 --dryRun true
```

## Environment Variables

- `LINKEDIN_WEBHOOK_URL`
- `LINKEDIN_RUN_MODE=once|loop`
- `LINKEDIN_INTERVAL_MINUTES`
- `LINKEDIN_TIME_POSTED`
- `LINKEDIN_PAGES`
- `LINKEDIN_MAX_JOBS`
- `LINKEDIN_SEARCH_DELAY_MS`
- `LINKEDIN_DETAIL_DELAY_MS`
- `LINKEDIN_REQUIRE_LOCATION_MATCH=true|false`
- `LINKEDIN_KEYWORDS`
- `LINKEDIN_LOCATIONS`

Use `|` as the separator for keywords and locations.

## Container

Build:

```bash
docker build -f Dockerfile.linkedin-jobs -t linkedin-jobs-scraper .
```

Run:

```bash
docker run -d \
  --name linkedin-jobs-scraper \
  --restart unless-stopped \
  --env-file deploy/linkedin-jobs.env.example \
  linkedin-jobs-scraper
```

## n8n Setup

1. Create a new workflow.
2. Add a `Webhook` node.
3. Set method to `POST`.
4. Set path to `linkedin-jobs`.
5. Copy the production webhook URL.
6. Put that URL in `LINKEDIN_WEBHOOK_URL`.
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

9. Upsert by `source_record_key`.
10. Map at least these fields:
   - `platform`
   - `source_record_key`
   - `source_native_id`
   - `canonical_url`
   - `title`
   - `company`
   - `location_text`
   - `published_at`
   - `content`
   - `score`
   - `confidence`
   - `routing_action`
   - `parse_quality`
   - `validation_flags`
   - `raw_payload`
11. If new or changed, enqueue AI classification.
12. Activate the workflow.

## Notes

- This is more fragile than Reddit RSS because LinkedIn guest endpoints return HTML.
- No LinkedIn scraper can guarantee every single job forever.
- The closest practical setup is broad keywords, broad locations, frequent polling, and enough pages per query.
