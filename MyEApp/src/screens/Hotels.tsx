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
  SafeAreaView,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PageSlider from '../components/PageSlider';

// Define types for the data
interface HotelData {
  id: number;
  name: string;
  location: string;
  city: string; // Make sure this field exists
  price_per_night: number;
  rating: number;
  image_url: string;
  amenities: string[];
}

const HotelsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Miami');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);

  // Fetch data using React Query - MODIFIED QUERY
  const { data: hotels, isLoading, error } = useQuery<HotelData[], Error>({
    queryKey: ['resorts', selectedCity],
    queryFn: async () => {
      let query = supabase.from('resorts').select('*').order('rating', { ascending: false });
      
      if (selectedCity) {
        // Change from ilike to eq to match other screens
        query = query.eq('city', selectedCity);
        
        // If that doesn't work, you can try with the location field again as a fallback
        // Uncomment this if the city field doesn't exist in your table
        // query = query.ilike('location', `%${selectedCity}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      // For debugging - log the data to see what's coming back
      console.log('Hotel data:', data);
      
      return data as HotelData[];
    },
  });

  useEffect(() => {
    console.log('Selected city:', selectedCity);
  }, [selectedCity]);

  // Filter hotels by search query
  const filteredHotels = hotels?.filter((hotel) =>
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
  const renderHotelItem = ({ item }: { item: HotelData }) => (
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

  // Add some sample hotels if we don't have any data
  const sampleHotels = [
    {
      id: 1,
      name: "Miami Beachfront Resort",
      location: "Ocean Drive, Miami Beach",
      city: "Miami",
      price_per_night: 299,
      rating: 4.5,
      image_url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      amenities: ["Pool", "Spa", "Ocean View", "Restaurant"]
    },
    {
      id: 2,
      name: "Downtown Miami Suites",
      location: "Brickell Avenue, Miami",
      city: "Miami",
      price_per_night: 199,
      rating: 4.2,
      image_url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      amenities: ["Business Center", "Fitness Center", "Free WiFi"]
    },
    {
      id: 3,
      name: "New York Luxury Hotel",
      location: "5th Avenue, Manhattan",
      city: "New York",
      price_per_night: 499,
      rating: 4.8,
      image_url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      amenities: ["Concierge", "City View", "Spa", "Restaurant"]
    },
    {
      id: 4,
      name: "Brooklyn Boutique Inn",
      location: "Williamsburg, Brooklyn",
      city: "New York",
      price_per_night: 249,
      rating: 4.3,
      image_url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800",
      amenities: ["Rooftop Bar", "Free Breakfast", "Art Gallery"]
    }
  ];

  // Show sample hotels if we don't have any data and there's no error
  const displayHotels = (filteredHotels && filteredHotels.length > 0) 
    ? filteredHotels 
    : (error ? [] : sampleHotels.filter(hotel => hotel.city === selectedCity));

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
            placeholder="Search hotels..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Hotels List */}
        {displayHotels.length > 0 ? (
          <FlatList
            data={displayHotels}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    backgroundColor: '#f3f4f6',
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
  drawerSlider: {
    flex: 1,
  },
  // New styles for vertical sliders
  verticalSliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
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

export default HotelsScreen;