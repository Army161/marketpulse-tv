# Fire TV Build Assets

## `AppstoreAuthenticationKey.pem`

The Amazon Appstore SDK public key. **Per Amazon's official integration docs,
this file must live at**:

```
apps/firetv/android/app/src/main/assets/AppstoreAuthenticationKey.pem
```

It is currently staged here (`apps/firetv/assets/`) because the `android/`
native scaffolding has not been generated yet — the React Native project was
initialized at the JS/TypeScript layer only.

### When to move it

When you run the native init step:

```bash
cd apps/firetv
npx @react-native-community/cli init MarketPulseTV --skip-install
# or merge our JS code into a freshly-init'd RN project
```

…the `android/app/src/main/assets/` directory will be created. **At that
point, move this PEM into the native assets path.** The IAP SDK looks for
it there at runtime when initializing the in-app-purchasing flow.

### Why it's safe to commit

The file is a **public key**, not a secret. Public keys are designed to be
distributed — Amazon holds the corresponding private key on their servers
and uses it to sign IAP receipts. Anyone with the public key can *verify*
those signatures; nobody but Amazon can *create* them. So checking it into
the repo is fine and is what Amazon's docs recommend.

### Sources

- https://developer.amazon.com/docs/appstore-sdk/integrate-appstore-sdk.html
- https://developer.amazon.com/docs/vega/0.22/iap-production-mode.html
