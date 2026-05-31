# MarketPulse TV — Deployment

## Backend → Vercel

### Initial setup
1. `npm install -g vercel` (one-time on your dev machine).
2. From `services/api/`, run `vercel link` to associate the directory
   with a Vercel project.
3. In the Vercel dashboard, set the environment variables from
   `.env.example` (Settings → Environment Variables).

### Deploy
```bash
cd services/api
vercel deploy           # preview deployment
vercel --prod           # promote to production
```
`vercel.json` already routes every `/api/*` request to
`api/index.ts`, which wraps the Express app.

### Rollback
```bash
vercel rollback <deployment-url>
```

## Fire TV → Sideload

### Build the APK
```bash
cd apps/firetv
API_BASE_URL=https://your-vercel-url.vercel.app \
  ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

### Install on a Fire TV device
1. Fire TV → Settings → My Fire TV → Developer Options → enable ADB
   Debugging and Apps from Unknown Sources.
2. `adb connect <fire-tv-ip>:5555`
3. `adb install -r app-release.apk`
4. App appears under "Your Apps & Channels".

## Roku → Sideload (Dev Channel)

### Enable developer mode
On Roku: Home (3×), Up (2×), Right, Left, Right, Left, Right →
enable developer mode and set a webserver password.

### Sideload
```bash
cd apps/roku
zip -r marketpulse-roku.zip . -x "*.DS_Store"
curl -F "mysubmit=Install" -F "archive=@marketpulse-roku.zip" \
  --user rokudev:<your-password> --digest \
  http://<roku-ip>/plugin_install
```

### Promote to Roku Channel Store
- Sign up at https://developer.roku.com/.
- Submit through the Developer Dashboard → Manage My Channels.
- Use Private Channel for closed beta, Public for store listing.

## Environment Matrix
| Env | API URL | Build Tag |
|---|---|---|
| Local | `http://localhost:3000` | `dev` |
| Preview (Vercel) | `https://marketpulse-tv-<hash>.vercel.app` | `preview` |
| Production | `https://marketpulse-tv.vercel.app` (configurable) | `prod` |

The TV apps point at whichever URL is baked at build time via
`API_BASE_URL` (Fire TV) / `Config.brs#apiBaseUrl` (Roku).
