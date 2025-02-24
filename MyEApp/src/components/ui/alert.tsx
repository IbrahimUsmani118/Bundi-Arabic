
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  /** Controls the styling (default or destructive). */
  variant?: AlertVariant;
  /** Title text for the alert banner. */
  title?: string;
  /** Description text for the alert banner. */
  description?: string;
}

export function Alert({
  variant = 'default',
  title,
  description,
}: AlertProps) {
  const containerStyle = [
    styles.container,
    variant === 'destructive' && styles.destructive,
  ];

  return (
    <View style={containerStyle}>
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  destructive: {
    backgroundColor: '#ffe5e5',
    borderColor: '#ffcccc',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
});
