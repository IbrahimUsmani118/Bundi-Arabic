// input-otp.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface InputOTPProps {
  length: number;
  onChangeOTP?: (otp: string) => void;
}

/**
 * A minimal OTP input that renders `length` text inputs in a row.
 */
export function InputOTP({ length, onChangeOTP }: InputOTPProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];
    newValues[index] = text.slice(-1); // only keep last char
    setValues(newValues);
    if (onChangeOTP) {
      onChangeOTP(newValues.join(''));
    }
    // optionally auto-focus next input if text is entered
  };

  return (
    <View style={styles.container}>
      {values.map((val, index) => (
        <TextInput
          key={index}
          style={styles.box}
          keyboardType="numeric"
          maxLength={1}
          value={val}
          onChangeText={(text) => handleChange(text, index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  box: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 4,
  },
});
