import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import { FocusableCard } from '../components';
import { usePurchase } from '../monetization/usePurchase';

interface Props {
  onOpenPaywall: () => void;
}

export function SettingsScreen({ onOpenPaywall }: Props): React.JSX.Element {
  const { entitlement, restore } = usePurchase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Row label="Subscription">
        <Text style={styles.value}>{labelFor(entitlement.tier)} {entitlement.active ? '— Active' : ''}</Text>
        <FocusableCard onPress={onOpenPaywall} hasTVPreferredFocus style={styles.button}>
          <Text style={styles.buttonText}>{entitlement.active ? 'Manage Plan' : 'Upgrade'}</Text>
        </FocusableCard>
      </Row>

      <Row label="Restore Purchase">
        <FocusableCard onPress={restore} style={styles.button}>
          <Text style={styles.buttonText}>Restore</Text>
        </FocusableCard>
      </Row>

      <Row label="Theme">
        <Text style={styles.value}>Dark (locked in MVP)</Text>
      </Row>

      <Row label="Refresh rate">
        <Text style={styles.value}>{entitlement.tier === 'free' ? '60s' : '10s'}</Text>
      </Row>

      <Row label="Watchlist">
        <Text style={styles.value}>
          {entitlement.tier === 'pro' ? 'Customizable' : 'Pro feature'}
        </Text>
      </Row>
    </ScrollView>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>{children}</View>
    </View>
  );
}

function labelFor(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.display,
    fontWeight: '800',
    marginBottom: theme.spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  rowLabel: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  value: { color: theme.colors.text, fontSize: theme.fontSize.body },
  button: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.xs },
  buttonText: { color: theme.colors.accent, fontSize: theme.fontSize.body, fontWeight: '700' },
});
