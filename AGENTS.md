# AGENTS.md

## Layout

- `frontend/` — static SPA: plain vanilla JS/HTML/CSS. No bundler, no build step. Served by any static file server.
- `backend/` — Bun + Hono + TypeScript API proxy for the Instagram Graph API. Entrypoint `backend/index.ts`.
- No test, lint, or typecheck pipeline exists (no CI, no scripts in `backend/package.json`). Verification is manual in the browser.

## Commands

```bash
bun install --cwd backend
cp .env.example .env          # fill INSTA_TOKEN
bun run backend/index.ts      # runs from repo ROOT, serves on :3000
python3 -m http.server 8080 -d frontend/   # or: bunx serve frontend/ --port 8080
docker compose up -d --build  # or run the whole stack in containers (see Gotchas)
```

Backend must be started from the repo root, not from `backend/`: it reads/writes the cache at `./backend/instagram-data.json`, so running it from `backend/` breaks that path.

## Gotchas

- On startup the backend reads `INSTA_TOKEN` once into memory (`Bun.env` doesn't hot-reload); changing `.env` requires a server restart.
- When the token is ~50 days old the server auto-refreshes it and **rewrites `.env` in place**, appending/updating `INSTA_TOKEN_LAST_REFRESH`. Keep `.env` out of git (Docker bind-mounts it, so the refresh still updates the host copy).
- Instagram media is cached per-day in `backend/instagram-data.json` — it's gitignored and regenerable, so ignore its churn. Locally the backend rewrites it each run; under Docker it's ephemeral (no bind mount).
- In Docker, the frontend fetches the meetups gallery from the relative `/instagram` and nginx (`frontend/nginx.conf`) reverse-proxies it to the `backend` service — the backend port is NOT published to the host. If the backend is down, the gallery silently falls back to `BACKUP_MEDIA` images in `frontend/img/meetups/` — a "broken" gallery is usually the fallback, not a bug.
- Inline `onclick` handlers in `index.html` call functions by name; new interactive functions must be added to the `window.*` exports block at the bottom of `scripts.js`.
- `scripts.js` contains two identical `initEventListeners` definitions — duplication is pre-existing; don't try to "fix" one of them into a bug.

## Conventions

- UI text, comments, and docs are written in Spanish — keep new content in Spanish.
- Animated terminal messages in the hero live in `frontend/terminal-messages.json`; editing them never requires touching code.
