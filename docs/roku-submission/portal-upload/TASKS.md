# TASKS.md — Ordered tasks (portal submission)

1. **Pre-flight**
   - Confirm a browser is selected for the session (`tabs_context_mcp`).
   - Open `https://developer.roku.com/developer/channels`; confirm signed in + correct
     account (screenshot). If not signed in → STOP, ask user.
2. **Create channel**
   - Add Channel → choose **Developer/SDK** + **Private/Beta** distribution.
3. **Fill channel details** (from `FIELDS.md`)
   - Channel Name, Short Description, Long Description, Category, Keywords,
     Privacy Policy URL, Support email.
   - Verify each value saved.
4. **Upload package**
   - Locate the file input `ref`; `file_upload` `dist/MarketPulseTV-1.0.pkg`.
   - Confirm portal shows the uploaded package (build 00010).
   - Fallback: ask user to drag the file if sandbox blocks the path.
5. **Required media / rating**
   - Add poster + screenshots if required; complete content-rating questionnaire
     (`FIELDS.md` answers).
   - Save each section.
6. **HARD STOP at Submit/Publish**
   - Screenshot the final review; summarize state; hand the Submit click to the user.
7. **Report**
   - Milestone log + what remains + the exact button to press to go live.

## Definition of done (agent's part)
Draft channel exists, all fields + package + rating filled, screenshots captured,
paused at the final human-only Submit. No irreversible/account/payment action taken.
