# MarketPulse TV

> AI-powered financial market dashboard for Amazon Fire TV and Roku.

Live stock prices, real-time crypto data, and AI-summarized financial news,
designed for the lean-back big-screen experience. Built for high-income
investors and crypto holders who want their portfolio visible at a glance
without picking up their phone.

---

## Quick Start (under 10 minutes)

```bash
git clone <your-repo>
cd marketpulse-tv
cp .env.example .env             # fill in API keys, or leave empty for mock data
npm install
npm run dev:api                  # backend on http://localhost:3000
```

Then (in a separate terminal) build the Fire TV app:

```bash
npm run dev:firetv               # starts Metro bundler
cd apps/firetv && npm run android  # installs to a Fire TV / emulator
```

For full setup including Roku, see [docs/setup.md](docs/setup.md).

---

## Project Structure

| Folder | Purpose |
|---|---|
| [apps/firetv/](apps/firetv/) | React Native Fire TV app (TypeScript, Amazon Vega-ready) |
| [apps/roku/](apps/roku/) | BrightScript SceneGraph Roku channel |
| [services/api/](services/api/) | Express backend deployed on Vercel |
| [shared/](shared/) | Shared TypeScript types — single source of truth |
| [docs/](docs/) | Architecture, monetization, deployment, store-submission guides |

---

## Stack

- **Frontend (Fire TV)** — React Native 0.75, TypeScript, Amazon Vega SDK
- **Frontend (Roku)** — BrightScript, SceneGraph
- **Backend** — Node.js 20, Express, deployed on Vercel
- **Data** — Alpaca Markets (stocks), CoinGecko (crypto), NewsAPI (headlines)
- **AI** — OpenAI GPT-4o-mini or Gemini 2.5 Flash for news summarization
- **Billing** — Amazon IAP v3, Roku Billing
- **Ads (Roku free tier)** — Roku Advertising Framework (RAF)

---

## Documentation

- [Setup](docs/setup.md) — run the full stack locally in 10 minutes
- [Architecture](docs/architecture.md) — system diagram and design rationale
- [API Contracts](docs/api-contracts.md) — every backend endpoint with examples
- [TV UX Rules](docs/tv-ux-rules.md) — D-pad, focus, typography, color
- [Monetization](docs/monetization.md) — pricing, gates, IAP integration
- [Amazon IAP Sandbox](docs/amazon-iap-sandbox.md) — purchase test plan
- [Deployment](docs/deployment.md) — Vercel + Fire TV sideload + Roku channel
- [Store Submission](docs/store-submission.md) — Amazon Appstore and Roku Store checklists

---

## Scripts

```bash
npm run typecheck      # type-check every workspace
npm run lint           # lint every workspace
npm run test           # run every workspace's tests
npm run dev:api        # backend dev server
npm run dev:firetv     # Fire TV Metro bundler
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in what you have. Every adapter falls
back to realistic mock data when its credentials are missing, so the TV
apps render meaningful screens during local development and store-review
sandbox testing.

---

## Claude Code

This project was built with Claude Code Opus 4.7. To continue developing
with Claude Code:

1. Open this folder in Claude Code.
2. `CLAUDE.md` is auto-loaded — Claude has full project context.
3. See `PROMPTS.md` for ready-to-use build prompts (kept as a reference).
4. See `TASKS.md` for the canonical task list.
