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
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import PageSlider from '../components/PageSlider';

const cities = [
  { name: 'Mumbai', value: 0 },
  { name: 'New Delhi', value: 100 },
];

const years = [
  { name: '2020', value: 0 },
  { name: '2021', value: 20 },
  { name: '2022', value: 40 },
  { name: '2023', value: 60 },
  { name: '2024', value: 80 },
  { name: '2025', value: 100 },
];

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

type ToastState = {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
};

const Toast: React.FC<ToastProps> = ({ visible, message, type, onDismiss }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <View style={[styles.toast, type === 'error' ? styles.errorToast : styles.successToast]}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

const BeautyScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'success' });

  const [showLeftDrawer, setShowLeftDrawer] = useState<boolean>(false);
  const [showRightDrawer, setShowRightDrawer] = useState<boolean>(false);
  const [showTypeSelector, setShowTypeSelector] = useState<boolean>(false);

  const serviceTypes: ServiceType[] = [
    { value: 'all', label: 'All Services' },
    { value: 'women_haircut', label: "Women's Haircut" },
    { value: 'men_haircut', label: "Men's Haircut" },
    { value: 'nail_service', label: 'Nail Services' },
  ];

  // Utility functions for Toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Fetch beauty services data from Supabase
  const { data: services, error } = useQuery<BeautyService[], Error>({
    queryKey: ['beauty_services', selectedCity],
    queryFn: async () => {
      let query = supabase
        .from('beauty_services')
        .select('*')
        .order('rating', { ascending: false });

      if (selectedCity) {
        query = query.eq('city', selectedCity === 'Mumbai' ? 'Mumbai' : 'New Delhi');
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

  // Simulate booking process
  const handlePurchase = (serviceName: string, price: number) => {
    showToast(`Booking in progress: ${serviceName} (${price} rupees)`);
  };

  // Filter services by search query and selected service type
  const filteredServices = services?.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || service.service_type === selectedType;
    return matchesSearch && matchesType;
  });

  // Render each service card
  const renderServiceCard = ({ item }: { item: BeautyService }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.image_url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035',
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{item.price}</Text>
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
            <Text style={styles.ratingText}>{item.rating.toFixed(1)} / 5</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => handlePurchase(item.name, item.price)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Toast for messages */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onDismiss={hideToast} />

      {/* Mobile Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setShowLeftDrawer(true)}>
          <Text style={styles.navButtonText}>City</Text>
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle} />
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={12} color="#2196F3" />
            <Text style={styles.locationText}>{selectedCity}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={() => setShowRightDrawer(true)}>
          <Text style={styles.navButtonText}>Year</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <LinearGradient colors={['#F5F5F5', '#E5E5E5']} style={styles.gradientBackground}>
        <View style={styles.mainContent}>
          <View style={styles.horizontalSliderContainer}>
            <PageSlider orientation="horizontal" />
          </View>

          {/* Search and Filter */}
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

            <TouchableOpacity style={styles.filterButton} onPress={() => setShowTypeSelector(true)}>
              <Text style={styles.filterButtonText}>
                {serviceTypes.find((t) => t.value === selectedType)?.label || 'Filter Service'}
              </Text>
              <Feather name="chevron-down" size={16} color="#333" />
            </TouchableOpacity>
          </View>

          {/* List of Services */}
          {filteredServices && filteredServices.length > 0 ? (
            <FlatList
              data={filteredServices}
              renderItem={renderServiceCard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {services ? 'No results found' : 'Loading...'}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Left Drawer (City Selector) */}
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
              <TouchableOpacity onPress={() => setShowLeftDrawer(false)} style={styles.closeButton}>
                <Feather name="x" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.verticalSliderWrapper}>
              <View style={styles.cityLabels}>
                {cities.map((city) => (
                  <TouchableOpacity
                    key={city.name}
                    onPress={() => setSelectedCity(city.name)}
                  >
                    <Text
                      style={[styles.cityLabel, selectedCity === city.name && styles.selectedCityLabel]}
                    >
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
                  onCityChange={(city) => setSelectedCity(city)}
                  showCityContent={false}
                  style={styles.verticalSlider}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={() => setShowLeftDrawer(false)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.modalBackground} onPress={() => setShowLeftDrawer(false)} />
        </View>
      </Modal>

      {/* Right Drawer (Year Selector) */}
      <Modal
        visible={showRightDrawer}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRightDrawer(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setShowRightDrawer(false)} />
          <View style={styles.rightDrawer}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={() => setShowRightDrawer(false)} style={styles.closeButton}>
                <Feather name="x" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.drawerTitle}>Select Year</Text>
            </View>

            <View style={styles.verticalSliderWrapper}>
              <View style={styles.yearLabels}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year.name}
                    onPress={() => setShowRightDrawer(false)}
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

      {/* Service Type Selector */}
      <Modal
        visible={showTypeSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTypeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.typeSelector}>
            <Text style={styles.typeSelectorTitle}>Select Service Type</Text>
            {serviceTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  selectedType === type.value && styles.selectedTypeOption,
                ]}
                onPress={() => {
                  setSelectedType(type.value);
                  setShowTypeSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    selectedType === type.value && styles.selectedTypeOptionText,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowTypeSelector(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setShowTypeSelector(false)} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', padding: 8 },
  navButton: { padding: 8 },
  navButtonText: { fontSize: 14, fontWeight: 'bold' },
  navTitleContainer: { alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: 'bold' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { marginLeft: 4, fontSize: 12, color: '#2196F3' },
  gradientBackground: { flex: 1 },
  mainContent: { flex: 1, padding: 16 },
  horizontalSliderContainer: { marginBottom: 16 },
  searchFilterContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  searchContainer: { flex: 1, flexDirection: 'row', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 8, alignItems: 'center', marginRight: 8 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 4 },
  filterButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 6, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  filterButtonText: { marginRight: 4 },
  card: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 3 },
  imageContainer: { width: '100%', height: 180 },
  image: { width: '100%', height: '100%' },
  priceTag: { position: 'absolute', right: 8, bottom: 8, backgroundColor: '#2196F3', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4 },
  priceText: { color: '#fff', fontWeight: 'bold' },
  cardContent: { padding: 8 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
  cardProvider: { fontSize: 14, marginBottom: 2 },
  cardCity: { fontSize: 14, color: '#555' },
  cardDuration: { fontSize: 12, marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { marginLeft: 4 },
  bookButton: { backgroundColor: '#2196F3', borderRadius: 4, padding: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontWeight: 'bold' },
  noResults: { alignItems: 'center', marginTop: 32 },
  noResultsText: { fontSize: 16, color: '#666' },
  servicesList: { paddingVertical: 8 },
  modalOverlay: { flex: 1, flexDirection: 'row' },
  leftDrawer: { width: 240, backgroundColor: '#fff', padding: 16, elevation: 5 },
  rightDrawer: { width: 240, backgroundColor: '#fff', padding: 16, marginLeft: 'auto', elevation: 5 },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  drawerTitle: { fontSize: 16, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  verticalSliderWrapper: { flex: 1, flexDirection: 'row' },
  cityLabels: { justifyContent: 'space-around', marginRight: 16 },
  cityLabel: { fontSize: 14, marginBottom: 8 },
  selectedCityLabel: { fontWeight: 'bold', color: '#2196F3' },
  sliderContainer: { flex: 1 },
  verticalSlider: { flex: 1 },
  yearLabels: { justifyContent: 'space-around', marginRight: 16 },
  yearLabel: { fontSize: 14, marginBottom: 8 },
  doneButton: { backgroundColor: '#2196F3', borderRadius: 4, padding: 8, alignItems: 'center', marginTop: 16 },
  doneButtonText: { color: '#fff', fontWeight: 'bold' },
  toast: { position: 'absolute', top: 60, left: '10%', right: '10%', padding: 12, borderRadius: 8, zIndex: 999 },
  successToast: { backgroundColor: '#4CAF50' },
  errorToast: { backgroundColor: '#F44336' },
  toastText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  typeSelector: { width: 260, backgroundColor: '#fff', borderRadius: 8, padding: 16, elevation: 5 },
  typeSelectorTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  typeOption: { paddingVertical: 8 },
  typeOptionText: { fontSize: 14 },
  selectedTypeOption: { backgroundColor: '#E8F4FF' },
  selectedTypeOptionText: { color: '#2196F3', fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 12, alignItems: 'center' },
  cancelButtonText: { color: '#333', fontWeight: 'bold' },
});

export default BeautyScreen;
