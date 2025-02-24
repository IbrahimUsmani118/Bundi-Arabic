// menubar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface MenuItem {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

interface MenubarProps {
  items: MenuItem[];
}

/**
 * A minimal horizontal “menubar” in RN. 
 * Replaces Radix Menubar with a row of buttons.
 */
export function Menubar({ items }: MenubarProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.item, item.disabled && styles.disabled]}
          onPress={item.onPress}
          disabled={item.disabled}
        >
          <Text style={styles.itemText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    backgroundColor: '#eee',
    borderRadius: 4,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  itemText: {
    fontSize: 14,
  },
});
