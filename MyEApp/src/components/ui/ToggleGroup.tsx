// components/ToggleGroup.tsx
import React, { createContext, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface ToggleGroupContextValue {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  variant: "default",
  size: "default",
});

export interface ToggleGroupProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  variant = "default",
  size = "default",
  children,
  style,
}) => {
  return (
    <View style={[styles.groupContainer, style]}>
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </View>
  );
};

export interface ToggleGroupItemProps {
  value: string;
  onPress?: () => void;
  selected?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  onPress,
  selected,
  children,
  style,
}) => {
  const { variant, size } = useContext(ToggleGroupContext);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        variant === "outline" && styles.itemOutline,
        selected && styles.itemSelected,
        size === "sm" && styles.itemSm,
        size === "lg" && styles.itemLg,
        style,
      ]}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    padding: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    marginHorizontal: 4,
  },
  itemOutline: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  itemSelected: {
    backgroundColor: "#ddd",
  },
  itemSm: {
    height: 32,
    minWidth: 32,
  },
  itemLg: {
    height: 48,
    minWidth: 48,
  },
});
