# HANDOFF — Claude Cowork (engineer / ops / device)

> **You are Cowork**: filesystem + git + shell + the LAN Roku device (192.168.1.80) +
> CLI deploys. You own everything that touches **code, the device, and deploys**.
> The **browser/portal** work belongs to the Claude-in-Chrome agent — don't do that.
> Read `MEMORY.md`, `HANDOFF.md`, `docs/roku-v2/PLAN-NEXT.md` first to orient.

## Your capabilities vs. the other agent
| Do (Cowork) | Don't (that's Claude-in-Chrome) |
|---|---|
| edit repo, git, package, **sideload to 192.168.1.80**, read BrightScript console | upload to developer.roku.com / any web portal |
| bake images (PIL), tune `Theme.brs`, build | fill web listing forms, drive Canva web |
| deploy backend via `vercel` CLI | click web Submit/Publish |

## Absolute rules
- **Never run `genkey`** — irreversible, user-only (key already exists; password is in the owner's password manager, NOT the repo).
- **Never commit secrets**; `.env` is gitignored — keep it that way.
- **Verify on the actual TV before calling anything done** (console clean ≠ done).
- `git pull --rebase` before work, `git push` after. Three agents share this repo.
- Bump `apps/roku/manifest build_version` before EVERY sideload.

## CURRENT STATE (2026-06-09)
- `main` HEAD `aabdf97`+ : build 00011 (nav fix ✅ verified, card polish ✅ verified,
  `/api/brief` AI-anchor backend + Roku "▶ Daily Brief" button — **button NOT yet
  device-verified**).
- Signed store pkg exists: `dist/MarketPulseTV-1.0.pkg` *(build 00010)* — Claude-in-Chrome
  is submitting it. A v1.1 update pkg will be needed later (your job to re-cut).
- **`v1.1-design` branch**: cinematic redesign. A **stand-in dark bg** was baked to
  build 00012 and packaged but **NOT sideloaded** (Roku was offline). The real
  Midjourney assets are pending the owner dropping files into
  `docs/roku-v2/v1.1-design/concepts/`.
- `/api/brief` is **NOT deployed** to prod; TTS audio is **gated** (no creds yet).

## PLAN (phases, in order)
1. **Device-verify current build** (00011/00012) on the TV.
2. **v1.1 cinematic bake loop** once MJ files land → iterate until the owner loves it.
3. **Deploy `/api/brief`** so the Daily Brief button has data.
4. **Activate TTS** once the owner adds creds.
5. **Branch hygiene + security triage.**
6. **Re-cut the v1.1 store pkg** for Claude-in-Chrome to submit as an update.

## BUILD (how)
- Package: `python3 scripts/package-roku.py`
- Sideload: `curl.exe -s -S --user "rokudev:2789" --digest -F "mysubmit=Replace" -F "archive=@dist/marketpulse-roku.zip" "http://192.168.1.80/plugin_install"`
- Launch + console: `curl.exe -s -d "" "http://192.168.1.80:8060/launch/dev"` then `timeout 12 curl.exe -s "telnet://192.168.1.80:8085"`
- Bake bg: `python3 -c "from PIL import Image,ImageEnhance; im=Image.open('SRC').convert('RGB').resize((1920,1080),Image.LANCZOS); ImageEnhance.Brightness(im).enhance(0.82).save('apps/roku/images/bg_gradient_fhd.png')"` (Pillow is installed)
- Deploy backend: `export VERCEL_TOKEN="<owner provides>"; vercel.cmd --prod --yes`
- Node path: `export PATH="/c/Users/Armyg/AppData/Local/nvm/v24.11.1:/c/Users/Armyg/AppData/Roaming/npm:$PATH"`

## TASKS (ordered, specific)
1. **Power-gate:** confirm Roku reachable (`curl .../query/device-info` → power-mode). If offline, ask owner to power on.
2. **Sideload build 00012** (the stashed/committed v1.1 stand-in on `v1.1-design`) → launch → console clean → have owner walk all 8 sections + the **Daily Brief button** (RIGHT from sidebar focuses it, OK opens overlay, BACK closes) + judge the dark-bg readability. Log results.
3. **When `concepts/` has the real MJ files:** bake the chosen hero → `bg_gradient_fhd.png`; rebuild `glass_panel.9.png` region from the glass slab; optionally composite `glow_gold.png`; tune `Theme.brs` colors to match; bump manifest; package; sideload; iterate with owner. Then **commit final on `v1.1-design` + push.**
4. **Deploy `/api/brief`** (needs `VERCEL_TOKEN`): deploy, then `curl https://marketpulse-tv.vercel.app/api/brief` → expect 200 + `scriptText`, `audioUrl:null`.
5. **TTS activation** (after owner sets `GOOGLE_TTS_API_KEY` + `BLOB_READ_WRITE_TOKEN` in `.env` AND Vercel env): redeploy; confirm `audioUrl` populated; device-verify the Daily Brief audio plays.
6. **Branch hygiene:** `v1.1-design` is 1 commit behind `main` (`d93ac14`, docs). Merge/rebase `main` into `v1.1-design` so it has everything.
7. **Security:** investigate the 1 moderate Dependabot vuln — read `SECURITY.md`, identify the package, propose a **targeted** bump (NOT `npm audit fix --force`). Report before applying.
8. **Re-cut v1.1 store pkg** once v1.1 is owner-approved on TV: sideload the v1.1 build, then `plugin_package` with the **same genkey password** (owner provides) → hand the `.pkg` path to Claude-in-Chrome.

## TODO (checkboxes)
- [ ] Roku reachable confirmed
- [ ] Build 00012 sideloaded + console clean + owner walked 8 sections
- [ ] Daily Brief button verified (RIGHT→OK→overlay→BACK)
- [ ] Dark-bg readability judged by owner
- [ ] MJ files present in `concepts/` → real hero baked + sideloaded + approved
- [ ] Glass panel + glow + palette tuned to match
- [ ] Final v1.1 committed + pushed on `v1.1-design`
- [ ] `/api/brief` deployed to prod (200 + script)
- [ ] TTS creds set → `audioUrl` populated → audio verified on TV
- [ ] `v1.1-design` rebased on `main`
- [ ] Dependabot vuln triaged (targeted fix proposed)
- [ ] v1.1 store pkg re-cut + handed to Claude-in-Chrome

## Coordination
- Branches: submission/backend = `main`; cinematic design = `v1.1-design`.
- The owner is high-energy and verifies on the TV emotionally — trust their hands-on
  read over console output. ADD features, never remove. Don't redesign the data layout;
  this is a *visual* pass (bg, panels, palette).
- See also: `docs/roku-v2/v1.1-design/` (DESIGN/ASSETS/CAPABILITIES/MIDJOURNEY-PROMPTS),
  `API-KEYS.md`, `CONTRIBUTING.md`, `SECURITY.md`.
