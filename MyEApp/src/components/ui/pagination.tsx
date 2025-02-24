// pagination.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Minimal interface for a pagination item (page number).
 */
interface PageItem {
  label: string; // e.g. '1', '2', '...'
  onPress?: () => void;
  isActive?: boolean;
  isEllipsis?: boolean;
}

interface PaginationProps {
  /** A list of pages or special items (like '...' or 'Next'). */
  pages: PageItem[];
}

/**
 * A minimal “Pagination” in React Native. 
 * Replaces the Radix-based code with a row of buttons.
 */
export function Pagination({ pages }: PaginationProps) {
  return (
    <View style={styles.container} aria-label="pagination">
      {pages.map((page, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.pageButton,
            page.isActive && styles.activeButton,
            page.isEllipsis && styles.ellipsisButton,
          ]}
          onPress={page.onPress}
          disabled={page.isEllipsis}
          accessibilityRole="button"
          accessibilityState={{ selected: !!page.isActive }}
        >
          <Text style={[styles.pageText, page.isEllipsis && styles.ellipsisText]}>
            {page.isEllipsis ? '…' : page.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 2,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  activeButton: {
    backgroundColor: '#ccc',
  },
  ellipsisButton: {
    // if you want to style the ellipsis differently
  },
  pageText: {
    fontSize: 14,
  },
  ellipsisText: {
    // maybe smaller or greyed out
  },
});
