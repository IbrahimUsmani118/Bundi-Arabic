// context-menu.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface ContextMenuItem {
  label: string;
  onPress?: () => void;
}

interface ContextMenuProps {
  /** The items in the context menu. */
  items: ContextMenuItem[];
  /** Style for the container. */
  style?: StyleProp<ViewStyle>;
}

/**
 * A minimal “context menu” for React Native.
 * You might show it on a long press or a button press. 
 * For a more advanced approach, see e.g. react-native-popover or a custom library.
 */
export function ContextMenu({ items, style }: ContextMenuProps) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={style}>
      <TouchableOpacity style={styles.trigger} onPress={openMenu}>
        <Text style={styles.triggerText}>Open Context Menu</Text>
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
          <View style={styles.menuContainer}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress?.();
                  closeMenu();
                }}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  triggerText: {
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
  },
  menuItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    color: '#333',
  },
});
