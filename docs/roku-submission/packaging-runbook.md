# Roku Packaging & Submission Runbook

Owner: 👤 — every step here is device-bound or portal-bound and cannot be done
from a shell/CI. Follow in order.

## Prerequisites
- Roku in **developer mode** (Home ×3, Up ×2, Right, Left, Right, Left, Right).
- Dev web console reachable at `http://<roku-ip>/` (you have 192.168.1.80, pwd 2789).
- The final build sideloaded (the current `dist/marketpulse-roku.zip`, build_version 00002).
- Branded artwork already dropped into `apps/roku/images/` and re-sideloaded
  (do the art BEFORE signing — see asset-checklist.md).

## Step 1 — Generate the signing key (device-bound, ONE TIME)
Roku signing keys are created **on the device** and are unique to it. Telnet to
the dev port and run genkey:
```
telnet <roku-ip> 8080
# at the prompt:
genkey
```
This prints a **dev-id** and a **password**. RECORD BOTH — you cannot recover
them, and re-running genkey invalidates the previous key (and any channel signed
with it). Store them in a password manager.

## Step 2 — Package the signed .pkg
1. In the dev web console (`http://<roku-ip>/`), go to the **Packager** tab.
2. Enter the **App Name** (e.g. `MarketPulseTV-1.0`) and the **password** from genkey.
3. Click **Package**.
4. Download the generated `.pkg` file. THIS is the signed artifact you upload.

> Note: the channel must be installed (sideloaded) on the device before
> packaging — the packager signs what's currently installed.

## Step 3 — Create the channel in the Roku portal (👤)
1. Sign in at https://developer.roku.com (create account if needed).
2. **Manage My Channels → Add Channel**.
3. Choose distribution type:
   - **Private (Beta) Channel** → instant install code, no public review.
     RECOMMENDED FIRST — lets you install permanently on any Roku via code.
   - **Public Channel** → full Roku certification review (7–14 days first time).

## Step 4 — Upload + fill metadata (👤)
- Upload the signed `.pkg` (Package tab).
- Upload channel poster art + ≥3 screenshots (see asset-checklist.md).
- Fill listing fields from `store-metadata.md`.
- Privacy Policy URL: **https://marketpulse-tv.vercel.app/privacy** (LIVE ✅).
- Answer the content-rating questionnaire (guidance in store-metadata.md).

## Step 5 — Submit (👤)
- **Private:** publish → you get an install code immediately. Enter it at
  https://my.roku.com → Add channel with a code. Installs permanently.
- **Public:** submit for certification → wait for Roku review → address feedback.

## Re-signing note
If you ever change the channel and want to update a published channel, you must
re-package with the **same** signing key (Step 2) — that's why preserving the
genkey output from Step 1 matters. A different key = Roku treats it as a
different channel.

## Current readiness
- ✅ Code clean, on-device validated, build_version bumped to 00002
- ✅ Privacy policy live at /privacy
- ❌ Branded artwork (blocks quality review)
- ❌ genkey / package (device-bound, not yet done)
- ❌ Roku developer account (not yet created)
