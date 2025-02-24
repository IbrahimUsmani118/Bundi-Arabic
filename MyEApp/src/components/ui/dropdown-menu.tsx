// dropdown-menu.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  GestureResponderEvent,
} from 'react-native';

interface DropdownMenuItem {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  /** Label for the trigger button. */
  triggerLabel: string;
  /** Menu items to display. */
  items: DropdownMenuItem[];
}

/**
 * A minimal “dropdown menu” for React Native.
 * Replaces the Radix UI approach with a <Modal>.
 */
export function DropdownMenu({ triggerLabel, items }: DropdownMenuProps) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleItemPress = (item: DropdownMenuItem) => {
    if (!item.disabled && item.onPress) {
      item.onPress();
    }
    closeMenu();
  };

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={openMenu}>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        onRequestClose={closeMenu}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menu}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    item.disabled && styles.disabledItem,
                  ]}
                  onPress={() => handleItemPress(item)}
                  disabled={item.disabled}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
  },
  triggerText: {
    color: '#fff',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 4,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  disabledItem: {
    opacity: 0.5,
  },
  menuItemText: {
    color: '#333',
  },
});
