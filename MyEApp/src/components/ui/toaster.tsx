// components/Toaster.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastProvider, useToast, Toast } from "./toast"; // Ensure casing matches your filename

export function Toaster() {
  // In this implementation, the ToastViewport is rendered inside ToastProvider.
  // If you need to display custom content for each toast, you can modify the mapping.
  const { toasts } = useToast();
  return (
    <ToastProvider>
      <View style={styles.toasterContainer}>
        {toasts.map(({ id, title, description, ...props }) => (
          <Toast
            key={id}
            id={id} // pass the id explicitly
            title={title}
            description={description}
            {...props}
            onClose={() => {}}
          >
            <View style={styles.toastContent}>
              {title && <Text style={styles.toastTitle}>{title}</Text>}
              {description && (
                <Text style={styles.toastDescription}>{description}</Text>
              )}
            </View>
          </Toast>
        ))}
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  toasterContainer: {
    // The ToastProvider already renders the viewport,
    // so you can add additional styling here if desired.
  },
  toastContent: {
    // Mimic a grid gap with vertical spacing if needed.
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  toastDescription: {
    fontSize: 14,
    color: "#fff",
  },
});

export default Toaster;
