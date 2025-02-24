
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

/**
 * The main Breadcrumb container. Typically just a row or column of items.
 */
export function Breadcrumb({ children }: { children?: React.ReactNode }) {
  return <View style={styles.breadcrumbContainer}>{children}</View>;
}

/**
 * A list wrapper for breadcrumb items. In RN, you can just place items directly,
 * but we'll mimic your "BreadcrumbList" concept with a <View>.
 */
export function BreadcrumbList({ children }: { children?: React.ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

/**
 * A single breadcrumb item. Usually some text or a link.
 */
export function BreadcrumbItem({ children }: { children?: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

/**
 * A link within the breadcrumb, typically a <TouchableOpacity> or text.
 */
export function BreadcrumbLink({
  onPress,
  children,
}: {
  onPress?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

/**
 * A text-only "current page" item (not clickable).
 */
export function BreadcrumbPage({ children }: { children?: React.ReactNode }) {
  return <Text style={styles.current}>{children}</Text>;
}

/**
 * A separator between breadcrumb items. Could be a text or an icon.
 */
export function BreadcrumbSeparator({
  separator = '>',
}: {
  separator?: string;
}) {
  return <Text style={styles.separator}>{separator}</Text>;
}

/**
 * An ellipsis to indicate "More" items. For advanced usage, you could do a modal or menu.
 */
export function BreadcrumbEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <Text style={styles.ellipsisText}>...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumbContainer: {
    // Container for the entire breadcrumb
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    color: '#007AFF',
    paddingHorizontal: 4,
  },
  current: {
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  separator: {
    paddingHorizontal: 2,
    color: '#999',
  },
  ellipsis: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsisText: {
    fontSize: 16,
  },
});
