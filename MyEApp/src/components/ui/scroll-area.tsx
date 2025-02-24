// scroll-area.tsx
import React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ScrollAreaProps {
  /** Optional style for the scroll container. */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * A minimal “ScrollArea” in RN using <ScrollView>.
 * We can’t easily do a custom scrollbar unless we implement advanced logic.
 */
export function ScrollArea({ style, children }: ScrollAreaProps) {
  return (
    <ScrollView style={[styles.container, style]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // If you want a default style:
    // e.g. backgroundColor: '#f9f9f9',
  },
});
