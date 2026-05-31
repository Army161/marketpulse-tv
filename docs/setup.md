# MarketPulse TV — Local Setup

Get the full stack running in under 10 minutes.

## Prerequisites
- Node.js 20+
- npm 10+
- For Fire TV: Android Studio + React Native dev environment (only required to actually build the APK; the backend and shared package work standalone)
- For Roku: Roku device in Developer Mode (or RDE / Roku Simulator) — sideloading uses HTTP POST to your device's developer port

## Clone & install
```bash
git clone <your-repo>
cd marketpulse-tv
cp .env.example .env   # then fill in credentials (or leave empty for mock data)
npm install
```
npm workspaces installs the backend, the Fire TV app, and the shared package
in one pass.

## Run the backend
```bash
cd services/api
npm run dev
# → http://localhost:3000/api/health
```
Mock data is returned automatically whenever the relevant API credentials
are missing — `/api/stocks`, `/api/crypto`, `/api/news`, `/api/movers` are
all immediately useful.

## Run the Fire TV app
```bash
cd apps/firetv
npm run start:tv          # in one terminal — starts the Metro bundler
npm run android           # in another — installs to a Fire TV / emulator
```
The app reads `API_BASE_URL` from its build env. To point at a deployed
backend, set it at build time:
```bash
API_BASE_URL=https://your-vercel-url.vercel.app npm run android
```

## Run the Roku app
1. Zip `apps/roku/` so the `manifest` sits at the top of the archive.
2. Sideload via your Roku's developer UI at `http://<roku-ip>/`.
3. Open `apps/roku/source/Config.brs` and set `apiBaseUrl` to your backend URL.

## Common scripts
| Command | What it does |
|---|---|
| `npm run typecheck` | Type-checks every workspace |
| `npm run lint` | ESLints every workspace |
| `npm run test` | Runs each workspace's tests (placeholders for MVP) |
| `npm run dev:api` | Shorthand for the backend dev server |
| `npm run dev:firetv` | Shorthand for the Fire TV Metro bundler |
