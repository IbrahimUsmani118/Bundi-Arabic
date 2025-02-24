
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

/**
 * Props for the top-level AlertDialog container.
 */
interface AlertDialogProps {
  /** Optional nested components (e.g., <AlertDialogTrigger /> + <AlertDialogContent />). */
  children?: React.ReactNode;
}

/**
 * AlertDialogRoot: Just a container to hold state or pass children.
 * Typically, you'd wrap your entire usage of the dialog in here.
 */
export function AlertDialog({ children }: AlertDialogProps) {
  return <>{children}</>;
}

/**
 * Props for the AlertDialogTrigger component.
 */
interface AlertDialogTriggerProps {
  /** Function to open the dialog, or any action. */
  onPress?: (event: GestureResponderEvent) => void;
  /** Content displayed inside the trigger button. */
  children?: React.ReactNode;
}

/**
 * AlertDialogTrigger: A button to open the dialog.
 */
export function AlertDialogTrigger({ onPress, children }: AlertDialogTriggerProps) {
  return (
    <TouchableOpacity style={styles.trigger} onPress={onPress}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
}

/**
 * Props for the AlertDialogContent component.
 */
interface AlertDialogContentProps {
  /** Controls whether the dialog is visible. */
  visible: boolean;
  /** Callback to close the dialog. */
  onClose: () => void;
  /** Dialog title text. */
  title?: string;
  /** Dialog description text. */
  description?: string;
}

/**
 * AlertDialogContent: The actual modal content.
 * `visible` controls whether it's shown. `onClose` is a callback to hide it.
 * `title` and `description` are the basic text fields.
 */
export function AlertDialogContent({
  visible,
  onClose,
  title,
  description,
}: AlertDialogContentProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 10,
    backgroundColor: '#eee',
    margin: 4,
    borderRadius: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
});
