import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CryptoScreen,
  DashboardScreen,
  MarketsScreen,
  NewsScreen,
  SettingsScreen,
} from '../screens';
import { Paywall, FocusableCard } from '../components';
import { theme } from '../theme/theme';
import { usePurchase } from '../monetization/usePurchase';
import type { SubscriptionTier } from '@marketpulse/shared';

type Screen = 'dashboard' | 'markets' | 'crypto' | 'news' | 'settings' | 'paywall';

const TABS: Array<{ id: Screen; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'markets', label: 'Markets' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'news', label: 'News' },
  { id: 'settings', label: 'Settings' },
];

/**
 * D-pad-only navigator. Vertical tab bar on the left (UP/DOWN to move,
 * SELECT to activate), screen content on the right. No router lib — TV
 * apps don't need URL state and adding one bloats the bundle.
 */
export function TVNavigator(): React.JSX.Element {
  const [active, setActive] = useState<Screen>('dashboard');
  const [previous, setPrevious] = useState<Screen>('dashboard');
  const { purchase } = usePurchase();

  const openPaywall = useCallback(() => {
    setPrevious(active);
    setActive('paywall');
  }, [active]);

  const handleSelect = useCallback(
    async (tier: SubscriptionTier) => {
      if (tier === 'free') {
        setActive(previous);
        return;
      }
      await purchase(tier);
      setActive(previous);
    },
    [previous, purchase],
  );

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <Text style={styles.brand}>MarketPulse</Text>
        {TABS.map((tab, idx) => (
          <FocusableCard
            key={tab.id}
            onPress={() => setActive(tab.id)}
            hasTVPreferredFocus={idx === 0 && active === 'dashboard'}
            style={[styles.tab, active === tab.id && styles.tabActive]}
          >
            <Text style={[styles.tabLabel, active === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
          </FocusableCard>
        ))}
      </View>
      <View style={styles.content}>{renderScreen(active, openPaywall, handleSelect)}</View>
    </View>
  );
}

function renderScreen(
  screen: Screen,
  openPaywall: () => void,
  onSelect: (tier: SubscriptionTier) => void,
): React.JSX.Element {
  switch (screen) {
    case 'dashboard':
      return <DashboardScreen />;
    case 'markets':
      return <MarketsScreen />;
    case 'crypto':
      return <CryptoScreen />;
    case 'news':
      return <NewsScreen />;
    case 'settings':
      return <SettingsScreen onOpenPaywall={openPaywall} />;
    case 'paywall':
      return <Paywall onSelect={onSelect} onRestore={() => onSelect('free')} />;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: theme.colors.bg },
  sidebar: {
    width: 280,
    backgroundColor: theme.colors.bgElevated,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  brand: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.bodyLg,
    fontWeight: '800',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  tab: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  tabActive: { backgroundColor: theme.colors.bgCard },
  tabLabel: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, fontWeight: '600' },
  tabLabelActive: { color: theme.colors.text },
  content: { flex: 1 },
});
