// components/PageSlider.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";

const navigationPages = [
  { name: "Home", path: "Home", value: 0 },
  { name: "Flights", path: "Flights", value: 25 },
  { name: "Hotels", path: "Hotels", value: 50 },
  { name: "Beauty", path: "Beauty", value: 75 },
  { name: "Events", path: "Events", value: 100 }
];

const cities = [
  { name: "Miami", value: 0 },
  { name: "New York", value: 100 }
];

const years = [
  { name: "2020", value: 0 },
  { name: "2021", value: 20 },
  { name: "2022", value: 40 },
  { name: "2023", value: 60 },
  { name: "2024", value: 80 },
  { name: "2025", value: 100 }
];

export interface PageSliderProps {
  type?: "navigation" | "cities" | "years";
  onCityChange?: (city: string) => void;
  onYearChange?: (year: number) => void;
}

const PageSlider = ({ type = "navigation", onCityChange, onYearChange }: PageSliderProps) => {
  const navigation = useNavigation();
  const [value, setValue] = useState(0);
  const sliderX = useState(new Animated.Value(0))[0];

  const getItems = () => {
    switch (type) {
      case "cities":
        return cities;
      case "years":
        return years;
      default:
        return navigationPages;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: sliderX }], { useNativeDriver: false }),
    onPanResponderRelease: (e, { dx }) => {
      const newValue = Math.min(100, Math.max(0, value + (dx / 300) * 100));
      setValue(newValue);
      sliderX.setValue(0);
      handleValueChange(newValue);
    }
  });

  const handleValueChange = (newValue: number) => {
    setValue(newValue);

    const closestItem = getItems().reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.value - newValue);
      const currDiff = Math.abs(curr.value - newValue);
      return prevDiff < currDiff ? prev : curr;
    });

    if (type === "cities") {
      onCityChange?.(closestItem.name);
    }

    if (type === "years") {
      const yearNum = parseInt(closestItem.name, 10);
      onYearChange?.(yearNum);
    }

    if (type === "navigation" && "path" in closestItem && closestItem.path) {
      navigation.navigate(closestItem.path as never);
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Page Slider</Text>

      {/* Custom Slider */}
      <View style={styles.sliderContainer}>
        <View style={styles.track} />
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [{ translateX: sliderX }]
            }
          ]}
          {...panResponder.panHandlers}
        />
      </View>

      {/* Labels */}
      <View style={styles.labelContainer}>
        {getItems().map((item) => (
          <TouchableOpacity key={item.value} onPress={() => handleValueChange(item.value)}>
            <Text
              style={[
                styles.label,
                Math.abs(value - item.value) < 10
                  ? styles.activeLabel
                  : styles.inactiveLabel
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  sliderContainer: {
    width: "80%",
    height: 40,
    alignSelf: "center",
    marginVertical: 20
  },
  track: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1E90FF",
    position: "absolute",
    top: -13,
    left: 0
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
    marginTop: 20
  },
  label: {
    fontSize: 14
  },
  activeLabel: {
    color: "#000",
    fontWeight: "bold"
  },
  inactiveLabel: {
    color: "#808080"
  }
});

export default PageSlider;
