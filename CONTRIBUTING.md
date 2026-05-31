# Contributing to MarketPulse TV

This repo is worked on by **three collaborators**: the human owner, Claude Code,
and Claude Cowork. GitHub (`Army161/marketpulse-tv`, `main` branch) is the single
source of truth. These rules keep all three in sync without overwriting each other.

## The sync protocol (everyone follows this)

```bash
# BEFORE starting any work — pull the latest:
git pull --rebase

# AFTER finishing a chunk of work — commit and push:
git add -A
git commit -m "clear message of what changed"
git push
```

Whoever finishes a unit of work pushes it. Everyone else pulls before they start.
Rebase on pull (`--rebase`) keeps history linear and avoids noisy merge commits.

## First thing a new session should do

Read **`HANDOFF.md`** at the repo root. It captures the full current state,
what's done, what's next, and the critical gotchas. A fresh session that reads it
is as informed as the last one that worked here.

When you finish meaningful work, **update `HANDOFF.md`** and commit it. It is the
shared brain — keeping it current is how context survives across sessions.

## Never commit secrets

- `.env` is gitignored and must stay that way. API keys live in `.env` locally
  and in Vercel's env-var settings — never in the repo.
- Before your first commit in a session, sanity-check: `git status` must NOT
  list `.env`.

## Build / verify commands

```bash
npm install                      # install all workspace deps
npm run typecheck --workspaces   # type-check backend + Fire TV + shared
npm run dev:api                  # run backend locally (http://localhost:3000)
```

Roku packaging (manifest must sit at the zip root; excludes dev/tooling files):
```bash
python3 scripts/package-roku.py
```

## Don't regress these (hard-won lessons — see HANDOFF.md for detail)

1. Roku `roUrlTransfer` is MAIN|TASK-thread only — keep all Roku network I/O in
   the `DataFetcher` Task node. Never fetch on the render thread.
2. The Vercel serverless entry is root `api/index.ts` (imports `services/api`).
   Routes must serve inline data — no runtime `fs` reads (won't be in the bundle).
3. Local Node is via nvm; `node`/`vercel` may not be on the git-bash PATH.

## Branching (optional, for bigger changes)

For small fixes, committing to `main` is fine given the small team. For larger or
riskier work, branch (`git checkout -b feature/x`), push the branch, and open a PR
so the change is reviewable before it hits `main`.
