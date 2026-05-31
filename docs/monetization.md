# MarketPulse TV — Monetization

## Revenue Model
| Platform | Free Tier | Premium | Pro |
|---|---|---|---|
| Fire TV | 60 s refresh, no news, no watchlist | $9.99/mo — 10 s refresh, AI news, watchlist | $14.99/mo — portfolio tracker, alerts, ad-free everywhere |
| Roku | Ad-supported via RAF | $9.99/mo — ad-free via Roku Billing | (Pro reserved for Fire TV in MVP) |

## Amazon Fire TV — In-App Purchasing v3

### Products
| SKU | Tier | Price |
|---|---|---|
| `marketpulse.premium.monthly` | Premium | $9.99 / 1 month |
| `marketpulse.pro.monthly` | Pro | $14.99 / 1 month |

Both are non-consumable subscriptions registered in the Amazon
Developer Console.

### Integration Points
- `apps/firetv/src/monetization/amazonIap.ts` — typed wrapper around the
  IAP v3 native bridge.
- `apps/firetv/src/monetization/usePurchase.ts` — React hook every
  screen uses to read entitlement and gate features.
- `apps/firetv/src/monetization/usePurchase.ts:isFeatureUnlocked` —
  pure helper for declarative gating.
- `apps/firetv/src/components/Paywall.tsx` — three-tier upgrade UI.
- `apps/firetv/src/screens/SettingsScreen.tsx` — entry point to the
  paywall and "Restore Purchase".

### Sandbox Testing
See `docs/amazon-iap-sandbox.md` for the App Tester setup and the
full test checklist.

## Roku — Roku Advertising Framework + Roku Billing

### Free tier (ad-supported)
- Ads are served only through the **Roku Advertising Framework (RAF)**.
- Third-party ad SDKs are not permitted by the Roku channel store.
- Roku splits ad revenue with the developer automatically — there is
  no separate ad-network integration.
- Implementation: `apps/roku/source/Raf.brs` (`ShowPreRoll`,
  `ShouldShowAds`).

### Premium tier
- Single SKU: `marketpulse_premium_monthly` ($9.99).
- Implementation: `apps/roku/source/Billing.brs`
  (`HasActiveSubscription`, `PurchasePremium`, `RestorePurchases`).
- Entitlement check should be performed at app launch and cached for
  the session.

## Gating Rules (single source of truth)
```
free       → 60 s refresh, no AI news screen, no watchlist, ads (Roku)
premium    → 10 s refresh, AI news, watchlist, ad-free
pro        → premium + portfolio tracker + custom alerts
```
Implemented in `isFeatureUnlocked()`. Every feature gate in the UI
should call this helper rather than checking `entitlement.tier`
directly so future tier changes only touch one file.
