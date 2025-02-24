// Events.tsx (React Native)

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
 * A simplified "Events" screen that:
 * - Fetches "events" from Supabase
 * - Filters by city and search text
 * - Displays a list of events
 * - Removes references to custom Card, Input, Button, and PageSlider
 */
const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Miami');

  // Query: fetch events
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (selectedCity) {
        query = query.eq('city', selectedCity);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Debug log
  useEffect(() => {
    console.log('Selected city:', selectedCity);
  }, [selectedCity]);

  // Filter events by search query
  const filteredEvents = events?.filter((evt: any) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Basic placeholder icon logic
  function getEventIcon(type: string) {
    if (!type) return '🎟';
    switch (type.toLowerCase()) {
      case 'concert':
        return '🎵';
      case 'theater':
        return '🎭';
      default:
        return '🎟';
    }
  }

  // Instead of a toast, we'll use Alert
  const handlePurchase = (evt: any) => {
    Alert.alert(
      'Ticket Reserved!',
      `You've reserved a ticket for ${evt.title}. Total: $${evt.price}`
    );
  };

  const renderEventItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image_url
              ? item.image_url
              : 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
          }}
          style={styles.image}
        />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.icon}>{getEventIcon(item.type)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date: </Text>
          <Text style={styles.value}>
            {new Date(item.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Location: </Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>

        {item.rating && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rating: </Text>
            <Text style={styles.value}>{item.rating.toFixed(1)} / 5</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchase(item)}
        >
          <Text style={styles.purchaseButtonText}>Purchase Ticket</Text>
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
          Error fetching events: {String(error)}
        </Text>
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
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* For City selection, you could add a <Picker> or other UI.
          We'll skip that for now and just log 'selectedCity'. */}

      {/* List of events */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEventItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Events;

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
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContent: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  icon: {
    fontSize: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
  },
  purchaseButton: {
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});