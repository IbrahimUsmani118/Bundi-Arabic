// Hotels.tsx (React Native)

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; // Adjust the path
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

/**
 * A simplified "Hotels" screen that:
 * - Fetches "resorts" from Supabase
 * - Filters by city and search text
 * - Displays a list of hotels
 * - Removes references to custom Card, Button, Input, PageSlider, etc.
 */
const Hotels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Miami');

  // Fetch data using React Query
  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['resorts', selectedCity],
    queryFn: async () => {
      let query = supabase.from('resorts').select('*').order('rating', { ascending: false });
      if (selectedCity) {
        // .ilike("location", `%${selectedCity}%`) in supabase
        query = query.ilike('location', `%${selectedCity}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    console.log('Selected city:', selectedCity);
  }, [selectedCity]);

  // Filter hotels by search query
  const filteredHotels = hotels?.filter((hotel: any) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Basic "toast" replacement using Alert
  const handlePurchase = (hotelName: string, price: number) => {
    Alert.alert(
      'Booking Initiated',
      `Processing booking for ${hotelName} at $${price}/night`
    );
  };

  // Example star rendering
  function renderStars(rating: number | null) {
    if (!rating) return null;
    return [...Array(5)].map((_, index) => {
      const isFilled = index < Math.floor(rating);
      // You could use a text star (★) or a vector icon from an RN icon library
      return (
        <Text
          key={index}
          style={[styles.star, isFilled ? styles.starFilled : styles.starEmpty]}
        >
          ★
        </Text>
      );
    });
  }

  // Render each hotel item
  const renderHotelItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image_url
              ? item.image_url
              : 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
          }}
          style={styles.image}
        />
        {item.price_per_night && (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${item.price_per_night}</Text>
            <Text style={styles.nightText}>/night</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
          {item.rating && (
            <Text style={styles.ratingValue}>{item.rating.toFixed(1)} / 5</Text>
          )}
        </View>

        {/* Amenities */}
        {item.amenities?.length ? (
          <View style={styles.amenitiesContainer}>
            {item.amenities.map((amenity: string, index: number) => (
              <Text key={index} style={styles.amenity}>
                {amenity}
              </Text>
            ))}
          </View>
        ) : null}

        {/* Book Button */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handlePurchase(item.name, item.price_per_night || 0)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.errorText}>Error fetching hotels: {String(error)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* For city selection, you'd typically use a Picker or other UI element.
         This example just logs 'selectedCity'. */}

      {/* Hotels List */}
      {filteredHotels && filteredHotels.length > 0 ? (
        <FlatList
          data={filteredHotels}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHotelItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No hotels found for "{selectedCity}"
          </Text>
        </View>
      )}
    </View>
  );
};

export default Hotels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // tailwind: bg-gray-50
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    color: '#aaa',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  priceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 4,
  },
  nightText: {
    fontSize: 12,
    color: '#666',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700', // gold
  },
  starEmpty: {
    color: '#ccc',
  },
  ratingValue: {
    fontSize: 14,
    color: '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  amenity: {
    backgroundColor: '#f3f4f6', // tailwind: bg-gray-100
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    color: '#333',
    marginRight: 6,
    marginBottom: 6,
  },
  bookButton: {
    marginTop: 8,
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#444',
  },
});
