import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  label?: string;
}

export function LoadingState({ label = 'Loading…' }: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.accent} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  label: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.body,
  },
});
