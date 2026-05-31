# Security Notes

## Known advisories (assessed, intentionally deferred)

### fast-xml-parser < 5.7.0 — GHSA-gh4j-gqv2-49f6 (moderate)
- **Status:** Deferred — NOT a risk to the deployed product. Do not force-fix.
- **Where it lives:** Transitive dev dependency of the React Native CLI used to
  build the Fire TV app (`apps/firetv`):
  `react-native → @react-native-community/cli → … → fast-xml-parser`.
- **Why it does NOT affect production:**
  - The deployed backend (Vercel function) bundles only
    `api/index.ts → services/api → shared`. It never imports react-native, so
    `fast-xml-parser` is not in the deployed artifact.
  - The Roku channel is BrightScript and uses none of this.
  - The vulnerability is XML *injection in XMLBuilder* — only exploitable when
    building XML from untrusted input. The RN CLI uses it at build time on the
    developer's own project files; there is no untrusted-input path.
- **Why we are NOT auto-fixing it:**
  - The advisory requires `fast-xml-parser ≥ 5.7.0`, a MAJOR bump from the 4.x
    the RN CLI depends on. There is no in-range (non-breaking) patch.
  - `npm audit fix --force` would bump `react-native` to a new major (0.76+),
    a breaking change that risks the currently-clean typecheck and the future
    APK build. The fix is riskier than the issue.
- **How it resolves naturally:** When react-native is upgraded during the Fire TV
  native-scaffold phase, a newer CLI pulls a patched `fast-xml-parser`. Re-run
  `npm audit` then; it should clear without a forced override.
- **If you must silence it sooner** (only if a clean RN upgrade isn't imminent):
  add an npm `overrides` entry pinning `fast-xml-parser` to `^5.7.0` in the root
  `package.json`, then run `npm install` AND verify `react-native` CLI commands
  still work (not just typecheck) before committing. This is optional and lower
  priority than shipping.

## Secrets
- API keys live in `.env` (gitignored) locally and in Vercel env vars in prod.
  Never commit `.env`. Verified excluded from git history.
- The Amazon `AppstoreAuthenticationKey.pem` in `apps/firetv/assets/` is a
  PUBLIC key (safe to commit by design — see that folder's README).
