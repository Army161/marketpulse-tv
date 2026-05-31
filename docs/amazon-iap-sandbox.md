# Amazon IAP Sandbox Testing

## Sequencing — Amazon's recommended order

1. **Finish the core app build** (we're here through the JS/TS layer).
2. **Build the Fire TV APK** — requires native Android scaffold (`apps/firetv/android/`).
3. **Integrate Amazon Appstore SDK** + place `AppstoreAuthenticationKey.pem`
   in the app's native assets folder (see "PEM placement" below).
4. **Create IAP products** in Amazon Developer Console (see SKUs below).
5. **Test with Amazon App Tester** in sandbox mode (see Test Plan below).
6. **Add server-side receipt verification** via Amazon's RVS service
   (optional production hardening, uses the same PEM).

Sources:
- https://developer.amazon.com/docs/appstore-sdk/integrate-appstore-sdk.html
- https://developer.amazon.com/docs/in-app-purchasing/iap-create-and-submit-iap-items.html
- https://developer.amazon.com/docs/in-app-purchasing/rvs-cloud-sandbox.html

## PEM placement (Step 3)

Amazon's docs require `AppstoreAuthenticationKey.pem` at:

```
apps/firetv/android/app/src/main/assets/AppstoreAuthenticationKey.pem
```

The file is currently staged at `apps/firetv/assets/AppstoreAuthenticationKey.pem`
because the native Android folder doesn't exist yet — it will be created when
you run the React Native native-init step. **Move the PEM into the native
assets path at that time.**

The PEM is a public key — safe to commit to the repo.

## SKU Setup (Step 4)

Register the following SKUs in the Amazon Developer Console under your app's
In-App Purchasing tab:

| SKU | Type | Price |
|---|---|---|
| `marketpulse.premium.monthly` | Subscription (1 month) | $9.99 |
| `marketpulse.pro.monthly` | Subscription (1 month) | $14.99 |

Match the SKU strings exactly to the values in
[`apps/firetv/src/monetization/amazonIap.ts`](../apps/firetv/src/monetization/amazonIap.ts).

## Sandbox Setup (Step 5)

1. In Amazon Developer Console → App → IAP → Test, generate an `amazon.sdktester.json`.
2. `adb push amazon.sdktester.json /sdcard/`.
3. Install the **App Tester** APK on your Fire TV / device.
4. Launch App Tester and load the JSON.
5. Run the MarketPulse app — purchase calls are intercepted by App Tester.

## Test Plan

- [ ] Cold launch → entitlement defaults to `free`.
- [ ] Open Settings → tap **Upgrade** → Premium → confirm → entitlement updates to `premium / active`.
- [ ] Restart app → entitlement persists from cached receipt.
- [ ] Settings → **Restore** → entitlement re-syncs from `getPurchaseUpdates`.
- [ ] Upgrade Premium → Pro → entitlement updates to `pro / active`.
- [ ] Cancel subscription in App Tester → restore returns `free`.
- [ ] Premium-gated features (10s refresh, news feed) become available exactly when entitled.
- [ ] Pro-gated features (custom watchlist) become available only with `pro`.

## RVS Server Verification (Step 6, optional hardening)

Once purchases are flowing through App Tester, you can add backend verification
to prevent receipt forgery on rooted devices:

1. Build a `/api/iap/verify` endpoint in `services/api` that accepts
   `{ receiptId, userId, sku }` from the Fire TV app post-purchase.
2. The backend calls Amazon's RVS endpoint with this PEM as the verification key.
3. Only after RVS confirms the receipt is genuine, grant entitlement.
4. Test against RVS Cloud Sandbox before promoting to production:
   https://developer.amazon.com/docs/in-app-purchasing/rvs-cloud-sandbox.html
