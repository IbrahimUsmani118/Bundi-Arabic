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
  SafeAreaView,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PageSlider from '../components/PageSlider';

// Define types
interface FlightData {
  id: number;
  airline: string;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  seat_type: string;
}

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

const PlaneScreen: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Miami');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  // Fetch flights using React Query
  const { data: flights, isLoading, error } = useQuery<FlightData[], Error>({
    queryKey: ['flights', selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('departure_city', selectedCity)
        .order('departure_time', { ascending: true });
      if (error) throw error;
      
      console.log('Flight data:', data);
      return data as FlightData[];
    },
  });

  // Sample flight data
  const sampleFlights = [
    {
      id: 1,
      airline: "American Airlines",
      flight_number: "AA123",
      departure_city: "Miami",
      arrival_city: "Los Angeles",
      departure_time: "2025-06-15T08:30:00",
      arrival_time: "2025-06-15T11:45:00",
      price: 329,
      seat_type: "Economy"
    },
    {
      id: 2,
      airline: "Delta Airlines",
      flight_number: "DL456",
      departure_city: "Miami",
      arrival_city: "Chicago",
      departure_time: "2025-06-16T10:15:00",
      arrival_time: "2025-06-16T12:30:00",
      price: 275,
      seat_type: "Premium Economy"
    },
    {
      id: 3,
      airline: "United Airlines",
      flight_number: "UA789",
      departure_city: "New York",
      arrival_city: "San Francisco",
      departure_time: "2025-06-20T07:45:00",
      arrival_time: "2025-06-20T11:15:00",
      price: 425,
      seat_type: "Business"
    },
    {
      id: 4,
      airline: "JetBlue Airways",
      flight_number: "B6101",
      departure_city: "New York",
      arrival_city: "Boston",
      departure_time: "2025-06-22T14:30:00",
      arrival_time: "2025-06-22T15:45:00",
      price: 189,
      seat_type: "Economy"
    }
  ];

  // Filter flights by airline, flight number, or arrival city
  const filteredFlights = flights?.filter((flight) =>
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.arrival_city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Display flights - use sample data if no flights found
  const displayFlights = (filteredFlights && filteredFlights.length > 0)
    ? filteredFlights
    : (error ? [] : sampleFlights.filter(flight => flight.departure_city === selectedCity));

  // Render each flight
  const renderFlightItem = ({ item }: { item: FlightData }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      {/* MOBILE NAVBAR */}
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
            placeholder="Search flights..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {displayFlights.length > 0 ? (
          <FlatList
            data={displayFlights}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderFlightItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No flights found for "{selectedCity}"
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
  // New styles for vertical sliders - removed box style
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

export default PlaneScreen;