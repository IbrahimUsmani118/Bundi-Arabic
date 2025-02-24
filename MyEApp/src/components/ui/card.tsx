// card.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CardProps {
  /** Optional styling for the outer container. */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * A basic "Card" container for React Native.
 */
export function Card({ style, children }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/**
 * Header area of the card (like a title section).
 */
export function CardHeader({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  return <View style={[styles.header, style]}>{children}</View>;
}

/**
 * Title text in the header.
 */
export function CardTitle({ children }: { children?: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

/**
 * Description text in the header or content area.
 */
export function CardDescription({ children }: { children?: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

/**
 * Main content area of the card.
 */
export function CardContent({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  return <View style={[styles.content, style]}>{children}</View>;
}

/**
 * Footer area of the card (e.g., for buttons).
 */
export function CardFooter({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: 0,
    marginVertical: 8,
  },
  header: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 12,
  },
  footer: {
    padding: 12,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
