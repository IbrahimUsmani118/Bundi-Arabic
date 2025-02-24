// components/Tooltip.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ViewStyle } from "react-native";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  style,
  contentStyle,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onLongPress={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        style={style}
      >
        {children}
      </TouchableOpacity>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.tooltipContainer}>
          <View style={[styles.tooltipContent, contentStyle]}>
            <Text style={styles.tooltipText}>{content}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContent: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 8,
    borderRadius: 4,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
  },
});
