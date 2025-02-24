// label.tsx
import React, { forwardRef } from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';

interface LabelProps {
  /** The label text. */
  children?: React.ReactNode;
  /** Additional style. */
  style?: StyleProp<TextStyle>;
}

/**
 * A minimal “Label” for RN. 
 * In web, <label> ties to an input via htmlFor. 
 * In RN, we do not have that. We just display text near an input.
 */
export const Label = forwardRef<Text, LabelProps>(({ style, children }, ref) => {
  return (
    <Text ref={ref} style={[styles.label, style]}>
      {children}
    </Text>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
});
