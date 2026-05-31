import { useCallback, useState } from 'react';
import type { Entitlement, SubscriptionTier } from '@marketpulse/shared';
import { amazonIap } from './amazonIap';

/**
 * Single hook the UI uses for entitlement state. Wraps the Amazon IAP v3
 * native bridge in a typed React surface — call `purchase`, `restore`, or
 * read `entitlement` directly to gate premium features.
 */
export function usePurchase(): {
  entitlement: Entitlement;
  loading: boolean;
  purchase: (tier: SubscriptionTier) => Promise<void>;
  restore: () => Promise<void>;
} {
  const [entitlement, setEntitlement] = useState<Entitlement>(amazonIap.getCachedEntitlement());
  const [loading, setLoading] = useState(false);

  const purchase = useCallback(async (tier: SubscriptionTier) => {
    if (tier === 'free') return;
    setLoading(true);
    try {
      const result = await amazonIap.purchase(tier);
      setEntitlement(result);
    } finally {
      setLoading(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setLoading(true);
    try {
      const result = await amazonIap.restore();
      setEntitlement(result);
    } finally {
      setLoading(false);
    }
  }, []);

  return { entitlement, loading, purchase, restore };
}

export function isFeatureUnlocked(entitlement: Entitlement, requires: SubscriptionTier): boolean {
  if (!entitlement.active) return requires === 'free';
  if (requires === 'free') return true;
  if (requires === 'premium') return entitlement.tier === 'premium' || entitlement.tier === 'pro';
  if (requires === 'pro') return entitlement.tier === 'pro';
  return false;
}
