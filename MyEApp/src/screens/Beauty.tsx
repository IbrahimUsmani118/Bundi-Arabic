// Beauty.tsx (React Native)

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; 
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
 * A simplified "Beauty" screen that:
 * - Fetches "beauty_services" from Supabase
 * - Filters by city and search text
 * - Shows a basic list of services
 * - Replaces web UI components with React Native equivalents
 */
const Beauty: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState('Miami');

  // Query: fetch beauty_services
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['beauty_services', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('beauty_services')
        .select('*')
        .order('rating', { ascending: false });

      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Basic "toast" replacement using an Alert (for demonstration).
  const handlePurchase = (serviceName: string, price: number) => {
    Alert.alert(
      'Booking Initiated',
      `Processing booking for ${serviceName} at $${price}`
    );
  };

  // Filter logic
  const filteredServices = services?.filter((service: any) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || service.service_type === selectedType;
    return matchesSearch && matchesType;
  });

  // Render each service in a list
  const renderServiceItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image_url
              ? item.image_url
              : 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          }}
          style={styles.image}
        />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtext}>{item.provider}</Text>
        <Text style={styles.subtext}>{item.city}</Text>
        <Text style={styles.subtext}>{item.duration}</Text>

        {/* Example rating */}
        {item.rating && (
          <View style={styles.ratingRow}>
            {/* Replace with an icon library if desired */}
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>
              {item.rating.toFixed(1)} / 5
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handlePurchase(item.name, item.price || 0)}
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
        <Text style={styles.errorText}>
          Error fetching beauty services: {String(error)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        {/* For icons, use an icon library or a simple placeholder text. */}
        <Text style={styles.searchIcon}>🔍</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search beauty services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Example type selection (no dropdown). 
         For a real picker, use <Picker> or a library like @react-native-picker/picker. */}
      <View style={styles.typeRow}>
        <TouchableOpacity onPress={() => setSelectedType('all')}>
          <Text style={[styles.typeButton, selectedType === 'all' && styles.typeButtonActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedType('women_haircut')}>
          <Text
            style={[
              styles.typeButton,
              selectedType === 'women_haircut' && styles.typeButtonActive,
            ]}
          >
            Women's Haircuts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedType('men_haircut')}>
          <Text
            style={[
              styles.typeButton,
              selectedType === 'men_haircut' && styles.typeButtonActive,
            ]}
          >
            Men's Haircuts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedType('nail_service')}>
          <Text
            style={[
              styles.typeButton,
              selectedType === 'nail_service' && styles.typeButtonActive,
            ]}
          >
            Nail Services
          </Text>
        </TouchableOpacity>
      </View>

      {/* List of services */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderServiceItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Beauty;

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
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  typeRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  typeButton: {
    color: '#666',
    fontSize: 14,
    padding: 6,
  },
  typeButtonActive: {
    color: '#000',
    fontWeight: 'bold',
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
    height: 180,
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  star: {
    color: '#FFD700',
    fontSize: 20,
    marginRight: 4,
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
  },
  bookButton: {
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
