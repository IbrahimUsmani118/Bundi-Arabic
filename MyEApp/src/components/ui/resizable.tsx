// resizable.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';


interface PanelProps {
  /** Panel content. */
  children?: React.ReactNode;
  /** Additional style for the panel. */
  style?: StyleProp<ViewStyle>;
}

interface PanelGroupProps {
  /** If true, panels are stacked vertically; otherwise horizontally. */
  direction?: 'horizontal' | 'vertical';
  /** Additional style for the group container. */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

interface HandleProps {
  /** If true, show a handle icon. */
  withHandle?: boolean;
  /** Called when user wants to “resize” (in this minimal example, we just simulate). */
  onPress?: () => void;
}

/**
 * Minimal “PanelGroup” that can be horizontal or vertical.
 */
export function ResizablePanelGroup({
  direction = 'horizontal',
  style,
  children,
}: PanelGroupProps) {
  const flexDirection = direction === 'horizontal' ? 'row' : 'column';

  return (
    <View style={[{ flexDirection, flex: 1 }, style]}>{children}</View>
  );
}

/**
 * Minimal “Panel” that just wraps content in a <View>.
 */
export function ResizablePanel({ children, style }: PanelProps) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

/**
 * Minimal “Handle” that toggles some state or calls a prop. 
 * No real drag here—just a placeholder.
 */
export function ResizableHandle({ withHandle, onPress }: HandleProps) {
  return (
    <TouchableOpacity style={styles.handle} onPress={onPress}>
      {withHandle && (
        <View style={styles.handleIcon}>
          <GripVertical width={16} height={16} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  handle: {
    // This is a minimal placeholder “divider.”
    backgroundColor: '#eee',
    width: 8,
    // or if vertical layout, adjust height
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleIcon: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    padding: 4,
  },
});
