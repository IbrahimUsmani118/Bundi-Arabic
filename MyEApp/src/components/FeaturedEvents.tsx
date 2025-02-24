import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; // adjust the import path as needed
import { Feather } from '@expo/vector-icons';

const FeaturedEvents = () => {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(10); // Increased to show 10 events

      if (error) {
        Alert.alert("Error fetching events", error.message);
        throw error;
      }
      return data;
    }
  });

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {events?.map((event: any) => (
        <View key={event.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: event.image_url || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3' }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${event.price}</Text>
            </View>
          </View>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{event.title}</Text>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Feather name="calendar" size={20} color="#4B5563" />
              <Text style={styles.rowText}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.row}>
              <Feather name="clock" size={20} color="#4B5563" />
              <Text style={styles.rowText}>{formatTime(event.date)}</Text>
            </View>
            <View style={styles.row}>
              <Feather name="map-pin" size={20} color="#4B5563" />
              <Text style={styles.rowText}>{event.location}</Text>
            </View>
            <View style={styles.row}>
              <Feather name="tag" size={20} color="#4B5563" />
              <Text style={styles.rowText}>{event.type}</Text>
            </View>
            <View style={[styles.row, styles.rowBetween]}>
              <View style={styles.row}>
                <Feather name="users" size={20} color="#4B5563" />
                <Text style={styles.rowText}>Limited spots</Text>
              </View>
              {event.rating && (
                <View style={styles.row}>
                  <Feather name="star" size={20} color="#F59E0B" />
                  <Text style={styles.rowText}>{event.rating}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default FeaturedEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  priceText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  cardHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowText: {
    marginLeft: 8,
    color: '#4B5563',
    fontSize: 16,
  },
  rowBetween: {
    justifyContent: 'space-between',
  },
});
