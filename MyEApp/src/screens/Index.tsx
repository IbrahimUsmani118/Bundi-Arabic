import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabase';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

// Define your stack parameter list
type RootStackParamList = {
  Home: undefined;
  Plane: undefined;
  Hotels: undefined;
  Beauty: undefined;
  Events: undefined;
  NotFound: undefined;
};

// Type your navigation prop
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Define a type for your navigation items
type NavItem = {
  name: keyof RootStackParamList;
  color: string;
  gradient: readonly [string, string]; // Tuple with exactly 2 colors
  icon: string;
  dataCount?: number;
  value: number; // For slider positioning
};

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Use English as the default language; Arabic translations will be loaded via i18n configuration
  const [selectedCity, setSelectedCity] = useState('Miami');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [sliderValue, setSliderValue] = useState(0);

  // Query events data
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({
    queryKey: ['events', selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('city', selectedCity)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Query beauty services data
  const {
    data: beautyServices,
    isLoading: beautyLoading,
    error: beautyError,
  } = useQuery({
    queryKey: ['beauty_services', selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beauty_services')
        .select('*')
        .eq('city', selectedCity)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Navigation items with icons, gradients, and values for slider
  const navigationItems: NavItem[] = [
    { 
      name: 'Beauty', 
      color: 'pink', 
      gradient: ['#FF9A9E', '#FECFEF'] as const,
      icon: 'scissors', 
      dataCount: beautyServices?.length ?? 0,
      value: 0 
    },
    { 
      name: 'Events', 
      color: 'yellow', 
      gradient: ['#F6D365', '#FDA085'] as const,
      icon: 'calendar', 
      dataCount: events?.length ?? 0,
      value: 33 
    },
    { 
      name: 'Plane', 
      color: 'blue', 
      gradient: ['#84FAB0', '#8FD3F4'] as const,
      icon: 'send', // Using a valid Feather icon key
      value: 66 
    },
    { 
      name: 'Hotels', 
      color: 'indigo', 
      gradient: ['#A18CD1', '#FBC2EB'] as const,
      icon: 'home', 
      value: 100 
    },
  ];

  // For this version, we assume translations for navigation items are handled externally.
  // The displayed name will be exactly the key (e.g., "Beauty") and must be translated via your i18n setup.
  const getTranslatedName = (name: string) => name; // Adjust if you later integrate i18n in this file

  // Find the navigation item closest to the current slider value
  const getClosestItem = (value: number) => {
    return navigationItems.reduce((prev, current) => {
      return Math.abs(current.value - value) < Math.abs(prev.value - value)
        ? current
        : prev;
    });
  };

  const highlightedItem = useMemo(() => getClosestItem(sliderValue), [sliderValue]);
  const filteredItems = useMemo(() => {
    return [
      highlightedItem,
      ...navigationItems.filter(item => item.name !== highlightedItem.name)
    ];
  }, [highlightedItem]);

  // Handle slider changes
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  const handleSliderComplete = (value: number) => {
    const closest = getClosestItem(value);
    setSliderValue(closest.value);
  };

  if (eventsLoading || beautyLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </SafeAreaView>
    );
  }
  
  if (eventsError || beautyError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>
            Error fetching data: {String(eventsError || beautyError)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with app title */}
      <LinearGradient
        colors={['#ffffff', '#f7f7f7'] as const}
        style={styles.headerContainer}
      >
        <Text style={styles.appTitle}>Bundi</Text>
      </LinearGradient>

      {/* Navigation slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={sliderValue}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderComplete}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#CCCCCC"
          thumbTintColor="#2196F3"
        />
        <View style={styles.sliderLabels}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => {
                setSliderValue(item.value);
                handleSliderComplete(item.value);
              }}
            >
              <Text
                style={[
                  styles.sliderLabel,
                  highlightedItem.name === item.name && styles.sliderLabelActive
                ]}
              >
                {getTranslatedName(item.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Navigation cards */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.card,
              index === 0 && styles.highlightedCard
            ]}
            onPress={() => navigation.navigate(item.name)}
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name={item.icon as any} size={20} color="white" />
            </LinearGradient>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Feather name="chevron-right" size={24} color="#CCCCCC" />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: '#FF3B30',
    marginTop: 12,
    textAlign: 'center',
  },
  headerContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
  },
  sliderLabelActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  arrowContainer: {
    paddingLeft: 8,
  },
});

export default Home;
