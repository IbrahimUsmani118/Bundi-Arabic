// checkbox.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CheckboxProps {
  /** Whether the checkbox is checked. */
  value: boolean;
  /** Called when the user toggles the checkbox. */
  onValueChange?: (newValue: boolean) => void;
  /** Optional label next to the checkbox. */
  label?: string;
  /** If true, user cannot toggle the checkbox. */
  disabled?: boolean;
}

/**
 * A basic Checkbox for React Native using local state toggles.
 * Replaces Radix UI's @radix-ui/react-checkbox approach.
 */
export function Checkbox({ value, onValueChange, label, disabled }: CheckboxProps) {
  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={[styles.box, value && styles.checked]}>
        {value && <Text style={styles.checkMark}>✓</Text>}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    borderRadius: 3,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#007bff',
  },
  checkMark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
  },
});
