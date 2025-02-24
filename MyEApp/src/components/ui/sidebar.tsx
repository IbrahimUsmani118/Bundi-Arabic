// sidebar.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ViewStyle,
  ScrollView,
  SafeAreaView,
} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // If you want to persist open state

/**
 * Example usage:
 *
 *   <SidebarProvider defaultOpen={true}>
 *     <View style={{ flex: 1 }}>
 *       <SidebarTrigger />
 *       <Sidebar side="left">
 *         <SidebarContent>
 *           <Text>Sidebar content</Text>
 *         </SidebarContent>
 *       </Sidebar>
 *       <MainContent />
 *     </View>
 *   </SidebarProvider>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Context & Hooks
// ─────────────────────────────────────────────────────────────────────────────

type SidebarContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a <SidebarProvider>.');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Provider
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProviderProps {
  /** If you want a default open state on mount. */
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  children,
}: SidebarProviderProps) {
  const [open, setOpen] = useState(defaultOpen);

  // If you want to store in AsyncStorage, do something like:
  /*
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('sidebarOpen');
      if (stored !== null) {
        setOpen(stored === 'true');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('sidebarOpen', String(open));
  }, [open]);
  */

  const toggleSidebar = () => setOpen((prev) => !prev);

  const value: SidebarContextProps = {
    open,
    setOpen,
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. “Sidebar” component
//    - On mobile, uses a modal
//    - On larger screens, is a left or right panel
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarProps {
  side?: 'left' | 'right';
  children?: React.ReactNode;
  /** Optional style override. */
  style?: ViewStyle;
}

export function Sidebar({ side = 'left', style, children }: SidebarProps) {
  const { open, setOpen } = useSidebar();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768; // e.g. treat <768 as “mobile”

  // For mobile, use a modal
  if (isMobile) {
    return (
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
        <SafeAreaView
          style={[
            styles.sidebarModal,
            side === 'left' ? { left: 0 } : { right: 0 },
            style,
          ]}
        >
          <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }

  // On larger screens, just a fixed panel on the left or right
  if (!open) {
    // If closed, skip rendering or render a “collapsed” style
    return null;
  }

  return (
    <View
      style={[
        styles.sidebarDesktop,
        side === 'left' ? { left: 0 } : { right: 0 },
        style,
      ]}
    >
      <ScrollView style={{ flex: 1 }}>{children}</ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Trigger button that toggles the sidebar
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarTriggerProps {
  label?: string;
  /** Additional style. */
  style?: ViewStyle;
}

export function SidebarTrigger({ label = 'Toggle Sidebar', style }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <TouchableOpacity
      style={[styles.triggerButton, style]}
      onPress={toggleSidebar}
    >
      <Text style={styles.triggerButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Optional sub-components for structure
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarContentProps {
  children?: React.ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
  return <View style={{ padding: 16 }}>{children}</View>;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Minimal Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    // Fullscreen black overlay
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebarModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 240,
    backgroundColor: '#fff',
  },
  sidebarDesktop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 240,
    backgroundColor: '#fff',
    // Example shadow:
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  triggerButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
    alignSelf: 'flex-start',
    margin: 10,
  },
  triggerButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
