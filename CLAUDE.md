# MarketPulse TV — Claude Code Project Memory

## Project
AI-powered financial market dashboard for **Amazon Fire TV** and **Roku**.
Target users: high-income investors and crypto holders (TV lean-back experience).

## Stack
- **Frontend:** React Native (TV), TypeScript, Amazon Vega SDK
- **Backend:** Node.js 20 + Express, TypeScript, deployed on Vercel
- **Data:** Alpaca Markets (stocks), CoinGecko (crypto)
- **AI:** OpenAI GPT-4o or Gemini 2.5 Flash (news summarization)
- **Billing:** Amazon IAP v3, Roku Billing API
- **Ads (Roku):** Roku Advertising Framework (RAF)

## Project Structure
```
marketpulse-tv/
├── apps/
│   ├── firetv/        # React Native TV app
│   └── roku/          # BrightScript SceneGraph app
├── services/
│   └── api/           # Node.js/Express Vercel backend
├── shared/            # Shared types and utils
├── docs/              # Architecture, setup, monetization docs
├── .claude/           # Claude Code rules, skills, hooks
├── .env.example
└── CLAUDE.md          ← YOU ARE HERE
```

## Commands
```bash
# Backend
cd services/api && npm install && npm run dev

# Fire TV
cd apps/firetv && npm install && npm run start:tv

# Type check all
npm run typecheck --workspaces

# Lint all
npm run lint --workspaces

# Test all
npm run test --workspaces
```

## Absolute Rules
- NEVER hardcode API keys or secrets — use process.env only
- NEVER commit .env files
- ALWAYS handle API failures with graceful fallback UI
- ALWAYS use TypeScript — no plain JS files
- ALWAYS keep components under 200 lines — split if larger
- NEVER skip error boundaries on screen-level components
- TV UI must be navigable by D-pad only — no touch assumptions

## Key References
- @docs/architecture.md
- @docs/monetization.md
- @docs/tv-ux-rules.md
- @docs/api-contracts.md
