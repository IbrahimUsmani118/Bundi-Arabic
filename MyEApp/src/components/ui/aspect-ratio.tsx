
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface AspectRatioProps {
  /** The aspect ratio (width/height). For 16:9, pass 16/9. Defaults to 1 (square). */
  ratio?: number;
  /** Child elements to render inside the container. */
  children?: React.ReactNode;
  /** Additional style to apply to the container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A simple AspectRatio container for React Native using the `aspectRatio` style.
 * It preserves the ratio for any child content.
 */
export function AspectRatio({ ratio = 1, children, style }: AspectRatioProps) {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
}
