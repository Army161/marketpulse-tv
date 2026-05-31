# Roku Store Submission Prep — PLAN

## Objective
Take the on-device-validated Roku channel from "working dev sideload" to
"submittable to the Roku Channel Store (or publishable as a Private channel
with an install code)." This phase is **mostly assets, metadata, and the
packaging/signing flow** — not engineering. The app code is already clean.

## Current State (entering this phase)
- ✅ Channel sideload-installs and runs on real hardware
- ✅ All 4 panels render correct live production data
- ✅ Console is clean (0 warnings, 0 errors)
- ✅ `supports_input_launch` mismatch removed
- ✅ HTTPS hardened (peer + host verification)
- ❌ Icon art is dark-color placeholders (will fail quality review)
- ❌ No privacy policy hosted
- ❌ Channel not yet packaged/signed
- ❌ No Roku developer account / channel created in portal

## Owner Legend
- 🤖 = agent can produce in-repo
- 👤 = human-only (account, device-bound signing, design, portal clicks)

## Primary Goals
1. 🤖 Generate all store listing metadata + copy.
2. 🤖 Write a truthful privacy policy and wire it to be served from the backend.
3. 🤖 Produce the exact asset-spec sheet (dimensions, formats, counts).
4. 🤖 Write the packaging + signing runbook (genkey → Package → submit).
5. 👤 Create branded icon/poster art at correct dimensions.
6. 👤 Create the Roku developer account + channel entry.
7. 👤 Generate the signing key ON the device and package the signed .pkg.
8. 👤 Upload assets + metadata + .pkg in the partner portal and submit.

## Scope
- Roku only. No Fire TV, no backend feature work.
- Asset specs and metadata only — do NOT fabricate binary artwork
  (placeholder PNGs already exist and must be replaced by a designer).
- Privacy policy: factual, reflects the app's zero-PII reality.

## Success Criteria
- A complete, copy-paste-ready store metadata document exists in-repo.
- A hosted-ready privacy policy exists and a serving route is identified.
- An asset checklist with exact specs exists.
- A step-by-step signing/packaging runbook exists that a human can follow.
- Every remaining blocker is named with its owner (🤖/👤).

## Critical-Path Blocker (read this first)
Roku channel **signing is device-bound**. You must:
1. On the Roku (dev mode), telnet to port 8080 OR use the dev console to run
   `genkey` — this creates a signing key unique to that device.
2. Use that key to `Package` the channel into a signed `.pkg`.
3. That `.pkg` is what gets uploaded to the Roku portal.
This step CANNOT be automated from a shell or CI — it requires the physical
dev device. It is the gate between "working" and "submittable."

## Deliverables
- `docs/roku-submission/store-metadata.md` — listing fields + copy
- `docs/roku-submission/asset-checklist.md` — exact image specs
- `docs/roku-submission/packaging-runbook.md` — genkey/package/submit steps
- `docs/roku-submission/privacy-policy.md` — hostable policy text
- A decision: Public store listing vs Private channel (install code)
