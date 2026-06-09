# GUARDRAILS.md — Hard rules for the browser agent (read first, obey always)

## NEVER do these without explicit human confirmation (HARD STOP)
- ❌ Click the final **Submit / Publish / "Make Channel Public" / "Send for
  Certification"** button. Fill everything up to it, screenshot, then STOP and hand
  back to the user.
- ❌ Enter, change, or confirm anything on **payment, banking, tax, or payout** pages.
- ❌ Change **account settings, password, email, 2FA, team members, or API keys.**
- ❌ Accept new **legal agreements / TOS** on the user's behalf — surface them and ask.
- ❌ **Delete** an existing channel or overwrite an unrelated one.
- ❌ Enter credentials / sign in. The user is already signed in.

## ALWAYS
- ✅ Confirm you're on the correct account/channel before uploading (screenshot the
  header / channel name).
- ✅ Use the **exact** values in `FIELDS.md` — no improvised marketing copy.
- ✅ Upload **only** `dist/MarketPulseTV-1.0.pkg` as the package.
- ✅ Screenshot before and after each consequential action (audit trail).
- ✅ If a page looks unfamiliar or a control is ambiguous, **stop and ask** rather than
  guess-clicking.
- ✅ Choose **Private / Beta** distribution, not Public.

## File upload nuance
- Do NOT click the upload button (opens a native OS picker the agent can't see).
- Use `find`/`read_page` to get the `<input type=file>` element `ref`, then
  `file_upload(paths=["...\\dist\\MarketPulseTV-1.0.pkg"], ref=..., tabId=...)`.
- ⚠️ If the Chrome extension cannot access the repo path (sandbox boundary), DO NOT
  fight it — tell the user to drag the `.pkg` into the upload control manually (one
  action), then continue with the listing fields.

## On error
- Read the on-page error text + `read_console_messages(onlyErrors=true)`.
- Re-screenshot, describe the blocker plainly, propose the fix, and ask before
  retrying anything that mutates state.

## Tone
Professional, concise, structured. Report milestones, not keystrokes.
