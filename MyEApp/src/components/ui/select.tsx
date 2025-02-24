// select.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  /** The selected value. */
  value?: string;
  /** Called when user selects an option. */
  onValueChange?: (val: string) => void;
  /** Placeholder if nothing selected. */
  placeholder?: string;
}

/**
 * A minimal “Select” in RN. 
 * For a more robust approach, consider `@react-native-picker/picker` or custom libraries.
 */
export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
}: SelectProps) {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  const handleSelect = (val: string) => {
    onValueChange?.(val);
    close();
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View>
      <TouchableOpacity style={styles.trigger} onPress={open}>
        <Text style={styles.triggerText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <TouchableOpacity style={styles.overlay} onPress={close}>
          <View style={styles.content}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text>{item.label}</Text>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  triggerText: {
    fontSize: 14,
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 250,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  option: {
    paddingVertical: 8,
  },
});
