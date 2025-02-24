// components/Switch.tsx
import React, { useEffect, useRef } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { X } from "lucide-react-native"; // Replace with your RN‑compatible icon if needed

export interface SwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  style,
}) => {
  const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animation]);

  const handlePress = () => onValueChange(!value);

  const thumbTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={[styles.switch, style, value ? styles.switchOn : styles.switchOff]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  switchOn: {
    backgroundColor: "#2563eb", // blue when on
  },
  switchOff: {
    backgroundColor: "#d1d5db", // gray when off
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});
