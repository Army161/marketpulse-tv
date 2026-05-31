import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import { FocusableCard } from './FocusableCard';

interface Props {
  message: string;
  onRetry: () => void;
  hasTVPreferredFocus?: boolean;
}

export function ErrorState({ message, onRetry, hasTVPreferredFocus }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unable to load</Text>
      <Text style={styles.message}>{message}</Text>
      <FocusableCard onPress={onRetry} hasTVPreferredFocus={hasTVPreferredFocus} style={styles.retry}>
        <Text style={styles.retryText}>Retry</Text>
      </FocusableCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 240,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: { color: theme.colors.down, fontSize: theme.fontSize.header, fontWeight: '700' },
  message: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  retry: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  retryText: { color: theme.colors.accent, fontSize: theme.fontSize.body, fontWeight: '700' },
});
