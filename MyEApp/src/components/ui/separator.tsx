// separator.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface SeparatorProps {
  /** “horizontal” or “vertical” */
  orientation?: 'horizontal' | 'vertical';
  /** If true, purely decorative (no screen reader text). */
  decorative?: boolean; // no direct effect in RN
  /** Additional style. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal “Separator” in RN, which is basically a thin <View> with a style.
 */
export function Separator({
  orientation = 'horizontal',
  decorative = true,
  style,
}: SeparatorProps) {
  const isHorizontal = orientation === 'horizontal';
  return (
    <View
      style={[
        styles.base,
        isHorizontal ? styles.horizontal : styles.vertical,
        style,
      ]}
      // For accessibility, you might set accessibilityRole="none" if decorative
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#ccc',
  },
  horizontal: {
    width: '100%',
    height: 1,
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});
