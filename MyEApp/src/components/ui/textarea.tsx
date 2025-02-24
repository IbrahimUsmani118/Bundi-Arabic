// components/Textarea.tsx
import React, { forwardRef } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

// Extend TextInputProps so our Textarea accepts all standard props.
export interface TextareaProps extends TextInputProps {}

const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        style={[styles.textarea, style]}
        placeholderTextColor="#6b7280"
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderRadius: 4,
  },
});

export { Textarea };
