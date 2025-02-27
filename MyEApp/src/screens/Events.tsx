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
  SafeAreaView,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PageSlider from '../components/PageSlider';

// Define types
interface EventData {
  id: number;
  title: string;
  date: string;
  location: string;
  price: number;
  type: string;
  rating?: number;
  image_url?: string;
}

const EventsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Miami');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  // Query: fetch events
  const { data: events, isLoading, error } = useQuery<EventData[], Error>({
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
      return data as EventData[];
    },
  });

  // Debug log
  useEffect(() => {
    console.log('Selected city:', selectedCity);
  }, [selectedCity]);

  // Filter events by search query
  const filteredEvents = events?.filter((evt) =>
    evt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sample data when no events are found
  const sampleEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "2025-07-15T18:00:00",
      location: "Miami Beach Amphitheater",
      price: 85,
      type: "concert",
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
      city: "Miami"
    },
    {
      id: 2,
      title: "Art Basel Exhibition",
      date: "2025-06-05T10:00:00",
      location: "Miami Convention Center",
      price: 45,
      type: "exhibition",
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
      city: "Miami"
    },
    {
      id: 3,
      title: "Broadway Musical - Hamilton",
      date: "2025-05-22T19:30:00",
      location: "Richard Rodgers Theatre",
      price: 120,
      type: "theater",
      rating: 4.9,
      image_url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf",
      city: "New York"
    },
    {
      id: 4,
      title: "Central Park Summer Concert",
      date: "2025-08-10T17:00:00",
      location: "Central Park Great Lawn",
      price: 30,
      type: "concert",
      rating: 4.6,
      image_url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec",
      city: "New York"
    }
  ];

  // Display events - use sample data if no events found
  const displayEvents = (filteredEvents && filteredEvents.length > 0)
    ? filteredEvents
    : (error ? [] : sampleEvents.filter(event => event.city === selectedCity));

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
  const handlePurchase = (evt: EventData) => {
    Alert.alert(
      'Ticket Reserved!',
      `You've reserved a ticket for ${evt.title}. Total: $${evt.price}`
    );
  };

  const renderEventItem = ({ item }: { item: EventData }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      {/* MOBILE NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setShowLeftDrawer(true)}
        >
          <Text style={styles.navButtonText}>Cities</Text>
        </TouchableOpacity>
        
        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}></Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={12} color="#2196F3" />
            <Text style={styles.locationText}>{selectedCity}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setShowRightDrawer(true)}
        >
          <Text style={styles.navButtonText}>Years</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Horizontal PageSlider for navigation */}
        <View style={styles.horizontalSliderContainer}>
          <PageSlider orientation="horizontal" />
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchRow}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* List of events */}
        {displayEvents.length > 0 ? (
          <FlatList
            data={displayEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderEventItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No events found for "{selectedCity}"
            </Text>
          </View>
        )}
      </View>
      
      {/* MOBILE LEFT DRAWER (Cities) */}
      <Modal
        visible={showLeftDrawer}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLeftDrawer(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leftDrawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Select City</Text>
              <TouchableOpacity
                onPress={() => setShowLeftDrawer(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.verticalSliderWrapper}>
              <View style={styles.cityLabels}>
                {[
                  { name: "Miami", value: 0 },
                  { name: "New York", value: 100 },
                ].map((city) => (
                  <TouchableOpacity
                    key={city.name}
                    onPress={() => {
                      setSelectedCity(city.name);
                      // Don't automatically close the drawer
                    }}
                  >
                    <Text style={[
                      styles.cityLabel,
                      selectedCity === city.name && styles.selectedCityLabel
                    ]}>
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.sliderContainer}>
                <PageSlider
                  orientation="vertical"
                  type="cities"
                  initialCity={selectedCity}
                  onCityChange={(city) => {
                    setSelectedCity(city);
                    // Don't close the drawer automatically
                  }}
                  showCityContent={false}
                  style={styles.verticalSlider}
                />
              </View>
            </View>

            {/* Done button for closing drawer */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowLeftDrawer(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowLeftDrawer(false)}
          ></TouchableOpacity>
        </View>
      </Modal>
      
      {/* MOBILE RIGHT DRAWER (Years) */}
      <Modal
        visible={showRightDrawer}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRightDrawer(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowRightDrawer(false)}
          ></TouchableOpacity>
          
          <View style={styles.rightDrawer}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity
                onPress={() => setShowRightDrawer(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>Select Year</Text>
            </View>
            
            <View style={styles.verticalSliderWrapper}>
              <View style={styles.yearLabels}>
                {[
                  { name: "2020", value: 0 },
                  { name: "2021", value: 20 },
                  { name: "2022", value: 40 },
                  { name: "2023", value: 60 },
                  { name: "2024", value: 80 },
                  { name: "2025", value: 100 }
                ].map((year) => (
                  <TouchableOpacity
                    key={year.name}
                    onPress={() => {
                      setSelectedYear(parseInt(year.name));
                      // Don't automatically close
                    }}
                  >
                    <Text style={[
                      styles.yearLabel,
                      selectedYear === parseInt(year.name) && styles.selectedYearLabel
                    ]}>
                      {year.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.sliderContainer}>
                <PageSlider
                  orientation="vertical"
                  type="years"
                  onYearChange={(year) => {
                    setSelectedYear(year);
                    // Don't close drawer on selection
                  }}
                  showYearContent={false}
                  style={styles.verticalSlider}
                />
              </View>
            </View>
            
            {/* Done button for closing drawer */}
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowRightDrawer(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navButton: {
    backgroundColor: '#E5E5E5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  navButtonText: {
    fontSize: 14,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
  },
  horizontalSliderContainer: {
    width: '100%',
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
    marginHorizontal: 16,
    marginVertical: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listContent: {
    paddingHorizontal: 16,
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
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  leftDrawer: {
    width: 250,
    backgroundColor: 'white',
    height: '100%',
  },
  rightDrawer: {
    width: 250,
    backgroundColor: 'white',
    height: '100%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  // New styles for vertical sliders - removed the container style
  verticalSliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  cityLabels: {
    height: 300,
    marginRight: 20,
    justifyContent: 'space-between',
  },
  cityLabel: {
    fontSize: 16,
    color: '#666',
    paddingVertical: 10,
  },
  selectedCityLabel: {
    fontWeight: 'bold',
    color: '#2196F3',
  },

  navTitleContainer: {
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  yearLabels: {
    height: 300,
    marginRight: 20,
    justifyContent: 'space-between',
  },
  yearLabel: {
    fontSize: 16, 
    color: '#666',
    paddingVertical: 8,
  },
  selectedYearLabel: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  sliderContainer: {
    height: 300,
    width: 40,
    marginLeft: 20,
  },
  verticalSlider: {
    height: 300,
  },
  doneButton: {
    backgroundColor: '#2196F3',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventsScreen;