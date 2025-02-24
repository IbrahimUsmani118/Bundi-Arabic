// skeleton.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal “Skeleton” placeholder in React Native.
 */
export function Skeleton({ style }: SkeletonProps) {
  return <View style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0', // a gray placeholder color
    borderRadius: 4,
    // If you want a “pulse,” consider reanimated or a library.
  },
});
