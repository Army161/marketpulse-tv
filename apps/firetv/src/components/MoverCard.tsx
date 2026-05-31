import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Mover } from '@marketpulse/shared';
import { changeDirection, formatPercent, formatPrice } from '@marketpulse/shared';
import { theme } from '../theme/theme';
import { FocusableCard } from './FocusableCard';

interface Props {
  mover: Mover;
  hasTVPreferredFocus?: boolean;
}

/** Single gainer/loser card — symbol + large percent badge. */
export function MoverCard({ mover, hasTVPreferredFocus }: Props): React.JSX.Element {
  const dir = changeDirection(mover.changePercent);
  const color = dir === 'up' ? theme.colors.up : dir === 'down' ? theme.colors.down : theme.colors.flat;

  return (
    <FocusableCard hasTVPreferredFocus={hasTVPreferredFocus} style={styles.card}>
      <Text style={styles.symbol}>{mover.symbol}</Text>
      {mover.name ? <Text style={styles.name} numberOfLines={1}>{mover.name}</Text> : null}
      {typeof mover.price === 'number' ? (
        <Text style={styles.price}>{formatPrice(mover.price)}</Text>
      ) : null}
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{formatPercent(mover.changePercent)}</Text>
      </View>
    </FocusableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    minHeight: 220,
    alignItems: 'flex-start',
  },
  symbol: { color: theme.colors.text, fontSize: theme.fontSize.bodyLg, fontWeight: '800' },
  name: { color: theme.colors.textMuted, fontSize: theme.fontSize.label, marginTop: 2 },
  price: { color: theme.colors.text, fontSize: theme.fontSize.body, marginTop: theme.spacing.sm },
  badge: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
  },
  badgeText: { color: '#0A0E14', fontSize: theme.fontSize.body, fontWeight: '800' },
});
