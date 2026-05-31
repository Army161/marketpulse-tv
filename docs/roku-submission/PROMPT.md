# Roku Store Submission Prep — PROMPT

Paste this to start the next session.

---

Your job is the Roku store-submission prep phase for MarketPulse TV. Stay
tightly scoped to Roku submission readiness.

Live production backend: https://marketpulse-tv.vercel.app
Roku app: apps/roku/ (clean console, on-device validated, sideload-tested)

Read these first, then execute without drifting:
- docs/roku-submission/PLAN.md
- docs/roku-submission/BUILD.md

Your objectives (in-repo, agent-doable):
1. Write docs/roku-submission/store-metadata.md — listing name, short +
   long descriptions, category, keywords, content-rating answers.
2. Write docs/roku-submission/privacy-policy.md — factual zero-PII policy
   (the app has no auth/accounts/PII per SPEC MVP exclusions).
3. Add a backend route serving the privacy policy at /privacy (plain HTML
   or markdown-rendered), wire into services/api, redeploy guidance.
4. Write docs/roku-submission/asset-checklist.md — every required image with
   exact pixel dimensions and format. Correct the wrong icon dims in the
   existing docs/store-submission.md.
5. Write docs/roku-submission/packaging-runbook.md — the device-bound
   genkey → Package → download .pkg → portal-submit steps.
6. Bump apps/roku/manifest build_version for the submission build.

Hard rules:
- Roku only. No Fire TV, no backend feature work beyond the /privacy route.
- DO NOT fabricate binary artwork. Placeholder PNGs exist; a human/designer
  must replace them. Produce SPECS, not fake images.
- DO NOT claim you can create the Roku account, sign the channel, or click
  through the portal — those are human-only. Mark them 👤.
- Keep the privacy policy truthful to the app's actual (zero) data collection.
- If a step is device-bound or account-bound, stop and hand it to the human
  with exact instructions.

Validation:
- /privacy route returns the policy when the backend runs.
- manifest build_version bumped.
- Every remaining blocker named with owner (🤖/👤).

Report format:
STATUS:
- Current step:
- Result:
- Files changed:
- Validation:
- Blocker:
- Next action (human handoff items):
