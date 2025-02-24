import React, { useState, useEffect } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import RNCommunitySlider from '@react-native-community/slider';

interface SliderProps {
  value?: number;
  onValueChange?: (val: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal “Slider” using `@react-native-community/slider` that manages its own state.
 */
export function Slider({
  value = 0,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  style,
}: SliderProps) {
  // Manage slider's value in local state.
  const [sliderValue, setSliderValue] = useState(value);

  // Update state if parent value changes.
  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleValueChange = (val: number) => {
    setSliderValue(val);
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <RNCommunitySlider
      style={[styles.slider, style]}
      value={sliderValue}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      onValueChange={handleValueChange}
      minimumTrackTintColor="#000"
      maximumTrackTintColor="#ccc"
      thumbTintColor="#000"
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
});
