// customnavbar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomNavbarProps {
  onPreviousClick?: () => void;
  onNextClick?: () => void;
}

/**
 * A minimal “previous/next” navbar for a calendar in RN.
 * You’d integrate this with your chosen calendar library’s props.
 */
export function CustomNavbar({ onPreviousClick, onNextClick }: CustomNavbarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPreviousClick}>
        <Text style={styles.arrow}>{'<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onNextClick}>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 4,
  },
  arrow: {
    fontSize: 16,
  },
});
