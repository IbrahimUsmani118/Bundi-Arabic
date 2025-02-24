// carousel.tsx
import React, { useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

interface CarouselProps {
  data: any[]; // Or a more specific type
  renderItem: ({ item }: { item: any }) => JSX.Element;
  itemWidth?: number;
  itemHeight?: number;
}

/**
 * A minimal horizontal carousel using FlatList.
 * For advanced features (snapping, infinite scroll),
 * use a specialized library like react-native-snap-carousel.
 */
export function Carousel({ data, renderItem, itemWidth, itemHeight }: CarouselProps) {
  const flatListRef = useRef<FlatList<any>>(null);

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const handlePrev = () => {
    // Move one item backward if possible
    // This approach is simplistic; for better control, track the current index
    // or use onScroll to find current item, then do index - 1.
    scrollToIndex(0); // Example: scroll to the first item
  };

  const handleNext = () => {
    // Move one item forward
    scrollToIndex(data.length - 1); // Example: scroll to the last item
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        // For a “carousel” feel, you might set pagingEnabled or snapToAlignment
        pagingEnabled={false}
      />
      {/* Minimal prev/next buttons */}
      <TouchableOpacity style={[styles.button, styles.prev]} onPress={handlePrev}>
        <Text style={styles.buttonText}>{'<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.next]} onPress={handleNext}>
        <Text style={styles.buttonText}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 16,
  },
  prev: {
    left: 10,
  },
  next: {
    right: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
