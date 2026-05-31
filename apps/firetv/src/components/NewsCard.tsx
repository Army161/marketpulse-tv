import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Article } from '@marketpulse/shared';
import { theme } from '../theme/theme';
import { FocusableCard } from './FocusableCard';

interface Props {
  article: Article;
  hasTVPreferredFocus?: boolean;
}

/** AI news summary card with source/category badges. */
export function NewsCard({ article, hasTVPreferredFocus }: Props): React.JSX.Element {
  return (
    <FocusableCard hasTVPreferredFocus={hasTVPreferredFocus} style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.source}>{article.source}</Text>
        <View style={styles.dot} />
        <Text style={styles.category}>{article.category}</Text>
      </View>
      <Text style={styles.headline} numberOfLines={2}>
        {article.headline}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {article.summary}
      </Text>
    </FocusableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 520,
    minHeight: 240,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  source: { color: theme.colors.accent, fontSize: theme.fontSize.label, fontWeight: '700' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.textDim,
    marginHorizontal: theme.spacing.sm,
  },
  category: { color: theme.colors.textMuted, fontSize: theme.fontSize.label, fontWeight: '500' },
  headline: { color: theme.colors.text, fontSize: theme.fontSize.body, fontWeight: '700', marginBottom: theme.spacing.sm },
  summary: { color: theme.colors.textMuted, fontSize: theme.fontSize.label, lineHeight: 32 },
});
