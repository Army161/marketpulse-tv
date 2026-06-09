# PLAN.md — Submission flow rationale

## Why this sequence
1. **Verify identity/account first** — uploading to the wrong account or while logged
   out is the only truly costly mistake. Screenshot-confirm before anything.
2. **Create channel → details → package → media/rating → review.** This matches the
   Roku portal's own wizard order, so the agent never backtracks.
3. **Package upload is the linchpin.** The `.pkg` is pre-signed (genkey) and frozen —
   it's just a file attach. If the sandbox can't reach the path, that's a 1-action
   human assist, not a blocker.
4. **Human owns the final Submit.** Private/Beta publish is low-stakes but still
   irreversible-ish (creates a live access code); per guardrails it's the user's click.

## Why Private/Beta (not Public)
- No Roku certification queue — instant, shareable via access code.
- Lets the owner test on real devices and **iterate** (e.g. ship the v1.1 cinematic
  design as an update to the SAME channel, same signing key).
- Public/Certified can come later from the same channel once v1.1 lands.

## Dependencies
- Artifact: `dist/MarketPulseTV-1.0.pkg` (exists).
- Auth: user signed into developer.roku.com (user-provided).
- Possibly: screenshots/poster art (ask user if portal requires).

## Relationship to v1.1
This submits **build 00010**. The cinematic **v1.1** (branch `v1.1-design`, for
Claude-design) will become an **update** to this same channel later — re-uses the same
genkey signing key (never re-run genkey). See `docs/roku-v2/v1.1-design/`.
