// popover.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

interface PopoverProps {
  /** The popover trigger text. */
  triggerLabel: string;
  /** The content inside the popover. */
  content: React.ReactNode;
}

/**
 * A minimal “popover” in RN, using a Modal centered on screen.
 * For advanced positioning near the trigger, see specialized libs or measure approach.
 */
export function Popover({ triggerLabel, content }: PopoverProps) {
  const [visible, setVisible] = useState(false);

  const openPopover = () => setVisible(true);
  const closePopover = () => setVisible(false);

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={openPopover}>
        <Text style={styles.triggerText}>{triggerLabel}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={visible}
        onRequestClose={closePopover}
        animationType="fade"
      >
        <Pressable style={styles.overlay} onPress={closePopover}>
          <View style={styles.contentContainer}>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#007bff',
    padding: 8,
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
  contentContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
});
