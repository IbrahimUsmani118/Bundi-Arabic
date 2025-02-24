// input.tsx
import React, { forwardRef } from 'react';
import {
  TextInput,
  StyleSheet,
  StyleProp,
  TextInputProps,
  TextStyle,
} from 'react-native';

interface InputProps extends TextInputProps {
  /** Additional style for the TextInput. */
  style?: StyleProp<TextStyle>;
}

/**
 * A basic text input for React Native. 
 * Replaces the web <input> with a <TextInput>.
 */
export const Input = forwardRef<TextInput, InputProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        {...props}
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
