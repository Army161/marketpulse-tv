import React, { useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  onPress?: () => void;
  hasTVPreferredFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/**
 * Base D-pad focusable card. Renders a 3px accent focus ring when the TV
 * focus engine selects the underlying Pressable. Every clickable surface
 * in the app should use this so the focus affordance is identical everywhere.
 */
export function FocusableCard({ onPress, hasTVPreferredFocus, style, children }: Props): React.JSX.Element {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      focusable
      style={[styles.card, focused && styles.cardFocused, style]}
    >
      <View>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bgCard,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: theme.focus.ringWidth,
    borderColor: 'transparent',
  },
  cardFocused: {
    borderColor: theme.focus.ringColor,
    transform: [{ scale: theme.focus.scale }],
  },
});
