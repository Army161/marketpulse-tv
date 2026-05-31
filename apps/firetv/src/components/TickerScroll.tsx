import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import type { Coin, Stock } from '@marketpulse/shared';
import { changeDirection, formatPercent, formatPrice } from '@marketpulse/shared';
import { theme } from '../theme/theme';

interface Props {
  stocks: Stock[];
  coins: Coin[];
}

/**
 * Horizontal auto-scrolling ticker. Non-focusable by design — purely ambient
 * info while the user navigates the panels below. Loops smoothly via a
 * 60-second Animated translation that resets at the half-mark (the list is
 * rendered twice so the seam is invisible).
 */
export function TickerScroll({ stocks, coins }: Props): React.JSX.Element {
  const items = buildItems(stocks, coins);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const distance = items.length * ITEM_WIDTH;
    if (distance === 0) return;
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -distance,
        duration: items.length * 1800,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [items.length, translateX]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
        {[...items, ...items].map((item, idx) => (
          <TickerItem key={`${item.label}-${idx}`} {...item} />
        ))}
      </Animated.View>
    </View>
  );
}

interface Item {
  label: string;
  price: string;
  changePercent: number;
}

function buildItems(stocks: Stock[], coins: Coin[]): Item[] {
  const s = stocks.map((q) => ({ label: q.symbol, price: formatPrice(q.price), changePercent: q.changePercent }));
  const c = coins.map((q) => ({ label: q.symbol, price: formatPrice(q.price), changePercent: q.change24h }));
  return [...s, ...c];
}

const ITEM_WIDTH = 280;

function TickerItem({ label, price, changePercent }: Item): React.JSX.Element {
  const dir = changeDirection(changePercent);
  const color =
    dir === 'up' ? theme.colors.up : dir === 'down' ? theme.colors.down : theme.colors.flat;
  return (
    <View style={styles.item}>
      <Text style={styles.symbol}>{label}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={[styles.change, { color }]}>{formatPercent(changePercent)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: theme.colors.bgElevated,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
  item: {
    width: ITEM_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  symbol: { color: theme.colors.text, fontSize: theme.fontSize.ticker, fontWeight: '700' },
  price: { color: theme.colors.textMuted, fontSize: theme.fontSize.ticker, marginLeft: theme.spacing.md },
  change: { fontSize: theme.fontSize.ticker, marginLeft: theme.spacing.sm, fontWeight: '600' },
});
