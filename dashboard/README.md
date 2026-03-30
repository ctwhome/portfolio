# Personal Signal Desk

Plain HTML, CSS, and JavaScript dashboard served by Bun.js with SQLite on the same box.

## What works now

- Housing data uses the official CBS/Kadaster table `85792ENG` and stores quarterly plus yearly history for Amsterdam, Rotterdam, and Utrecht.
- Interest topics can be added from the UI and immediately collect live articles from a query-based RSS feed.
- Subscriptions can be added from the UI, tracked over time, and archived.
- The server exposes JSON endpoints and supports optional HTTP Basic Auth.
- Data refresh can run on startup, on a timer, or manually with a button and a CLI command.

## Stack

- Bun.js server
- SQLite via `bun:sqlite`
- Tailwind CSS
- DaisyUI
- Vanilla JavaScript frontend in `public/`

## Commands

```bash
bun install
bun run build:css
bun run dev
```

Manual refresh:

```bash
bun run collect
```

## Environment variables

```bash
PORT=3000
DB_PATH=./dashboard.sqlite
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=change-me
HOUSING_REFRESH_MINUTES=720
TOPIC_REFRESH_MINUTES=60
TOPIC_ITEM_LIMIT=10
```

If `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` are omitted, the dashboard is public.

## Key files

- `server.ts`: HTTP server and route handling.
- `src/backend.ts`: schema, collectors, queries, refresh state, and CRUD logic.
- `scripts/collect.ts`: manual collector entrypoint for cron/systemd.
- `public/index.html`: dashboard shell.
- `public/assets/app.js`: frontend logic and API integration.

## VPS note

For a VPS deployment, run the Bun server under `systemd` or another process manager and trigger `bun run collect` from `cron` if you prefer refreshes outside the long-running web process.
