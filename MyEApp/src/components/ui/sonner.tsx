// sonner.tsx
import React from 'react';
import Toast, { ToastConfig, BaseToast } from 'react-native-toast-message';

/**
 * Minimal “ToastProvider” for React Native using react-native-toast-message.
 * 
 * Usage:
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Optionally define custom toast config:
  const toastConfig: ToastConfig = {
    // Example override for the "info" type
    info: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#007bff' }}
        text1Style={{ fontSize: 15, fontWeight: '400' }}
      />
    ),
  };

  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}

/**
 * Helper to show a toast:
 * 
 * import { showToast } from './sonner';
 * ...
 * showToast('Hello from RN toast!');
 */
export function showToast(message: string, type: 'info' | 'success' | 'error' = 'info') {
  Toast.show({
    type,
    text1: message,
  });
}
