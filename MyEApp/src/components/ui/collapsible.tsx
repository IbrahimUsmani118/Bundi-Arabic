// collapsible.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CollapsibleProps {
  /** If true, starts open by default. */
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

/**
 * Root container for collapsible content. 
 * We store open/closed state internally in this minimal example.
 */
export function Collapsible({ defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View>
      {/* We simply render children if open. 
         For a more advanced approach, you'd separate trigger vs content. */}
      {open && children}
    </View>
  );
}

/**
 * Trigger that toggles the collapsible open/close state.
 * Typically you'd manage the open/close logic in a parent or context,
 * but here's a minimal approach with an onPress callback.
 */
interface CollapsibleTriggerProps {
  onPress?: () => void;
  children?: React.ReactNode;
}

export function CollapsibleTrigger({ onPress, children }: CollapsibleTriggerProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.trigger}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}

/**
 * Content area that is shown/hidden. 
 * In a more advanced approach, you'd do an animation or pass in open/closed state.
 */
interface CollapsibleContentProps {
  children?: React.ReactNode;
}

export function CollapsibleContent({ children }: CollapsibleContentProps) {
  return <View style={styles.content}>{children}</View>;
}

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
    backgroundColor: '#eee',
    marginVertical: 4,
    borderRadius: 4,
  },
  content: {
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    marginVertical: 4,
  },
});
