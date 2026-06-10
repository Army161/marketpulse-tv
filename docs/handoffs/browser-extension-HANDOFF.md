# HANDOFF — Claude-in-Chrome (web automation)

> **You are the browser agent**: you drive web UIs the owner is logged into. You own the
> **Roku developer portal submission** and any other **web-portal** work. You do NOT
> touch the repo code, the device, or deploys — that's the Cowork agent.
> A detailed, battle-tested runbook already exists: **`docs/roku-submission/portal-upload/`**
> (HANDOFF, RUNBOOK, FIELDS, GUARDRAILS, TASKS, TODOLIST, PLAN, BUILD) — use it.

## Your capabilities vs. the other agent
| Do (Claude-in-Chrome) | Don't (that's Cowork) |
|---|---|
| navigate/click/fill on developer.roku.com, Vercel dashboard, Canva web | edit repo, git, sideload, deploy CLI |
| upload the `.pkg`, fill listing fields, screenshot each step | bake images, package, run shell |
| pause for the owner on secrets / final Submit | run `genkey`, type API keys/passwords |

## Absolute rules (GUARDRAILS — read `portal-upload/GUARDRAILS.md` too)
- **HARD STOP before any final Submit / Publish / "Send for Certification".** Fill
  everything up to it, screenshot the review page, hand the click to the owner.
- **NEVER enter credentials or secret values** (passwords, API keys, tokens). If a field
  needs a secret, navigate to it and **let the owner type it**.
- **NEVER** touch payment/banking/tax pages, account settings, or accept legal terms on
  the owner's behalf — surface and ask.
- Choose **Private / Beta** distribution, not Public.
- Observe → act on a `ref` (find/read_page) → **screenshot to verify** each step. Don't
  pixel-guess when a ref exists. Don't batch across an irreversible action.
- The owner must be signed in already — never sign in for them.

## CURRENT STATE (2026-06-09)
- Signed store package is built & ready: **`dist/MarketPulseTV-1.0.pkg`** (build 00010,
  "Roku Channel Pak", genkey-signed). This is the file to submit.
- Listing copy is finalized in **`docs/roku-submission/portal-upload/FIELDS.md`**.
- A v1.1 cinematic redesign is in progress (Cowork) — a v1.1 update pkg will come later;
  for now submit 00010.

## PLAN
1. **PRIMARY — Roku Store submission** (Private/Beta). This is the main job.
2. *(Optional, only if owner asks)* Vercel env-var setup via web (owner types secrets).
3. *(Optional, only if owner asks)* Canva web — store screenshots / poster / finish hero.

## BUILD (inputs you need)
- Package file: `dist\MarketPulseTV-1.0.pkg` (owner may need to drag it into the upload
  control if the file input can't reach the path — see GUARDRAILS "File upload nuance").
- Field values: `portal-upload/FIELDS.md` (channel name, descriptions, category,
  keywords, privacy URL, content-rating answers).
- Portal URL: `https://developer.roku.com/developer/channels` (owner signed in).

## TASKS (ordered)
1. Confirm a browser/tab is selected and you're on developer.roku.com, **signed in,
   correct account** (screenshot). If a sign-in screen appears → STOP, ask owner.
2. Add Channel → **Developer/SDK** type → **Private/Beta** distribution.
3. Fill channel details from `FIELDS.md`; verify each value saved (idempotent — skip
   already-correct fields).
4. Upload `dist\MarketPulseTV-1.0.pkg` via the file input `ref` (`file_upload`); confirm
   the portal shows the uploaded build. If path access fails → ask owner to drag it in.
5. Complete content-rating questionnaire (FIELDS.md answers); add poster/screenshots if
   required (ask owner for images if not provided). Save each section.
6. **HARD STOP at Submit/Publish** → screenshot the review page → summarize what's filled
   and the exact button the owner must press → hand back.

## TODO (checkboxes)
- [ ] Correct account confirmed (screenshot)
- [ ] Channel created: Developer/SDK + Private/Beta
- [ ] Name / Short desc / Long desc / Category / Keywords / Privacy URL / Support email
- [ ] `.pkg` uploaded, build shown
- [ ] Content rating completed
- [ ] Poster + screenshots (if required)
- [ ] Each section saved
- [ ] ⏸ Stopped at Submit; review screenshot captured; handed to owner
- [ ] (OWNER) clicks Submit/Publish

## Coordination
- The store build is **00010**, not the latest `main` HEAD (00011/00012) — the new Daily
  Brief button isn't device-verified yet, so 00010 is the clean submission. Cowork will
  hand you a v1.1 update `.pkg` later for a follow-up submission.
- Full step detail + resilient selectors strategy: `docs/roku-submission/portal-upload/RUNBOOK.md`.
