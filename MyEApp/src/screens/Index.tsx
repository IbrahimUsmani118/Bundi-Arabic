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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack parameter list
type RootStackParamList = {
  Home: undefined;
  Travel: undefined;
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
  name: keyof RootStackParamList; // ensures name is one of the valid routes
  color: string;
  dataCount?: number;
};

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [selectedCity, setSelectedCity] = useState('Miami');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedLetter, setSelectedLetter] = useState(0);

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

  // Navigation items – names must match the keys in RootStackParamList
  const navigationItems: NavItem[] = [
    { name: 'Beauty', color: 'pink', dataCount: beautyServices?.length ?? 0 },
    { name: 'Events', color: 'yellow', dataCount: events?.length ?? 0 },
    { name: 'Plane', color: 'blue' },
    { name: 'Hotels', color: 'indigo' },
    { name: 'Travel', color: 'green' },
  ];

  // Create an array of letters from the navigation item names
  const letters = useMemo(() => {
    const unique = [...new Set(navigationItems.map((item) => item.name[0]))];
    return unique.sort();
  }, [navigationItems]);

  // Sort items based on selected letter (example slider logic)
  const sortedItems = useMemo(() => {
    const selectedChar =
      letters[Math.floor((selectedLetter / 100) * letters.length)] || '';
    return [...navigationItems].sort((a, b) => {
      const aStarts = a.name.startsWith(selectedChar);
      const bStarts = b.name.startsWith(selectedChar);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedLetter, letters, navigationItems]);

  // Handlers for demonstration purposes
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    Alert.alert('Location Updated', `Showing content for ${city}`);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    Alert.alert('Time Period Updated', `Showing content for ${year}`);
  };

  if (eventsLoading || beautyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (eventsError || beautyError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error fetching data: {String(eventsError || beautyError)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header displaying city and year */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{selectedCity}</Text>
        <Text style={styles.headerSubtitle}>{selectedYear}</Text>
      </View>

      {/* Letter slider (demonstration) */}
      <View style={styles.lettersRow}>
        {letters.map((letter, index) => (
          <TouchableOpacity
            key={letter}
            onPress={() =>
              setSelectedLetter((index / (letters.length - 1)) * 100)
            }
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation items list */}
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.name)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getColor(item.color) },
              ]}
            >
              <Text style={styles.iconText}>{item.name[0]}</Text>
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.dataCount !== undefined && (
                <Text style={styles.cardSubtitle}>
                  {item.dataCount} records found
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Helper function to map a color name to its actual color
function getColor(colorName: string) {
  switch (colorName) {
    case 'pink':
      return '#FBCFE8';
    case 'yellow':
      return '#FEF9C3';
    case 'blue':
      return '#BFDBFE';
    case 'indigo':
      return '#C7D2FE';
    case 'green':
      return '#BBF7D0';
    default:
      return '#E5E7EB';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
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
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    color: '#4B5563',
    fontSize: 16,
    marginTop: 4,
  },
  lettersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  letter: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default Home;
