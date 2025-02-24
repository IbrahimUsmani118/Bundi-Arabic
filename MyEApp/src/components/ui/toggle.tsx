// components/Toggle.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

export interface ToggleProps {
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  value = false,
  onValueChange,
  variant = "default",
  size = "default",
  children,
  style,
}) => {
  const handlePress = () => {
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.toggle,
        variant === "outline" && styles.toggleOutline,
        size === "sm" && styles.toggleSm,
        size === "lg" && styles.toggleLg,
        value && styles.toggleActive,
        style,
      ]}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  toggleOutline: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  toggleSm: {
    height: 32,
  },
  toggleLg: {
    height: 48,
  },
  toggleActive: {
    backgroundColor: "#e5e7eb",
  },
});
