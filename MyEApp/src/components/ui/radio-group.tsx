// radio-group.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  /** The list of options to render. */
  options: RadioOption[];
  /** The selected value. */
  value?: string;
  /** Called when user selects an option. */
  onValueChange?: (val: string) => void;
  /** Additional style for the container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal “RadioGroup” in React Native. 
 * Renders a vertical list of radio options.
 */
export function RadioGroup({
  options,
  value,
  onValueChange,
  style,
}: RadioGroupProps) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onValueChange?.(option.value)}
          >
            <View style={[styles.circle, selected && styles.circleSelected]} />
            <Text style={styles.label}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // default vertical layout
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    marginRight: 8,
  },
  circleSelected: {
    backgroundColor: '#007bff',
  },
  label: {
    fontSize: 14,
  },
});
