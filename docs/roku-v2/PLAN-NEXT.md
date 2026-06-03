# PLAN — Next Session

Pair with `HANDOFF.md` (full context) and `MEMORY.md` (durable facts).

---

## STEP 0 — Read these three docs first, in order
1. `HANDOFF.md` (project root) — full context + top-priority bug detail
2. `MEMORY.md` (project root) — quick-reference facts + creds locations
3. This file (`docs/roku-v2/PLAN-NEXT.md`)

Then `cd C:\Users\Armyg\marketpulse-tv-claude-code.zip` and verify state:

```bash
git status                              # working tree
git log --oneline -5                    # last 5 commits
cat apps/roku/manifest | grep version   # current build_version (00007 at handoff)
curl.exe -s -o /dev/null -w "%{http_code}\n" https://marketpulse-tv.vercel.app/api/health
curl.exe -s -o /dev/null -w "%{http_code}\n" "http://192.168.1.80:8060/query/device-info"   # Roku ECP
curl.exe -s -o /dev/null -w "%{http_code}\n" --user "rokudev:2789" --digest "http://192.168.1.80/"  # dev server (Roku must be ON)
```

---

## STEP 1 — FIX the section-nav empty-page bug (TOP PRIORITY)

### The bug (exact symptom from user testing on build 00007)
- Home page renders correctly on launch (gainers, losers, gauge, headlines, chyron OK).
- Pressing nav buttons (Crypto/Stocks/News/Calendar/Sentiment/Settings/Upgrade):
  - Sidebar highlight moves correctly between items.
  - SELECT registers.
  - Home content disappears.
  - **Target page renders EMPTY BLUE** — not even the static title Label
    ("CRYPTO • TOP 20") shows up. Header + chyron + sidebar still visible.
- **Pressing BACK or returning to Home does NOTHING.** User must exit and relaunch.

### Why the static title NOT showing matters
If the section title Label (which has no data dependency) doesn't render, the
page Group's `visible=true` never took effect → the bug is in the **section
router**, not the data layer.

### Diagnostic procedure (DO THIS FIRST, before code edits)

```bash
# Make sure Roku is on:
curl.exe -s --max-time 8 "http://192.168.1.80:8060/query/device-info" | grep power-mode

# Launch app:
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"
sleep 4

# Open BrightScript console (port 8085) and have user press a nav button DURING capture:
timeout 30 curl.exe -s "telnet://192.168.1.80:8085" 2>&1 | grep -iE "error|runtime|line [0-9]|\.brs\(|invalid|cannot|undefined" | head -40
```

Ask the user to press a nav button (e.g. Calendar) while the console captures.
The exact `.brs(line)` runtime error will reveal which node ref is invalid.

### Strong hypotheses (in priority order)

**H1: `callFunc` on an invalid node** — most likely
- `m.calendarList`, `m.newsPanel`, etc. could be `invalid` if a `findNode("id")`
  doesn't match a real `id` in `Dashboard.xml`. Calling `callFunc` on `invalid`
  is a fatal runtime error that aborts `onSectionChange` mid-execution.
- This is why even the static title Label doesn't render — the for-each visibility
  loop hadn't reached the target group yet (or got cleared by error propagation).

**H2: `setListFocus` is invalid as a function name on the target component**
- Some components only have `setData` exposed via `<interface>`. If
  `setListFocus` isn't declared in the component's `<interface>` block, calling
  it via `callFunc` returns invalid and may throw downstream.

**H3: A `rowsFocus` / `navFocus` setter on an `<interface>` field is missing
`alwaysNotify="true"`** for one of the new components (CalendarList,
NewsPanel-new). The v2.1 fix added it to AssetList/NavSidebar but the new
list components may have missed it.

### Fix plan (apply ALL, defensively, even if console only shows one cause)

In `apps/roku/components/Dashboard.brs`:

1. **Verify every findNode id matches Dashboard.xml.** Audit list:
   - `nav`, `ticker`, `gauge`, `status`, `clock`, `fngMini`, `liveDot`, `overlay`
   - `gainers`, `losers`, `teaser`
   - `cryptoList`, `stocksList`, `newsPanel`, `calendarList`
   - `gauge2`, `sentExplain`, `settingsRows`, `pricingCards`
   - All 7 page groups in `m.groups`

2. **Guard all `callFunc`s and field sets** with `<> invalid` checks:
   ```brightscript
   if m.calendarList <> invalid then m.calendarList.callFunc("setListFocus", true)
   ```

3. **Make the visibility loop bulletproof** in `onSectionChange`:
   ```brightscript
   sub onSectionChange()
       name = m.nav.selectedSection
       if name = invalid then return
       targetGroup = m.groups[name]
       if targetGroup = invalid then return  ' unknown section — bail safely

       ' hide all FIRST, then show target — order matters
       for each key in m.groups
           g = m.groups[key]
           if g <> invalid then g.visible = false
       end for
       targetGroup.visible = true

       m.currentSection = name
       ' ... then focus routing with invalid guards
   end sub
   ```

4. **Ensure `setListFocus` and the `rowsFocus`/`navFocus` fields exist on every
   list component**, with `alwaysNotify="true"` on the boolean fields. Audit:
   - `NavSidebar.xml` — has it (v2.1 fix). ✓
   - `AssetList.xml` — has it (v2.1 fix). ✓
   - `NewsPanel.xml` — needs verification (rewritten to MarkupList in v2.2; may
     have lost `setListFocus` if interface wasn't re-declared).
   - `CalendarList.xml` — NEW in v2.2; verify it exports `setListFocus`.

5. **Add a Home-restore safety**: when user presses BACK from a nested
   focus state, ensure we walk back to the sidebar AND show the Home group
   if currentSection ended up invalid:
   ```brightscript
   if key = "back" and m.overlayOpen
       ' close overlay
   else if key = "back" and m.inContent
       ' return focus to sidebar
       m.nav.navFocus = true
       m.inContent = false
       return true
   end if
   ```
   Also: when sidebar's `selectedSection` re-fires with "Home" (which it does
   because the field is `alwaysNotify`), the visibility loop should restore Home.

### Verify the fix
```bash
# Rebuild + sideload:
sed -i 's/build_version=00007/build_version=00008/' apps/roku/manifest
python3 scripts/package-roku.py
curl.exe -s -S --user "rokudev:2789" --digest -F "mysubmit=Replace" \
  -F "archive=@dist/marketpulse-roku.zip" "http://192.168.1.80/plugin_install"
curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"
sleep 4
timeout 16 curl.exe -s "telnet://192.168.1.80:8085" | grep -iE "error|fail|runtime" | head -10
```

**Then have the user test on the actual TV remote:**
- Home → Crypto → BACK → Home (Home data still there?)
- Home → Stocks → SELECT a row → BACK → BACK → Home
- Home → News (rich cards visible?)
- Home → Calendar (earnings rows visible?)
- Home → Sentiment → Home
- Home → Settings → Home
- Home → Upgrade → Home

The user reports "freezes" loudly; trust their hands-on test, not just console.

---

## STEP 2 — Polish pass (once nav works)

After the nav bug is fixed and user-verified:

- Confirm rich news cards still render (thumb + ticker chips).
- Confirm Calendar shows real earnings rows (date, ticker, est EPS).
- Confirm chyron still streams 40 assets cleanly.
- Confirm BrightScript console stays clean (no warnings).
- Commit: "Fix Roku section-nav empty pages + BACK restore (build 00008)"
- Push to `main`.

---

## STEP 3 — Then start the AI Anchor (user-requested next big feature)

This is the big one — user has Google Cloud TTS + HeyGen accounts ready.

### Phase 3a: AI Audio Anchor (Google TTS)
1. Backend new route `services/api/src/routes/brief.ts`:
   - Compose a 3-paragraph market brief script from live data:
     top movers + Fear&Greed reading + top 2 headlines.
   - Use Gemini (already wired in `adapters/newsAI.ts`) to write the script.
   - Pass script to Google Cloud TTS → MP3 → upload to Vercel Blob (public).
   - Return `{ audioUrl, scriptText, generatedAt }`.
2. Cache aggressively (30 min — TTS costs add up).
3. Roku: add a "▶ Daily Brief" selectable button on Home; use Roku `Audio` node
   to play the MP3.
4. Optional: small waveform/equalizer animation while playing.

### Phase 3b: HeyGen Avatar Anchor (true 4K)
1. Backend `/api/brief-video`: same script as 3a → POST to HeyGen API → returns
   video URL after generation (~30-90s).
2. Pre-generate on a schedule (every 30 min via Vercel Cron, since HeyGen has
   latency).
3. Roku: `Video` node renders the avatar full-screen as the "anchor segment".
   This is where TRUE 4K applies on Roku (video, not UI).

### Accounts/keys to wire (user provides)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (Google Cloud service account)
- `HEYGEN_API_KEY`
- `HEYGEN_AVATAR_ID` (which avatar to use)
- `VERCEL_BLOB_READ_WRITE_TOKEN` (for hosting the MP3 + video URLs)

### Specs (already in repo)
- `docs/roku-v2/PLAN.md` — original v2 design plan
- `docs/roku-v2/PLAN-v2.1-pages-glass.md` — multi-page + glassmorphism

---

## STEP 4 — Remaining roadmap (lower priority, do in order)

After the nav fix + AI anchor:

1. **More Benzinga features (same API key already works):**
   - Movers page (top gainers/losers from Benzinga signals)
   - Dividends calendar (already-tested adapter pattern)
   - Optional: quotes cross-reference for Stocks page

2. **Roku Store submission** (HUMAN-only work, see `docs/roku-submission/`):
   - Real branded icon art at correct dims (248×140, 290×218, 540×405).
   - `genkey` on device → Package → upload .pkg to Roku portal.
   - Privacy URL already live: https://marketpulse-tv.vercel.app/privacy

3. **Fire TV native scaffold** (separate platform, code complete in JS):
   - `npx @react-native-community/cli init` to generate `android/` folder.
   - Move staged PEM: `apps/firetv/assets/AppstoreAuthenticationKey.pem`
     → `apps/firetv/android/app/src/main/assets/`
   - Build APK, sideload to Fire TV.

---

## What NOT to do
- Don't fake "done" — always verify on device.
- Don't remove existing features. User said: ADD never subtract.
- Don't redesign the visual system — user said "bad as fuck" (which is good).
  The Midnight palette + gradient bg + glass focus stays.
- Don't trust BrighterScript validation as proof of working — it misses XML
  errors and runtime issues. Always sideload + check console + ask user.
- Don't `npm audit fix --force` — see `SECURITY.md` for why.

---

## Working style
- User is high-energy, direct ("HURRY UP", "MAKE IT HAPPEN") — match the
  intensity but stay honest about real limits.
- Reports visual results emotionally ("bad as fuck" = good, "looks like dog shit"
  = bad). Take both seriously.
- Commits to git often, pushes to GitHub `main`. Use the established commit
  message style (Co-Authored-By: Claude).
- Three collaborators (user, Claude Code, Cowork) share the repo. Follow
  `CONTRIBUTING.md`: `git pull --rebase` before, `git push` after.

## Files to ALWAYS check before claiming done
- `git status` — nothing accidentally staged
- `.env` is gitignored (it is — line 6)
- BrightScript console clean (`telnet 192.168.1.80 8085`)
- User confirms on the TV with their remote
