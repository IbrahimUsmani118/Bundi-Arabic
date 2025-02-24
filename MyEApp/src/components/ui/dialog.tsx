// dialog.tsx
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

interface DialogProps {
  /** Controls whether the dialog is visible. */
  visible: boolean;
  /** Called when user closes the dialog. */
  onClose: () => void;
  /** Optional title text. */
  title?: string;
  /** Optional content or children. */
  children?: React.ReactNode;
}

export function Dialog({ visible, onClose, title, children }: DialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {title && <Text style={styles.title}>{title}</Text>}
          <View style={styles.content}>{children}</View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/**
 * A trigger button that toggles the dialog. 
 * In a more advanced setup, you'd manage state in a parent. 
 * This is just an example of how you might wrap the logic.
 */
interface DialogTriggerProps {
  label: string;
  onPress: () => void;
}

export function DialogTrigger({ label, onPress }: DialogTriggerProps) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      <Text style={{ color: '#fff' }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    marginBottom: 16,
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
