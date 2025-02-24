// command.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface CommandDialogProps {
  /** Whether the dialog is visible. */
  visible: boolean;
  /** Called when the user closes the dialog. */
  onClose: () => void;
  /** The list of items to show in the palette. */
  items?: string[];
  /** Called when the user selects an item. */
  onSelectItem?: (item: string) => void;
}

/**
 * A minimal “command palette” in React Native,
 * using a Modal, a TextInput for search, and a FlatList for items.
 */
export function CommandDialog({
  visible,
  onClose,
  items = [],
  onSelectItem,
}: CommandDialogProps) {
  const [query, setQuery] = useState('');

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: string) => {
    if (onSelectItem) onSelectItem(item);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TextInput
            placeholder="Search..."
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>No results found.</Text>
            }
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 8,
  },
  item: {
    paddingVertical: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 16,
    color: '#999',
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
  },
});
