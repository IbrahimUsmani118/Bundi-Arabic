
import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ImageStyle,
  ViewStyle,
} from 'react-native';

/**
 * We define separate style props:
 *  - imageStyle: for the <Image> scenario
 *  - containerStyle: for the <View> fallback scenario
 * This avoids applying invalid "overflow" to the <Image>.
 */
interface AvatarProps {
  /** The URI for the image. If omitted, fallback text is shown. */
  uri?: string;
  /** The fallback text if there's no URI (e.g., initials). */
  fallback?: string;
  /** The size (width/height) of the avatar. */
  size?: number;
  /** Style for the image if `uri` is present. */
  imageStyle?: StyleProp<ImageStyle>;
  /** Style for the container if `uri` is missing. */
  containerStyle?: StyleProp<ViewStyle>;
}

export function Avatar({
  uri,
  fallback = '?',
  size = 40,
  imageStyle,
  containerStyle,
}: AvatarProps) {
  if (uri) {
    // Render an <Image>
    return (
      <Image
        source={{ uri }}
        style={[
          styles.imageBase,
          { width: size, height: size, borderRadius: size / 2 },
          imageStyle, // No "overflow" property here
        ]}
      />
    );
  } else {
    // Render a <View> fallback with text
    return (
      <View
        style={[
          styles.containerBase,
          { width: size, height: size, borderRadius: size / 2 },
          containerStyle, // "overflow: hidden" is valid here
        ]}
      >
        <Text style={styles.fallbackText}>{fallback}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageBase: {
    // Valid <Image> style props:
    backgroundColor: '#ccc',
    // NOTE: Do NOT put overflow: hidden or scroll here,
    // as those are not valid on ImageStyle.
  },
  containerBase: {
    // Valid <View> style props:
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // only valid for <View>
  },
  fallbackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
