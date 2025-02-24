// navigation-menu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NavItem {
  label: string;
  onPress?: () => void;
}

interface NavigationMenuProps {
  items: NavItem[];
}

/**
 * A minimal “navigation menu” in RN. 
 * Typically you'd use React Navigation for real screens, 
 * but here's a row of nav-like buttons for demonstration.
 */
export function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <View style={styles.container}>
      {items.map((item, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.navButton}
          onPress={item.onPress}
        >
          <Text style={styles.navButtonText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  navButton: {
    marginHorizontal: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  navButtonText: {
    fontSize: 14,
  },
});
