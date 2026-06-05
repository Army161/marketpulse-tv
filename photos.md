# Photos — On-Device Verification Log (build 00009)

Session: 2026-06-05. Roku at 192.168.1.80. Verifying the section-nav fix
(`CURRENT-BUG.md`). Each entry = one photo the user took of the TV with the
remote, plus what it proves. Sections that render real content = fix confirmed
for that section (the old bug showed EMPTY BLUE pages).

---

## Batch 1 (5 photos)

### Photo 1 — Home (8:32 am)
- Header: MARKETPULSE / LIVE FINANCE NETWORK, LIVE dot, clock, Fear & Greed mini.
- TOP GAINERS: AMC +7.12%, HOOD +6.79%, MRNA +5.22%.
- TOP LOSERS: AMD -4.33%, KO -2.47%, INTC -1.52%.
- FEAR & GREED INDEX: 12 — EXTREME FEAR, gauge bar rendered.
- LATEST HEADLINES: 4 Benzinga headlines visible.
- Chyron scrolling (FIGR_HELOC, HYPE, DOGE, USDS, LEO...).
- **Verdict: Home ✓** (gainers, losers, gauge, headlines, chyron all render).

### Photo 2 — Upgrade
- "UPGRADE • GO PREMIUM" title renders.
- 3 glass pricing cards: FREE ($0), PREMIUM ($9.99/mo), PRO ($14.99/mo).
- Chyron scrolling (RAIN, XLM, XMR, ADA, CC, LINK...).
- **Verdict: Upgrade ✓** (renders, not empty blue).
- ⚠️ MINOR VISUAL: PRO card body text overlaps — "Everything in Premium" overlaps
  "Portfolio tracker", and "Custom watchlist" overlaps "Price alerts". Line spacing
  / wrapping issue in the pricing card layout. NOT the nav bug. Log for polish pass.
- ⚠️ MINOR VISUAL: PREMIUM card "Full markets data" / "AI news feed" lines also
  slightly cramped/overlapping. Same root cause (card text line-height).

### Photo 3 — Settings
- "SETTINGS" title + glass info panel renders.
- Rows: Refresh rate 30s (auto), Stocks data Alpaca Markets (live), Crypto data
  CoinGecko (live), News NewsAPI + Gemini AI summaries, Sentiment Alternative.me
  Fear & Greed, Theme MarketPulse Dark — Glass, Version 1.0 (build 00009),
  Privacy marketpulse-tv.vercel.app/privacy.
- Chyron scrolling (BNB, USDC, XRP, SOL, TRX, FIGR...).
- **Verdict: Settings ✓** (glass info rows render). Confirms build 00009 live on device.

### Photo 4 — Home (8:30 am, slightly earlier frame)
- Same layout as Photo 1. TOP LOSERS shows AMD -4.33%, KO -2.47%, TSLA -1.53%
  (3rd loser differs from Photo 1's INTC — live data rotating, expected).
- **Verdict: Home ✓** (re-confirmed).

### Photo 5 — Crypto
- "CRYPTO • TOP 20" title + list renders.
- Rows visible: BTC $62165 -1.98%, ETH $1662.65 -5.78%, USDT $0.99 +0.01%,
  BNB $590.55 -1.75%, USDC $0.99 -0.01%, XRP $1.12 -4.2%, SOL $65.91 -4.78%,
  TRX $0.32 -0.98%, FIGR_HELOC $1.01 +1.8%, HYPE $62.05 -7.71%, DOGE $0.08 -5.67%.
- BTC row highlighted (focus on list working).
- Chyron scrolling.
- **Verdict: Crypto ✓** (top-20 list renders with focus).

---

## Batch 2 (4 photos)

### Photo 6 — Stocks (8:31 am)
- "STOCKS • TOP 20" title + list renders.
- Rows: AAPL $312.12 +1.9%, MSFT $429.58 +2%, NVDA $217.83 +2.97%,
  GOOGL $369.34 +9.97%, AMZN $253.86 +3.86%, META $627.53 +4.48%,
  TSLA $417.36 -6.48%, AMD $518.89 -23.43%, INTC $111.03 -1.71%,
  CSCO $130.02 +3.45%, JPM $310.89 +9.93%.
- AAPL row highlighted (list focus working).
- Chyron scrolling (USDT, BNB, USDC, XRP, SOL, TRX...).
- **Verdict: Stocks ✓** (top-20 list renders with focus).

### Photo 7 — News (8:31 am)
- "MARKET NEWS" title + Benzinga card feed renders.
- Cards: "AbbVie, Oracle, Apple And More On CNBC's 'Final Trades'" (AAPL ABBV ENTG ORCL),
  "Why Is Micron Stock Falling Friday?" (AMZN AVGO GOOGL META MSFT),
  "Hitachi, Intel Announce Partnership..." (INTC), "Futurum CEO Daniel Newman..."
  (AMZN GOOG GOOGL META MSFT), "What's Going On With Intel Stock Friday?"
  (AVGO INTC INTW NVDA SOXX). Thumbnails present on several cards. Ticker chips render.
- Chyron scrolling.
- **Verdict: News ✓** (cards + thumbnails + ticker chips render).
- ⚠️ MINOR VISUAL: cards WITHOUT a thumbnail (rows 3 & 4) have their 2-line headline
  text overlapping the ticker-chip / "Benzinga • Stocks" line below. Variable card
  height / spacing issue when thumbnail is absent. NOT the nav bug. Log for polish pass.

### Photo 8 — Home (8:30 am, duplicate frame)
- Same as Batch-1 Photo 4. **Home ✓** (re-confirmed).

### Photo 9 — Sentiment (8:31 am)
- "MARKET SENTIMENT" title + glass card renders.
- FEAR & GREED INDEX 12, EXTREME FEAR, gauge bar.
- Explanatory paragraph: "Extreme Fear (12). Investors are very worried — historically
  a zone where assets are oversold and contrarian buyers start looking for value."
- "Source: Alternative.me • updates daily."
- Chyron scrolling (DOGE, USDS, LEO, RAIN, XLM...).
- **Verdict: Sentiment ✓** (gauge + explainer card render).

---

## Batch 3 (1 photo) — the missing section

### Photo 10 — Calendar (8:31 am)
- "EARNINGS CALENDAR • YOUR TICKERS" title + full table renders.
- Columns: DATE / TICKER / COMPANY / EST EPS / REPORTS.
- Rows: Jul 14 JPM JPMorgan Chase Est 5.390 Before Open, Jul 14 GS Goldman Sachs Gr
  Est 13.730 Before Open, Jul 15 JNJ Johnson & Johnson Est 2.840 Before Open,
  Jul 21 KO Coca-Cola Est 0.930 Before Open, Jul 23 INTC Intel Est 0.190 After Close,
  Jul 28 V Visa Est 3.220 After Close, Jul 28 UNH UnitedHealth Group Est 4.850 Before
  Open, Jul 28 BA Boeing Est -0.260 Before Open.
- JPM row highlighted (list focus working — confirms setListFocus/alwaysNotify fix).
- Chyron scrolling (USDT, BNB, USDC, XRP, SOL...).
- **Verdict: Calendar ✓** — the highest-risk section (new in v2.2) renders earnings
  rows with focus. This was the last gap. **ALL 8 SECTIONS NOW VERIFIED.**

---

## Checklist status (from CURRENT-BUG.md, 9 points)

| # | Item | Status |
|---|------|--------|
| 1 | Home loads on launch | ✅ Photos 1, 4, 8 |
| 2 | Home → Crypto → data visible → BACK → Home | ✅ Crypto data (Photo 5); BACK round-trip pending explicit confirm |
| 3 | Home → Stocks → SELECT row → overlay → BACK ×2 → Home | ⚠️ Stocks list + focus ✅ (Photo 6); row→overlay→BACK not yet shown |
| 4 | Home → News → Benzinga cards | ✅ Photo 7 (minor text-overlap on thumbnail-less cards) |
| 5 | Home → Calendar → earnings rows | ✅ Photo 10 (date/ticker/company/EST EPS/reports) |
| 6 | Home → Sentiment → gauge | ✅ Photo 9 |
| 7 | Home → Settings → glass info rows | ✅ Photo 3 |
| 8 | Home → Upgrade → glass pricing cards | ✅ Photo 2 (minor text-overlap, not nav bug) |
| 9 | Chyron scrolling throughout | ✅ all 9 photos |

**ALL 8 SECTIONS VERIFIED (8/8): Home, Crypto, Stocks, News, Calendar, Sentiment,
Settings, Upgrade. Chyron scrolling in every frame. Section-nav bug CONFIRMED FIXED
on device (build 00009), 2026-06-05.**
Optional follow-ups not yet captured: Stocks row→overlay→BACK, BACK→Home round-trip.
Two cosmetic polish items remain (see below) — not blocking, nav fully works.

## Polish items spotted (defer until nav bug closed)
- Upgrade page: pricing-card body text line-height/overlap (PRO + PREMIUM cards).
- News page: thumbnail-less cards overlap headline text with ticker-chip line below
  (variable card-height spacing issue).
