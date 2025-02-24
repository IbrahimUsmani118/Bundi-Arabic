// Travel.tsx (React Native)
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; // Adjust path as needed
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

/**
 * A simplified "Travel" screen that:
 * - Fetches up to 6 "events" from Supabase
 * - Displays them in a scrollable list
 */
function Travel() {
  // React Query fetch
  const {
    data: destinations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(6);

      if (error) {
        // Instead of toast, show an Alert (or use a RN toast library)
        Alert.alert('Error fetching destinations', error.message);
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching destinations: {String(error)}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* If you want to replicate PageSlider, 
          you could use a library like react-native-snap-carousel or a custom slider. */}
      <View style={styles.content}>
        {destinations?.map((destination: any) => (
          <View key={destination.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    destination.image_url ||
                    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.title}>{destination.title}</Text>
              <Text style={styles.location}>{destination.location}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>${destination.price}</Text>
                {destination.rating && (
                  <View style={styles.ratingRow}>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.ratingValue}>
                      {destination.rating}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default Travel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // tailwind: bg-gray-50
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2, // adds a subtle shadow on Android
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700', // gold
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    color: '#333',
  },
});