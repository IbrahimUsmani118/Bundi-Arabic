// Rentals.tsx (React Native)
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; // Adjust path
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
 * A simplified "Rentals" screen that:
 * - Fetches "rentals" from Supabase
 * - Filters by city & search text
 * - Provides fallback image/price logic in getRentalData
 */
const Rentals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Miami');

  useEffect(() => {
    console.log('Selected city:', selectedCity);
  }, [selectedCity]);

  // React Query: fetch "rentals"
  const { data: rentals, isLoading, error } = useQuery({
    queryKey: ['rentals', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('rentals')
        .select('*')
        .eq('type', 'car')
        .order('rating', { ascending: false });

      if (selectedCity) {
        query = query.ilike('store_location', `%${selectedCity}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Filter rentals by name
  const filteredRentals = rentals?.filter((rental: any) =>
    rental.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If the DB rental has no image/price, fallback logic
  const getRentalData = (index: number) => {
    if (
      selectedCity.toLowerCase() === 'ny' ||
      selectedCity.toLowerCase() === 'new york'
    ) {
      const rentalDataNY = [
        {
          image:
            'https://unsplash.com/photos/blue-coupe-beside-gray-house-p7tai9P7H-s',
          price: 50,
        },
        {
          image:
            'https://unsplash.com/photos/orange-audi-coupe-parked-on-gray-concrete-road-GRV4ypBKgxE',
          price: 70,
        },
      ];
      return rentalDataNY[index % rentalDataNY.length];
    } else if (selectedCity.toLowerCase() === 'miami') {
      return {
        image:
          'https://unsplash.com/photos/red-ferrari-458-italia-on-gray-asphalt-road-79-SQCseV08',
        price: 45,
      };
    }
    // Fallback for other cities
    return {
      image:
        'https://unsplash.com/photos/red-ferrari-458-italia-on-gray-asphalt-road-79-SQCseV08',
      price: 45,
    };
  };

  // "Toast" replacement: use Alert
  const handleRent = (rental: any) => {
    if (!rental.available) {
      Alert.alert('Not Available', 'This vehicle is currently not available.');
      return;
    }
    Alert.alert(
      'Reservation Successful!',
      `You have successfully reserved the ${rental.name}. We'll contact you shortly with next steps.`
    );
  };

  // Render each rental item
  const renderRentalItem = ({ item, index }: { item: any; index: number }) => {
    const { image, price } = getRentalData(index);
    const finalPrice = item.price_per_day || price;
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.image_url || image,
            }}
            style={styles.image}
          />
          {finalPrice && (
            <View style={styles.priceBadge}>
              <Text style={styles.priceText}>${finalPrice}</Text>
              <Text style={styles.perDayText}>/day</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.location}>{item.store_location}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[...Array(5)].map((_, i) => {
              const isFilled = i < Math.floor(item.rating ?? 0);
              return (
                <Text key={i} style={[styles.star, isFilled ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              );
            })}
            {item.rating !== null && (
              <Text style={styles.ratingValue}>
                {item.rating?.toFixed(1)} / 5
              </Text>
            )}
          </View>

          {/* Type & Availability */}
          <View style={styles.infoRow}>
            <Text style={styles.iconPlaceholder}>🚗</Text>
            <Text style={styles.infoText}>{item.type}</Text>
          </View>
          <View style={styles.infoRow}>
            {item.available ? (
              <Text style={[styles.availability, { color: 'green' }]}>Available</Text>
            ) : (
              <Text style={[styles.availability, { color: 'red' }]}>Not Available</Text>
            )}
          </View>

          {/* Rent Button */}
          <TouchableOpacity
            style={[styles.rentButton, !item.available && styles.rentButtonDisabled]}
            onPress={() => handleRent(item)}
            disabled={!item.available}
          >
            <Text style={styles.rentButtonText}>
              {item.available ? 'Rent Now' : 'Not Available'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <Text style={styles.errorText}>Error fetching rentals: {String(error)}</Text>
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
          placeholder="Search rentals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* For city selection, you could use a Picker or a separate screen. */}
      {/* We simply log 'selectedCity' in the console. */}

      {filteredRentals && filteredRentals.length > 0 ? (
        <FlatList
          data={filteredRentals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRentalItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No rentals found for "{selectedCity}"
          </Text>
        </View>
      )}
    </View>
  );
};

export default Rentals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // tailwind: bg-gray-50
    padding: 16,
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
  perDayText: {
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
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#ccc',
  },
  ratingValue: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconPlaceholder: {
    fontSize: 18,
    marginRight: 4,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
  },
  availability: {
    fontSize: 14,
    fontWeight: '600',
  },
  rentButton: {
    marginTop: 8,
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rentButtonDisabled: {
    backgroundColor: '#555',
  },
  rentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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