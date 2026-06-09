# HANDOFF.md — Roku Portal Submission via Claude-in-Chrome

> **Mission:** upload the signed MarketPulse TV package to the Roku developer portal
> and fill the channel listing, **as a Private/Beta channel**, fast and accurately —
> stopping before any irreversible Submit/Publish/payment action for human confirm.

## The artifact (already built — do NOT rebuild)
- **Signed package:** `C:\Users\Armyg\marketpulse-tv-claude-code.zip\dist\MarketPulseTV-1.0.pkg`
  (267 KB, valid "Roku Channel Pak", build 00010, signed with the device genkey).
- Backup/source artifact for re-cut if ever needed: `dist/marketpulse-roku-00010-STORE.zip`.

## Account / destination
- Portal: **https://developer.roku.com/developer/channels** (sign in first at
  `https://developer.roku.com/`). The USER is already signed in — never enter
  credentials.
- Channel type: **Developer/SDK channel** (genkey-signed .pkg), distribution
  **Private (Beta)**.

## Read order for the executing agent
1. `GUARDRAILS.md` — the hard stops. **Read first, obey always.**
2. `RUNBOOK.md` — exact step-by-step browser execution with verification at each step.
3. `FIELDS.md` — the exact copy-paste listing values.
4. `TASKS.md` / `TODOLIST.md` — granular checklist + quick checkboxes.
5. `PLAN.md` — phase rationale. `BUILD.md` — where the .pkg came from / re-cut.

## Success criteria
- The `.pkg` is uploaded to a Private/Beta channel draft.
- All listing fields populated from `FIELDS.md`.
- Screenshots captured at each milestone for the audit trail.
- Execution **PAUSES at the final Submit/Publish** and hands control to the user with
  a clear summary of what's filled and what remains.

## Principles for the executing agent (speed + accuracy + consistency)
- **Observe before acting:** `read_page`/`find` to locate elements by intent, then act
  on the returned `ref`. Don't guess pixel coordinates when a ref exists.
- **Verify after acting:** screenshot or re-read after each consequential step; confirm
  the expected state before moving on.
- **Batch predictable steps** with `browser_batch`, but never batch across an
  irreversible action.
- **One source of truth for field values:** `FIELDS.md`. Do not improvise copy.
- **Idempotent:** if a field is already filled correctly, skip it. Don't duplicate.
- **Professional + structured:** narrate each milestone briefly; keep a running todo.
