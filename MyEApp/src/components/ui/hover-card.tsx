// hover-card.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

interface HoverCardProps {
  /** Content of the "card" that appears. */
  content: React.ReactNode;
  /** The trigger node or text. */
  children: React.ReactNode;
}

/**
 * A minimal "hover card" in RN, replaced with a press-based tooltip approach.
 */
export function HoverCard({ content, children }: HoverCardProps) {
  const [visible, setVisible] = useState(false);

  const openCard = () => setVisible(true);
  const closeCard = () => setVisible(false);

  return (
    <View>
      <Pressable onPressIn={openCard} onPressOut={closeCard}>
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </Pressable>

      <Modal
        transparent
        visible={visible}
        onRequestClose={closeCard}
        animationType="fade"
      >
        <Pressable style={styles.overlay} onPress={closeCard}>
          <View style={styles.card}>
            {typeof content === 'string' ? <Text>{content}</Text> : content}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
