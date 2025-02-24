// components/Toast.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native"; // Ensure you have a React Native–compatible icon

// Toast item type.
export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Context type.
interface ToastContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, "id">) => {
    const id = String(Date.now());
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export interface ToastProps extends ToastItem {
  onClose: () => void;
  children?: ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = "default",
  onClose,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const handleClose = () => {
    // Animate out then call onClose.
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        variant === "destructive" && styles.destructive,
        { opacity },
      ]}
    >
      <View style={styles.toastContent}>
        {title && <Text style={styles.toastTitle}>{title}</Text>}
        {description && <Text style={styles.toastDescription}>{description}</Text>}
        {children}
      </View>
      <TouchableOpacity onPress={handleClose} style={styles.toastClose}>
        <X size={16} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ToastViewport: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return (
    <View style={styles.viewport}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    top: 40,
    right: 20,
    left: 20,
    zIndex: 1000,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  destructive: {
    backgroundColor: "#b91c1c",
  },
  toastContent: {
    flex: 1,
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
  toastClose: {
    padding: 8,
  },
});

// export { ToastProvider, useToast, Toast, ToastViewport };
