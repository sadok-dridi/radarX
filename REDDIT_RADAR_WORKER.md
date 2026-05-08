# Reddit Radar Worker

This worker replaces the Reddit parts of `RadarX2.json` without using n8n RSS fetches.

It keeps the LinkedIn workflow unchanged.

## What It Replaces

- Subreddit Radar discovery
- Reddit Job Radar scanning
- Reddit source upserts into `sources`
- Reddit opportunity upserts into `opportunities`
- AI task enqueueing into `ai_tasks`

## How It Works

1. Discovers subreddits from Reddit JSON search when OAuth is configured, otherwise Reddit RSS search.
2. Scores discovered subreddits with the same keyword logic from the n8n workflow.
3. Upserts validated subreddit sources into Postgres.
4. Loads active Reddit sources from Postgres every scan cycle.
5. Fetches each subreddit via OAuth JSON when configured, otherwise `new/.rss`.
6. Normalizes posts to the existing opportunity shape.
7. Skips stale posts older than `REDDIT_MAX_POST_AGE_DAYS`.
8. Downgrades stale subreddit sources and archives inactive sources.
9. Applies the same unseen-post scoring and routing logic from `RadarX2.json`.
10. Inserts direct accepts into `opportunities`.
11. Inserts AI candidates into `opportunities` and enqueues `ai_tasks`.

## Run Locally

```bash
npm run worker:reddit-radar -- --mode once --task all --dryRun true
```

Use only discovery:

```bash
npm run worker:reddit-radar -- --mode once --task discover
```

Use only job scanning:

```bash
npm run worker:reddit-radar -- --mode once --task scan
```

Override scan sources during testing:

```bash
npm run worker:reddit-radar -- --mode once --task scan --subreddits "forhire|hiring" --dryRun true
```

## Environment

Use `deploy/reddit-radar.env.example` as the template.

Required:

- `DATABASE_URL`

Important optional values:

- `REDDIT_RADAR_RUN_MODE=once|loop`
- `REDDIT_RADAR_TASK=all|discover|scan`
- `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` for Reddit OAuth. Recommended on VPS hosts.
- `REDDIT_DISCOVERY_INTERVAL_HOURS`
- `REDDIT_SCAN_INTERVAL_MINUTES`
- `REDDIT_MAX_POST_AGE_DAYS`, default `14`
- `REDDIT_SOURCE_STALE_AFTER_DAYS`, default `30`
- `REDDIT_SOURCE_ARCHIVE_AFTER_DAYS`, default `90`
- `REDDIT_FETCH_DELAY_MS`
- `REDDIT_SUBREDDITS` for testing source overrides
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` for direct Telegram alerts

## Container

Build:

```bash
docker build -f Dockerfile.reddit-radar -t reddit-radar-worker .
```

Run:

```bash
docker run -d \
  --name reddit-radar-worker \
  --restart unless-stopped \
  --env-file deploy/reddit-radar.env \
  reddit-radar-worker
```

## Cutover

Disable only these n8n branches after the container is healthy:

- `Subreddit Radar`
- `Reddit Job Radar`

Keep the LinkedIn branch active.
