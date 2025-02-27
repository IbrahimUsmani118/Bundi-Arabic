import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Text as RNText } from 'react-native'; // Ensure Text is imported correctly
import { Feather, AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase'; // Adjust this path based on your project structure
import PageSlider from '../components/PageSlider.tsx';

// Define cities and years data for the sliders
const cities = [
  { name: "Miami", value: 0 },
  { name: "New York", value: 100 },
];

const years = [
  { name: "2020", value: 0 },
  { name: "2021", value: 20 },
  { name: "2022", value: 40 },
  { name: "2023", value: 60 },
  { name: "2024", value: 80 },
  { name: "2025", value: 100 },
];

// Define types for the data
interface ServiceType {
  value: string;
  label: string;
}

interface BeautyService {
  id: number;
  name: string;
  provider: string;
  service_type: string;
  city: string;
  price: number;
  duration: string;
  rating: number;
  image_url: string | null;
}

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

// Toast notification component
const Toast: React.FC<ToastProps> = ({ visible, message, type, onDismiss }) => {
  if (!visible) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  return (
    <View style={[styles.toast, type === 'error' ? styles.errorToast : styles.successToast]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const BeautyScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('Miami');
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, message: '', type: 'success' });

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);

  // Service types for dropdown
  const serviceTypes: ServiceType[] = [
    { value: 'all', label: 'All Services' },
    { value: 'women_haircut', label: 'Women\'s Haircuts' },
    { value: 'men_haircut', label: 'Men\'s Haircuts' },
    { value: 'nail_service', label: 'Nail Services' },
  ];

  // Fetch data from Supabase
  const { data: services, error } = useQuery<BeautyService[], Error>({
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
      
      if (error) {
        showToast('Error fetching beauty services', 'error');
        throw error;
      }
      
      return data as BeautyService[];
    },
  });

  useEffect(() => {
    if (error) {
      showToast(`Error: ${error.message}`, 'error');
    }
  }, [error]);

  const showToast = (message: string, type: 'success' | 'error' = 'success'): void => {
    setToast({ visible: true, message, type });
  };

  const hideToast = (): void => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handlePurchase = (serviceName: string, price: number): void => {
    showToast(`Processing booking for ${serviceName} at $${price}`);
  };

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'all' || service.service_type === selectedType;
    return matchesSearch && matchesType;
  });

  const renderServiceCard = ({ item }: { item: BeautyService }): React.ReactElement => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035'
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardProvider}>{item.provider}</Text>
        <Text style={styles.cardCity}>{item.city}</Text>
        <Text style={styles.cardDuration}>{item.duration}</Text>
        
        {item.rating && (
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color="#FFD700" />
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Toast notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
      
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
      
      <LinearGradient
        colors={['#F5F5F5', '#E5E5E5']}
        style={styles.gradientBackground}
      >
        <View style={styles.mainContent}>
          {/* Horizontal PageSlider for navigation */}
          <View style={styles.horizontalSliderContainer}>
            <PageSlider orientation="horizontal" />
          </View>
          
          {/* Search & Filter */}
          <View style={styles.searchFilterContainer}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search beauty services..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowTypeSelector(true)}
            >
              <Text style={styles.filterButtonText}>
                {serviceTypes.find(t => t.value === selectedType)?.label || 'Filter'}
              </Text>
              <Feather name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Services List */}
          {filteredServices && filteredServices.length > 0 ? (
            <FlatList<BeautyService>
              data={filteredServices}
              renderItem={renderServiceCard}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {services ? 'No services match your search' : 'Loading services...'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
      
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
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city.name}
                    onPress={() => {
                      setSelectedCity(city.name);
                      // Don't automatically close the drawer
                      // This allows the user to see the selection and manually close when ready
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
                    // setShowLeftDrawer(false); <- Remove or keep commented out
                  }}
                  showCityContent={false}
                  style={styles.verticalSlider}
                />
              </View>
            </View>

            {/* Add a Done button for the user to manually close after selecting */}
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
                {years.map((year) => (
                  <TouchableOpacity 
                    key={year.name}
                    onPress={() => {
                      // You can handle year selection here if needed
                      setShowRightDrawer(false);
                    }}
                  >
                    <Text style={styles.yearLabel}>{year.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.sliderContainer}>
                <PageSlider
                  orientation="vertical"
                  type="years"
                  showYearContent={false}
                  style={styles.verticalSlider}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Service Type Selector Modal */}
      <Modal
        visible={showTypeSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTypeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.typeSelector}>
            <Text style={styles.typeSelectorTitle}>Select Service Type</Text>
            {serviceTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  selectedType === type.value && styles.selectedTypeOption
                ]}
                onPress={() => {
                  setSelectedType(type.value);
                  setShowTypeSelector(false);
                }}
              >
                <Text style={[
                  styles.typeOptionText,
                  selectedType === type.value && styles.selectedTypeOptionText
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowTypeSelector(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowTypeSelector(false)}
          ></TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gradientBackground: {
    flex: 1,
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
  searchFilterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardProvider: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  cardCity: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  cardDuration: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666666',
  },
  bookButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
  drawerContent: {
    flex: 1,
    paddingVertical: 10,
  },
  // New styles for vertical sliders
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
  sliderContainer: {
    height: 300,
    width: 40,
    marginLeft: 20,
  },
  verticalSlider: {
    height: 300,
  },
  typeSelector: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  typeSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTypeOption: {
    backgroundColor: '#E3F2FD',
  },
  typeOptionText: {
    fontSize: 16,
  },
  selectedTypeOptionText: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  toast: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    zIndex: 1000,
    alignItems: 'center',
  },
  successToast: {
    backgroundColor: '#4CAF50',
  },
  errorToast: {
    backgroundColor: '#F44336',
  },
  toastText: {
    color: 'white',
    fontWeight: '500',
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
  // Added styles for the Done button
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

export default BeautyScreen;