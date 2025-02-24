// components/Sheet.tsx
import React, { useEffect, useRef } from "react";
import {
  Modal,
  Animated,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { X } from "lucide-react-native"; // Ensure you have a React Native–compatible version

export type SheetProps = {
  open: boolean;
  onClose: () => void;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
};

export const Sheet: React.FC<SheetProps> = ({
  open,
  onClose,
  side = "right",
  children,
}) => {
  const { width, height } = Dimensions.get("window");

  let initialOffset: number;
  let transformProp: "translateX" | "translateY";
  if (side === "left") {
    initialOffset = -width;
    transformProp = "translateX";
  } else if (side === "right") {
    initialOffset = width;
    transformProp = "translateX";
  } else if (side === "top") {
    initialOffset = -height;
    transformProp = "translateY";
  } else {
    // side === "bottom"
    initialOffset = height;
    transformProp = "translateY";
  }

  const translateAnim = useRef(new Animated.Value(initialOffset)).current;

  useEffect(() => {
    Animated.timing(translateAnim, {
      toValue: open ? 0 : initialOffset,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, initialOffset, translateAnim]);

  return (
    <Modal visible={open} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.sheetContent,
            // Casting to any allows TypeScript to accept our dynamic transform.
            { transform: [{ [transformProp]: translateAnim }] } as any,
          ]}
        >
          {children}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Sheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    maxHeight: "80%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
