import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type {
  CryptoResponse,
  MoversResponse,
  NewsResponse,
  StocksResponse,
} from '@marketpulse/shared';
import { useFetch } from '../hooks/useFetch';
import {
  ErrorState,
  LoadingState,
  MoverCard,
  NewsCard,
  PriceCard,
  TickerScroll,
} from '../components';
import { theme } from '../theme/theme';

/**
 * Home screen: ticker + top movers + crypto grid + news feed.
 * Each panel fetches and renders independently so a single failing
 * upstream doesn't blank the whole dashboard.
 */
export function DashboardScreen(): React.JSX.Element {
  const stocks = useFetch<StocksResponse>('/api/stocks', 30_000);
  const coins = useFetch<CryptoResponse>('/api/crypto?limit=10', 30_000);
  const movers = useFetch<MoversResponse>('/api/movers', 30_000);
  const news = useFetch<NewsResponse>('/api/news?limit=5', 300_000);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TickerScroll
        stocks={stocks.data?.tickers ?? []}
        coins={coins.data?.coins?.slice(0, 5) ?? []}
      />

      <Section title="Top Movers">
        <Panel
          loading={movers.loading}
          error={movers.error}
          onRetry={movers.refetch}
          empty={!movers.data}
        >
          <View style={styles.moversRow}>
            <View style={styles.moversCol}>
              <Text style={styles.subhead}>Gainers</Text>
              <View style={styles.cardRow}>
                {movers.data?.gainers.map((m, i) => (
                  <MoverCard key={m.symbol} mover={m} hasTVPreferredFocus={i === 0} />
                ))}
              </View>
            </View>
            <View style={styles.moversCol}>
              <Text style={styles.subhead}>Losers</Text>
              <View style={styles.cardRow}>
                {movers.data?.losers.map((m) => (
                  <MoverCard key={m.symbol} mover={m} />
                ))}
              </View>
            </View>
          </View>
        </Panel>
      </Section>

      <Section title="Crypto">
        <Panel loading={coins.loading} error={coins.error} onRetry={coins.refetch} empty={!coins.data}>
          <View style={styles.cardRow}>
            {coins.data?.coins.slice(0, 5).map((c) => (
              <PriceCard
                key={c.id}
                symbol={c.symbol}
                name={c.name}
                price={c.price}
                changePercent={c.change24h}
              />
            ))}
          </View>
        </Panel>
      </Section>

      <Section title="AI News">
        <Panel loading={news.loading} error={news.error} onRetry={news.refetch} empty={!news.data}>
          <View style={styles.newsCol}>
            {news.data?.articles.slice(0, 5).map((a, i) => (
              <NewsCard key={a.headline + i} article={a} />
            ))}
          </View>
        </Panel>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Panel({
  loading,
  error,
  empty,
  onRetry,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (loading && empty) return <LoadingState />;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingBottom: theme.spacing.xxl },
  section: { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.xl },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.fontSize.header,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },
  subhead: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, marginBottom: theme.spacing.sm },
  cardRow: { flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' },
  newsCol: { gap: theme.spacing.md },
  moversRow: { flexDirection: 'row', gap: theme.spacing.xl },
  moversCol: { flex: 1 },
});
