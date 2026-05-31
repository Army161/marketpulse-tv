# Roku Store Submission Prep — BUILD (Task List)

Owner legend: 🤖 agent can do in-repo · 👤 human-only

## Phase A — In-repo deliverables (🤖, do first)
- [ ] 🤖 Write `store-metadata.md` (name, descriptions, category, keywords, rating answers)
- [ ] 🤖 Write `asset-checklist.md` (every required image + exact px + format)
- [ ] 🤖 Write `privacy-policy.md` (zero-PII factual policy)
- [ ] 🤖 Add a backend route to serve the privacy policy (e.g. `/privacy`)
- [ ] 🤖 Write `packaging-runbook.md` (genkey → Package → portal submit)
- [ ] 🤖 Correct `docs/store-submission.md` icon-dimension table (currently wrong)
- [ ] 🤖 Bump `manifest` build_version for the submission build

## Phase B — Assets (👤, needs a designer/tool)
- [ ] 👤 Channel icon focus SD: 248×140 PNG (branded, not placeholder)
- [ ] 👤 Channel icon focus HD: 290×218 PNG
- [ ] 👤 Channel icon focus FHD: 540×405 PNG
- [ ] 👤 Channel poster / splash already correct (720×480 / 1280×720 / 1920×1080) — re-skin if desired
- [ ] 👤 Screenshots: ≥3 at 1920×1080 (the on-device photos can be cropped/cleaned, or use ECP screenshot)
- [ ] 👤 Replace placeholder PNGs in `apps/roku/images/` with branded versions (same filenames)

## Phase C — Account + hosting (👤)
- [ ] 👤 Create Roku developer account at https://developer.roku.com
- [ ] 👤 Deploy backend so `/privacy` is publicly reachable (already on Vercel — just add route + redeploy)
- [ ] 👤 Confirm privacy policy URL resolves publicly

## Phase D — Signing + packaging (👤, device-bound — CRITICAL PATH)
- [ ] 👤 Ensure Roku is in dev mode with the dev app installed
- [ ] 👤 Generate signing key on device (`genkey`) — capture the dev password + key
- [ ] 👤 Re-sideload the final build, then `Package` it into a signed `.pkg`
- [ ] 👤 Download the `.pkg` from the device's dev console

## Phase E — Portal submission (👤)
- [ ] 👤 Create the channel entry in the Roku portal
- [ ] 👤 Choose Public (store-listed, full review) vs Private (instant install code)
- [ ] 👤 Upload `.pkg`, icon art, poster, screenshots
- [ ] 👤 Fill metadata from `store-metadata.md`
- [ ] 👤 Paste privacy policy URL
- [ ] 👤 Answer content-rating questionnaire (guidance in `store-metadata.md`)
- [ ] 👤 Submit

## Validation
- [ ] 🤖 Confirm `/privacy` route returns the policy text
- [ ] 🤖 Confirm manifest build_version bumped
- [ ] 👤 Confirm signed `.pkg` installs cleanly on a second test Roku (Private channel code)
- [ ] 👤 Confirm Roku review feedback addressed (if Public)

## Decision Point (answer before Phase E)
**Public store listing** = discoverable, full Roku certification review (7–14 days first time),
needs all assets + rating + policy polished.
**Private channel** = instant install code, no public review, perfect for beta/personal use,
same packaging but lighter scrutiny. Recommended first step: **Private**, then promote to
Public once the art is final.
