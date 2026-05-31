import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ArticleCategory, NewsResponse } from '@marketpulse/shared';
import { useFetch } from '../hooks/useFetch';
import { ErrorState, FocusableCard, LoadingState, NewsCard } from '../components';
import { theme } from '../theme/theme';

const CATEGORIES: (ArticleCategory | 'All')[] = ['All', 'Stocks', 'Crypto', 'Economy', 'Earnings'];

export function NewsScreen(): React.JSX.Element {
  const { data, loading, error, refetch } = useFetch<NewsResponse>('/api/news?limit=20', 300_000);
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>('All');

  const filtered = useMemo(() => {
    if (!data) return [];
    if (active === 'All') return data.articles;
    return data.articles.filter((a) => a.category === active);
  }, [active, data]);

  if (error) return <ErrorState message={error} onRetry={refetch} hasTVPreferredFocus />;
  if (loading && !data) return <LoadingState label="Loading news…" />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>AI News Feed</Text>
      <View style={styles.tabs}>
        {CATEGORIES.map((cat, idx) => (
          <FocusableCard
            key={cat}
            onPress={() => setActive(cat)}
            hasTVPreferredFocus={idx === 0}
            style={[styles.tab, active === cat && styles.tabActive]}
          >
            <Text style={[styles.tabText, active === cat && styles.tabTextActive]}>{cat}</Text>
          </FocusableCard>
        ))}
      </View>
      <View style={styles.list}>
        {filtered.map((a, i) => (
          <NewsCard key={a.headline + i} article={a} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxl },
  title: { color: theme.colors.text, fontSize: theme.fontSize.display, fontWeight: '800', marginBottom: theme.spacing.lg },
  tabs: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  tab: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  tabActive: { backgroundColor: theme.colors.bgElevated },
  tabText: { color: theme.colors.textMuted, fontSize: theme.fontSize.body, fontWeight: '600' },
  tabTextActive: { color: theme.colors.accent },
  list: { gap: theme.spacing.md },
});
