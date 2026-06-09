# RUNBOOK.md — Exact browser execution (Claude-in-Chrome)

Resilient by design: locate elements by **intent** (`find`/`read_page`), act on the
returned `ref`, and **verify with a screenshot** after each step. The Roku portal DOM
changes; never hard-code selectors/coordinates. Obey `GUARDRAILS.md` throughout.

## Pre-flight
1. `tabs_context_mcp` → get/confirm the working tab id. (A browser must already be
   selected for the session.)
2. Confirm signed in + correct account: `navigate` to
   `https://developer.roku.com/developer/channels` → screenshot. If a sign-in screen
   appears, STOP and ask the user to sign in (never enter credentials).

## Step 1 — Start a new Private channel
3. `find` "Add Channel button" → click its `ref` → screenshot.
4. Channel-type chooser: `find` "Developer SDK channel option" / "Beta or Private
   channel" → select it → continue. Screenshot. (If a type picker offers
   "Public/Certified" vs "Beta/Private", choose **Beta/Private**.)

## Step 2 — Channel details (from FIELDS.md)
5. `read_page(filter:"interactive")` to map the form inputs to refs.
6. For each field, set the value from `FIELDS.md` using `form_input(ref, value)`
   (preferred for inputs/selects) or click+type. Fields: Channel Name, Short
   Description, Long Description, Category, Keywords, Privacy Policy URL.
7. Screenshot the filled form. Re-read to confirm values stuck (idempotent: skip
   already-correct fields).

## Step 3 — Package upload (the .pkg)
8. Navigate to the **Package Upload** section/tab for this channel.
9. `find` "package file input" / `read_page` for `<input type=file>` → get its `ref`.
10. `file_upload(paths:["C:\\Users\\Armyg\\marketpulse-tv-claude-code.zip\\dist\\MarketPulseTV-1.0.pkg"], ref, tabId)`.
11. Screenshot. Confirm the portal shows the uploaded package (name/version/size).
    ⚠️ If `file_upload` errors on path access → per `GUARDRAILS.md`, ask the user to
    drag the file in manually, then continue.

## Step 4 — Remaining required fields
12. Some channels require ≥3 **screenshots**, a **channel poster/box art**, and a
    **content-rating questionnaire**. Use `FIELDS.md` § "Content rating" for answers.
    For images, prompt the user if assets aren't already attached to the session.
13. Save each section (the portal usually has per-section "Save"/"Continue" — those
    are safe; they're not the final publish). Screenshot after each save.

## Step 5 — HARD STOP
14. When the only remaining action is **Submit/Publish/Send-for-Certification**, DO
    NOT click it. Screenshot the final review page. Summarize for the user:
    - what's filled, what package is attached, what (if anything) is still required,
    - and the exact button they need to press to go live.
15. Hand control back to the user.

## Verification helpers
- `read_console_messages(onlyErrors=true, pattern="error|fail")` if a save seems to fail.
- `read_page(filter:"interactive")` to re-map refs after any navigation.
- Keep a milestone log: "✅ channel created · ✅ details filled · ✅ .pkg uploaded · ⏸ awaiting your Submit."
