
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  /** Controls the styling variant of the badge. */
  variant?: BadgeVariant;
  /** Additional style for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Content inside the badge (usually text). */
  children?: React.ReactNode;
}

/**
 * A simple Badge component for React Native.
 */
export function Badge({ variant = 'default', style, children }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {typeof children === 'string' ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  secondary: {
    backgroundColor: '#6c757d',
    borderColor: '#6c757d',
  },
  destructive: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
});
