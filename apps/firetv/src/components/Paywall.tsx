import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SubscriptionTier } from '@marketpulse/shared';
import { theme } from '../theme/theme';
import { FocusableCard } from './FocusableCard';

interface Props {
  onSelect: (tier: SubscriptionTier) => void;
  onRestore: () => void;
}

interface TierDef {
  tier: SubscriptionTier;
  title: string;
  price: string;
  features: string[];
}

const TIERS: TierDef[] = [
  {
    tier: 'free',
    title: 'Free',
    price: '$0',
    features: ['Limited ticker', '60s refresh', 'With ads (Roku)'],
  },
  {
    tier: 'premium',
    title: 'Premium',
    price: '$9.99/mo',
    features: ['Full markets data', '10s refresh', 'AI news feed', 'Ad-free'],
  },
  {
    tier: 'pro',
    title: 'Pro',
    price: '$14.99/mo',
    features: ['Everything in Premium', 'Portfolio tracker', 'Custom watchlist', 'Price alerts'],
  },
];

export function Paywall({ onSelect, onRestore }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade MarketPulse</Text>
      <Text style={styles.subtitle}>Choose a plan to unlock the full experience</Text>
      <View style={styles.row}>
        {TIERS.map((t, idx) => (
          <FocusableCard
            key={t.tier}
            onPress={() => onSelect(t.tier)}
            hasTVPreferredFocus={idx === 1}
            style={styles.tier}
          >
            <Text style={styles.tierTitle}>{t.title}</Text>
            <Text style={styles.tierPrice}>{t.price}</Text>
            {t.features.map((f) => (
              <Text key={f} style={styles.feature}>• {f}</Text>
            ))}
          </FocusableCard>
        ))}
      </View>
      <FocusableCard onPress={onRestore} style={styles.restore}>
        <Text style={styles.restoreText}>Restore Purchase</Text>
      </FocusableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: theme.spacing.xl, backgroundColor: theme.colors.bg },
  title: { color: theme.colors.text, fontSize: theme.fontSize.display, fontWeight: '800' },
  subtitle: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, marginTop: theme.spacing.sm },
  row: { flexDirection: 'row', gap: theme.spacing.lg, marginTop: theme.spacing.xl },
  tier: { width: 380, minHeight: 380 },
  tierTitle: { color: theme.colors.accent, fontSize: theme.fontSize.header, fontWeight: '800' },
  tierPrice: {
    color: theme.colors.text,
    fontSize: theme.fontSize.bodyLg,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  feature: { color: theme.colors.textMuted, fontSize: theme.fontSize.label, marginTop: theme.spacing.xs },
  restore: { marginTop: theme.spacing.xl, alignSelf: 'flex-start', paddingHorizontal: theme.spacing.xl },
  restoreText: { color: theme.colors.accent, fontSize: theme.fontSize.body, fontWeight: '600' },
});
