
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface AccordionItemProps {
  title: string;
  children?: React.ReactNode; // or string if you only pass text
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen(!open);

  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.trigger} onPress={toggle}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.icon, open && styles.iconOpen]}>▼</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.content}>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 4,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  icon: {
    transform: [{ rotate: '0deg' }],
    fontSize: 16,
  },
  iconOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    paddingVertical: 8,
    paddingLeft: 4,
  },
});
