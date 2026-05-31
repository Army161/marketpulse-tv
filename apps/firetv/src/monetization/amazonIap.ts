import { NativeModules } from 'react-native';
import type { Entitlement, SubscriptionTier } from '@marketpulse/shared';

/**
 * Thin wrapper around the Amazon In-App Purchasing v3 native bridge.
 *
 * The actual native module ships with the AmazonIAP Android library and must
 * be linked when building the Fire TV APK. We expose a typed JS surface here
 * and fall back to a "free" entitlement when the bridge isn't present (RN
 * Metro development, iOS simulator) so the UI keeps functioning end-to-end.
 *
 * SKU plan:
 *   marketpulse.premium.monthly  → $9.99/mo
 *   marketpulse.pro.monthly      → $14.99/mo
 */

const SKU: Record<Exclude<SubscriptionTier, 'free'>, string> = {
  premium: 'marketpulse.premium.monthly',
  pro: 'marketpulse.pro.monthly',
};

interface AmazonIapBridge {
  getUserData(): Promise<{ userId: string; marketplace: string }>;
  purchase(sku: string): Promise<{ sku: string; receiptId: string; expiresAt?: string }>;
  getPurchaseUpdates(reset: boolean): Promise<{ receipts: Array<{ sku: string; expiresAt?: string }> }>;
}

const bridge: AmazonIapBridge | undefined = (NativeModules as Record<string, AmazonIapBridge>).AmazonIAP;

const FREE_ENTITLEMENT: Entitlement = { tier: 'free', active: false, source: 'none' };
let cached: Entitlement = FREE_ENTITLEMENT;

export const amazonIap = {
  getCachedEntitlement(): Entitlement {
    return cached;
  },

  async purchase(tier: Exclude<SubscriptionTier, 'free'>): Promise<Entitlement> {
    if (!bridge) {
      console.warn('[amazonIap] bridge unavailable — granting dev entitlement');
      cached = { tier, active: true, source: 'amazon' };
      return cached;
    }
    const sku = SKU[tier];
    const receipt = await bridge.purchase(sku);
    cached = { tier, active: true, source: 'amazon', expiresAt: receipt.expiresAt };
    return cached;
  },

  async restore(): Promise<Entitlement> {
    if (!bridge) return cached;
    const { receipts } = await bridge.getPurchaseUpdates(true);
    const active = receipts
      .map(receiptToTier)
      .filter((e): e is Entitlement => e !== null)
      .sort((a, b) => tierRank(b.tier) - tierRank(a.tier))[0];
    cached = active ?? FREE_ENTITLEMENT;
    return cached;
  },
};

function receiptToTier(r: { sku: string; expiresAt?: string }): Entitlement | null {
  if (r.sku === SKU.pro) return { tier: 'pro', active: true, source: 'amazon', expiresAt: r.expiresAt };
  if (r.sku === SKU.premium) return { tier: 'premium', active: true, source: 'amazon', expiresAt: r.expiresAt };
  return null;
}

function tierRank(tier: SubscriptionTier): number {
  return tier === 'pro' ? 2 : tier === 'premium' ? 1 : 0;
}
