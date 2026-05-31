import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { changeDirection, formatPercent, formatPrice } from '@marketpulse/shared';
import { theme } from '../theme/theme';
import { FocusableCard } from './FocusableCard';

interface Props {
  symbol: string;
  name?: string;
  price: number;
  changePercent: number;
  hasTVPreferredFocus?: boolean;
  onPress?: () => void;
}

/** Single stock or crypto card — symbol, optional name, price, %change. */
export function PriceCard({ symbol, name, price, changePercent, hasTVPreferredFocus, onPress }: Props): React.JSX.Element {
  const dir = changeDirection(changePercent);
  const color =
    dir === 'up' ? theme.colors.up : dir === 'down' ? theme.colors.down : theme.colors.flat;

  return (
    <FocusableCard onPress={onPress} hasTVPreferredFocus={hasTVPreferredFocus} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{symbol}</Text>
        {name ? <Text style={styles.name} numberOfLines={1}>{name}</Text> : null}
      </View>
      <Text style={styles.price}>{formatPrice(price)}</Text>
      <Text style={[styles.change, { color }]}>{formatPercent(changePercent)}</Text>
    </FocusableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    minHeight: 180,
  },
  header: { marginBottom: theme.spacing.xs },
  symbol: { color: theme.colors.text, fontSize: theme.fontSize.bodyLg, fontWeight: '800' },
  name: { color: theme.colors.textMuted, fontSize: theme.fontSize.label, marginTop: 2 },
  price: { color: theme.colors.text, fontSize: theme.fontSize.header, fontWeight: '700', marginTop: theme.spacing.sm },
  change: { fontSize: theme.fontSize.body, fontWeight: '600', marginTop: theme.spacing.xs },
});
