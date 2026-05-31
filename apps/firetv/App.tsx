import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { TVNavigator } from './src/navigation/TVNavigator';
import { theme } from './src/theme/theme';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar hidden />
      <TVNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
});
