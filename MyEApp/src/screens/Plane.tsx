// Plane.tsx (React Native)

import React, { useState } from 'react';
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
 * A simplified "Plane" screen that:
 * - Fetches "flights" from Supabase
 * - Filters by city & search query
 * - Displays a list of flights
 */
const airlineLogos: { [key: string]: string } = {
  'American Airlines':
    'https://images.unsplash.com/photo-1540339832862-46d6a6c50677?w=100&h=100&fit=crop',
  'Delta Airlines':
    'https://images.unsplash.com/photo-1579256945418-f3b7eaa1e26f?w=100&h=100&fit=crop',
  'United Airlines':
    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=100&h=100&fit=crop',
  'JetBlue Airways':
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop',
};

const Plane: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Miami');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch flights using React Query
  const { data: flights, isLoading, error } = useQuery({
    queryKey: ['flights', selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('departure_city', selectedCity)
        .order('departure_time', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Filter flights by airline, flight number, or arrival city
  const filteredFlights = flights?.filter((flight: any) =>
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.arrival_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each flight
  const renderFlightItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.airlineInfo}>
          <Image
            source={{ uri: airlineLogos[item.airline] || '' }}
            style={styles.airlineLogo}
          />
          <View>
            <Text style={styles.airlineName}>{item.airline}</Text>
            <Text style={styles.flightNumber}>Flight #{item.flight_number}</Text>
          </View>
        </View>
        <View style={styles.seatBadge}>
          <Text style={styles.seatBadgeText}>{item.seat_type}</Text>
        </View>
      </View>

      <View style={styles.flightDetails}>
        <View style={styles.cityColumn}>
          <Text style={styles.cityName}>{item.departure_city}</Text>
          <Text style={styles.cityDate}>
            {new Date(item.departure_time).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {/* A simple plane icon or emoji */}
        <Text style={styles.planeIcon}>✈️</Text>
        <View style={styles.cityColumn}>
          <Text style={[styles.cityName, { textAlign: 'right' }]}>
            {item.arrival_city}
          </Text>
          <Text style={[styles.cityDate, { textAlign: 'right' }]}>
            {new Date(item.arrival_time).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.seatType}>{item.seat_type}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => Alert.alert('Booking', `Booking flight #${item.flight_number}`)}
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
        <Text style={styles.errorText}>Error fetching flights: {String(error)}</Text>
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
          placeholder="Search flights..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* For city/year selection, you'd typically use a Picker or separate screens.
         We'll just log selectedCity & selectedYear for now. */}

      <FlatList
        data={filteredFlights}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFlightItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Plane;

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
    elevation: 2,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
    resizeMode: 'cover',
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  flightNumber: {
    color: '#666',
  },
  seatBadge: {
    backgroundColor: '#BFDBFE', // tailwind: bg-blue-200
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  seatBadgeText: {
    color: '#1E3A8A', // text-blue-900
    fontSize: 12,
    fontWeight: 'bold',
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityColumn: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cityDate: {
    fontSize: 12,
    color: '#666',
  },
  planeIcon: {
    fontSize: 24,
    marginHorizontal: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seatType: {
    fontSize: 12,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
