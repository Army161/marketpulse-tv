import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { StocksResponse } from '@marketpulse/shared';
import { useFetch } from '../hooks/useFetch';
import { ErrorState, LoadingState, PriceCard } from '../components';
import { theme } from '../theme/theme';

/**
 * Full markets screen. D-pad navigates the grid in row-major order — the
 * first card receives initial TV focus so users can start scrolling immediately.
 */
export function MarketsScreen(): React.JSX.Element {
  const { data, loading, error, refetch } = useFetch<StocksResponse>('/api/stocks', 30_000);

  if (error) return <ErrorState message={error} onRetry={refetch} hasTVPreferredFocus />;
  if (loading && !data) return <LoadingState label="Loading markets…" />;

  const bySector = groupBySector(data?.tickers ?? []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Markets</Text>
      {Object.entries(bySector).map(([sector, items], si) => (
        <View key={sector} style={styles.section}>
          <Text style={styles.sectionTitle}>{sector}</Text>
          <View style={styles.row}>
            {items.map((t, ti) => (
              <PriceCard
                key={t.symbol}
                symbol={t.symbol}
                name={t.name}
                price={t.price}
                changePercent={t.changePercent}
                hasTVPreferredFocus={si === 0 && ti === 0}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function groupBySector(items: StocksResponse['tickers']): Record<string, StocksResponse['tickers']> {
  return items.reduce<Record<string, StocksResponse['tickers']>>((acc, t) => {
    const key = t.sector ?? 'Other';
    (acc[key] ??= []).push(t);
    return acc;
  }, {});
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  title: { color: theme.colors.text, fontSize: theme.fontSize.display, fontWeight: '800', marginBottom: theme.spacing.lg },
  section: { marginBottom: theme.spacing.xl },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.header,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  row: { flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' },
});
