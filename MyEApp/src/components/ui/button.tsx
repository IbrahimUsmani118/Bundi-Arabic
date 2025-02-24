
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/**
 * A basic RN Button with variant/size styling.
 */
export function Button({
  variant = 'default',
  size = 'default',
  onPress,
  children,
  style,
  disabled,
}: ButtonProps) {
  const variantStyle = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[size] || sizeStyles.default;

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, sizeStyle, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    // ring-offset, focus ring, etc. are more complex in RN. We skip them.
    margin: 2,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

// Define each variant's style
const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: '#007bff', // "bg-primary"
  },
  destructive: {
    backgroundColor: '#dc3545',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    // In web, "link" might be text only. We do minimal styling:
    paddingHorizontal: 0,
  },
});

// Define each size's style
const sizeStyles = StyleSheet.create({
  default: {
    height: 40,
    paddingHorizontal: 16,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  lg: {
    height: 48,
    paddingHorizontal: 20,
  },
  icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
  },
});
