# API Keys & Providers — MarketPulse TV

This file documents WHICH providers are wired and WHERE keys live.
**No secret values here** — values are in `.env` (gitignored) and Vercel env vars.

---

## Backend providers (all in `services/api/src/config.ts`)

| Provider | Env var(s) | Status | Used for |
|---|---|---|---|
| **Alpaca Markets** | `ALPACA_API_KEY` + `ALPACA_SECRET_KEY` | ✅ Live | Stocks — top 20 tickers, live quotes |
| **CoinGecko** | `COINGECKO_API_KEY` | ✅ Live (demo tier) | Crypto — top 20 coins + sparklines |
| **Benzinga** | `BENZINGA_API_KEY` | ✅ Live | News (PRIMARY) + Earnings Calendar |
| **NewsAPI** | `NEWSAPI_KEY` | ✅ Wired | News FALLBACK only (dev-tier; Benzinga is primary) |
| **Gemini** | `GEMINI_API_KEY` | ✅ Live | AI news summarization fallback, model: `gemini-flash-latest` |
| **Alternative.me** | None (public, free) | ✅ Live | Fear & Greed sentiment (always available) |
| **OpenAI** | `OPENAI_API_KEY` | ⬜ Not set | Would be AI fallback before Gemini; not needed |

## Benzinga key format gotcha
Key starts with `bz.` (not `bz_.` — the underscore breaks auth, 401).
Value in `.env`: `BENZINGA_API_KEY=bz.R7FDMOH5473CMO2OCMNVHTOKP3XKPVSH`

## Future providers (Phase 3 — not yet wired)
| Provider | Purpose | User has account? |
|---|---|---|
| **Google Cloud TTS** | AI audio anchor (reads market brief aloud) | ✅ Yes |
| **HeyGen** | AI avatar video anchor (Phase 4) | ✅ Yes |
| **Vercel Blob** | Hosting MP3/video URLs from TTS/HeyGen | Needs setup |

## Alpaca base URL note
Alpaca paper trading keys work for data. The DATA endpoint (what we use) is:
`https://data.alpaca.markets` — NOT `https://paper-api.alpaca.markets/v2`.

## Benzinga available but not yet wired
Same `BENZINGA_API_KEY` also authenticates:
- `/api/v2.1/calendar/dividends` — Dividends calendar
- `/api/v1/quoteDelayed` — Delayed stock quotes (backup for Alpaca)
- Movers / signals endpoints

## Where keys are stored
- **Local dev:** `C:\Users\Armyg\marketpulse-tv-claude-code.zip\.env` (gitignored)
- **Production:** Vercel environment variables
  - Project: `prj_Qo0fBj4RMdeBkpH8gHZKIHCwTIxF`
  - Team: `team_jyck86vLRB9EjYteV05GheRR`
  - Set for: production + preview + development
- **To push new keys to Vercel:**
  ```bash
  export VERCEL_TOKEN="<token from chat history>"
  curl.exe -s -X POST "https://api.vercel.com/v10/projects/prj_Qo0fBj4RMdeBkpH8gHZKIHCwTIxF/env?upsert=true&teamId=team_jyck86vLRB9EjYteV05GheRR" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d '[{"key":"NEW_KEY","value":"value","type":"encrypted","target":["production","preview","development"]}]'
  ```
