// drawer.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface DrawerProps {
  /** Whether the drawer is visible. */
  visible: boolean;
  /** Called when user closes the drawer. */
  onClose: () => void;
  /** Drawer content. */
  children?: React.ReactNode;
}

/**
 * A minimal bottom “drawer” using a Modal that slides up.
 */
export function Drawer({ visible, onClose, children }: DrawerProps) {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayBackground}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.drawerContainer}>
          {children}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * A trigger to open the drawer.
 */
interface DrawerTriggerProps {
  label: string;
  onPress: () => void;
}

export function DrawerTrigger({ label, onPress }: DrawerTriggerProps) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      <Text style={{ color: '#fff' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const screenHeight = Dimensions.get('window').height;
const DRAWER_HEIGHT = 300; // or some fraction of screenHeight

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawerContainer: {
    width: '100%',
    height: DRAWER_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  trigger: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
});
