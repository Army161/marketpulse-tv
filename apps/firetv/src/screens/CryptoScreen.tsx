import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { CryptoResponse } from '@marketpulse/shared';
import { useFetch } from '../hooks/useFetch';
import { ErrorState, LoadingState, PriceCard } from '../components';
import { theme } from '../theme/theme';

export function CryptoScreen(): React.JSX.Element {
  const { data, loading, error, refetch } = useFetch<CryptoResponse>('/api/crypto?limit=100', 30_000);

  if (error) return <ErrorState message={error} onRetry={refetch} hasTVPreferredFocus />;
  if (loading && !data) return <LoadingState label="Loading crypto…" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Crypto — Top 100</Text>
      <View style={styles.grid}>
        {data?.coins.map((c, i) => (
          <PriceCard
            key={c.id}
            symbol={c.symbol}
            name={c.name}
            price={c.price}
            changePercent={c.change24h}
            hasTVPreferredFocus={i === 0}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.display,
    fontWeight: '800',
    marginBottom: theme.spacing.lg,
  },
  grid: { flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' },
});
