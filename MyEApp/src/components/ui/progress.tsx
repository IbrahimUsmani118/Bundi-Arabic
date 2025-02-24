// progress.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressProps {
  /** Value of progress from 0 to 100. */
  value?: number;
  /** Height of the progress bar. */
  height?: number;
  /** Background color for the track. */
  trackColor?: string;
  /** Background color for the filled portion. */
  fillColor?: string;
}

/**
 * A minimal progress bar in React Native.
 */
export function Progress({
  value = 0,
  height = 10,
  trackColor = '#eee',
  fillColor = '#007bff',
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.container, { height, backgroundColor: trackColor }]}>
      <View
        style={[
          styles.fill,
          { width: `${clampedValue}%`, backgroundColor: fillColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
