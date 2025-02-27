import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, ParamListBase, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Slider from '@react-native-community/slider';

type NavigationItem = {
  name: string;
  path: string;
  value: number;
};

type CityItem = {
  name: string;
  value: number;
};

type YearItem = {
  name: string;
  value: number;
};

type RootStackParamList = {
  Home: undefined;
  Plane: undefined;
  Hotels: undefined;
  Beauty: undefined;
  Events: undefined;
  Travel: undefined;
  NotFound: undefined;
};

const navigationPages: NavigationItem[] = [
  { name: "Home", path: "Home", value: 0 },
  { name: "Flights", path: "Plane", value: 25 },
  { name: "Hotels", path: "Hotels", value: 50 },
  { name: "Beauty", path: "Beauty", value: 75 },
  { name: "Events", path: "Events", value: 100 }
];

const cities: CityItem[] = [
  { name: "Miami", value: 0 },
  { name: "New York", value: 100 },
];

const years: YearItem[] = [
  { name: "2020", value: 0 },
  { name: "2021", value: 20 },
  { name: "2022", value: 40 },
  { name: "2023", value: 60 },
  { name: "2024", value: 80 },
  { name: "2025", value: 100 },
];

interface PageSliderProps {
  orientation?: "horizontal" | "vertical";
  style?: object;
  type?: "navigation" | "cities" | "years";
  initialCity?: string;
  onCityChange?: (city: string) => void;
  onYearChange?: (year: number) => void;
  showCityContent?: boolean;
  showYearContent?: boolean;
}

export const PageSlider: React.FC<PageSliderProps> = ({
  orientation = "horizontal",
  style = {},
  type = "navigation",
  initialCity,
  onCityChange,
  onYearChange,
  showCityContent = true,
  showYearContent = true
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<ParamListBase, string>>();
  const isVertical = orientation === "vertical";

  // ===== Horizontal slider state for "navigation" =====
  const [rawHorizontal, setRawHorizontal] = useState<number>(0);
  const [snappedHorizontal, setSnappedHorizontal] = useState<number>(0);

  // ===== Vertical slider state =====
  const [rawVertical, setRawVertical] = useState<number>(0);
  const [snappedVertical, setSnappedVertical] = useState<number>(0);

  // States for the selected city & year
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const navigateToScreen = (path: string) => {
    try {
      navigation.navigate(path as keyof RootStackParamList);
    } catch (error) {
      console.error(`Navigation error to ${path}:`, error);
    }
  };

  const getItems = (): (NavigationItem | CityItem | YearItem)[] => {
    switch (type) {
      case "cities":
        return cities;
      case "years":
        return years;
      default:
        return navigationPages;
    }
  };

  // If "navigation", initialize the slider based on current route
  useEffect(() => {
    if (type === "navigation") {
      const currentRouteName = route.name;
      const currentPage = navigationPages.find(
        (page) => page.path === currentRouteName
      );
      if (currentPage) {
        if (!isVertical) {
          // Horizontal nav
          setRawHorizontal(currentPage.value);
          setSnappedHorizontal(currentPage.value);
        } else {
          // Vertical nav - FIX: No inversion needed now
          setRawVertical(currentPage.value);
          setSnappedVertical(currentPage.value);
        }
      }
    }
  }, [type, route.name, isVertical]);

  // Initialize city slider
  useEffect(() => {
    if (type === "cities" && initialCity) {
      const cityObj = cities.find(c => c.name === initialCity);
      if (cityObj) {
        // FIX: Direct assignment without inversion
        setRawVertical(cityObj.value);
        setSnappedVertical(cityObj.value);
        setSelectedCity(cityObj.name);
      }
    }
  }, [type, initialCity]);

  // Find the closest item based on slider value
  const findClosestItem = (items: (NavigationItem | CityItem | YearItem)[], value: number) => {
    return items.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.value - value);
      const currDiff = Math.abs(curr.value - value);
      return prevDiff < currDiff ? prev : curr;
    });
  };

  // Fires continuously while dragging
  const handleValueChange = (newValue: number): void => {
    if (!isVertical && type === "navigation") {
      setRawHorizontal(newValue);
      
      // Update selection immediately for horizontal navigation
      const nearestPage = findClosestItem(navigationPages, newValue) as NavigationItem;
      if (Math.abs(newValue - nearestPage.value) < 5) {
        navigateToScreen(nearestPage.path);
      }
      return;
    }

    if (isVertical) {
      // FIX: Use direct value without inversion
      setRawVertical(newValue);

      // For vertical sliders, update selection immediately
      const items = getItems();
      const closestItem = findClosestItem(items, newValue);
      
      if (type === "cities") {
        setSelectedCity(closestItem.name);
        onCityChange?.(closestItem.name);
      } else if (type === "years") {
        const yearNum = parseInt(closestItem.name, 10);
        setSelectedYear(yearNum);
        onYearChange?.(yearNum);
      } else if (type === "navigation") {
        const navItem = closestItem as NavigationItem;
        navigateToScreen(navItem.path);
      }
      return;
    }

    // For horizontal non-navigation
    const items = getItems();
    const closestItem = findClosestItem(items, newValue);
    
    if (type === "cities") {
      setSelectedCity((closestItem as CityItem).name);
    } else if (type === "years") {
      setSelectedYear(parseInt(closestItem.name, 10));
    }
  };

  // Fires once after user releases the thumb
  const handleValueCommit = (finalValue: number): void => {
    if (!isVertical && type === "navigation") {
      const nearestPage = findClosestItem(navigationPages, finalValue) as NavigationItem;
      setRawHorizontal(nearestPage.value);
      setSnappedHorizontal(nearestPage.value);
      navigateToScreen(nearestPage.path);
      return;
    }

    if (isVertical) {
      const items = getItems();
      // FIX: No adjustment needed since we're using direct values
      const closestItem = findClosestItem(items, finalValue);

      // FIX: Set the raw and snapped values directly
      setRawVertical(closestItem.value);
      setSnappedVertical(closestItem.value);

      if (type === "cities") {
        setSelectedCity(closestItem.name);
        onCityChange?.(closestItem.name);
      } else if (type === "years") {
        const yearNum = parseInt(closestItem.name, 10);
        setSelectedYear(yearNum);
        onYearChange?.(yearNum);
      } else if (type === "navigation") {
        const navItem = closestItem as NavigationItem;
        navigateToScreen(navItem.path);
      }
      return;
    }

    // Horizontal non-navigation
    const items = getItems();
    const closestItem = findClosestItem(items, finalValue);
    
    if (type === "cities") {
      setSelectedCity((closestItem as CityItem).name);
      onCityChange?.((closestItem as CityItem).name);
    } else if (type === "years") {
      const yearNum = parseInt(closestItem.name, 10);
      setSelectedYear(yearNum);
      onYearChange?.(yearNum);
    }
  };

  // Decide what value to feed to <Slider />
  let sliderValue = 0;
  if (isVertical) {
    // FIX: Use the direct value without inversion
    sliderValue = rawVertical;
  } else if (type === "navigation") {
    sliderValue = rawHorizontal;
  }

  // =========================================================
  // RENDER
  // =========================================================
  if (isVertical) {
    return (
      <View style={[styles.container, styles.verticalContainer, style]}>
        <View style={styles.verticalSliderWrapper}>
          <View style={styles.verticalSliderContainer}>
            <Slider
              value={sliderValue}
              minimumValue={0}
              maximumValue={100}
              step={0.1}
              onValueChange={handleValueChange}
              onSlidingComplete={handleValueCommit}
              style={styles.verticalSlider}
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#CCCCCC"
              thumbTintColor="#2196F3"
            />
          </View>

          {/* City or Year labels to tap on */}
          {type === "cities" && showCityContent && (
            <View style={styles.verticalLabels}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city.value}
                  onPress={() => {
                    // FIX: Direct value without inversion
                    handleValueCommit(city.value);
                  }}
                >
                  <Text
                    style={[
                      styles.labelText,
                      selectedCity === city.name && styles.selectedLabel
                    ]}
                  >
                    {city.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {type === "years" && showYearContent && (
            <View style={styles.verticalLabels}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year.value}
                  onPress={() => {
                    // FIX: Direct value without inversion
                    handleValueCommit(year.value);
                  }}
                >
                  <Text
                    style={[
                      styles.labelText,
                      selectedYear === parseInt(year.name, 10) && styles.selectedLabel
                    ]}
                  >
                    {year.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }

  // ================== HORIZONTAL SLIDER ===================
  return (
    <View style={[styles.container, styles.horizontalContainer, style]}>
      <View style={styles.horizontalSliderContainer}>
        <Slider
          value={sliderValue}
          minimumValue={0}
          maximumValue={100}
          step={0.1}
          onValueChange={handleValueChange}
          onSlidingComplete={handleValueCommit}
          style={styles.horizontalSlider}
          minimumTrackTintColor="#2196F3"
          maximumTrackTintColor="#CCCCCC"
          thumbTintColor="#2196F3"
        />

        <View style={styles.horizontalLabels}>
          {getItems().map((item) => {
            const highlightVal = sliderValue;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => {
                  if (!isVertical && type === "navigation" && "path" in item) {
                    setRawHorizontal(item.value);
                    setSnappedHorizontal(item.value);
                    navigateToScreen((item as NavigationItem).path);
                  } else {
                    handleValueCommit(item.value);
                  }
                }}
              >
                <Text
                  style={[
                    styles.labelText,
                    Math.abs(highlightVal - item.value) < 0.1
                      ? styles.selectedLabel
                      : styles.unselectedLabel
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* City content if type=cities */}
      {type === "cities" && showCityContent && selectedCity && (
        <View style={styles.contentContainer}>
          {selectedCity === "New York" && (
            <View>
              <Text style={styles.contentTitle}>Things in New York</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• Broadway Shows</Text>
                <Text style={styles.listItem}>• Statue of Liberty Tours</Text>
                <Text style={styles.listItem}>• Times Square Events</Text>
              </View>
            </View>
          )}
          {selectedCity === "Miami" && (
            <View>
              <Text style={styles.contentTitle}>Things in Miami</Text>
              <View style={styles.listContainer}>
                <Text style={styles.listItem}>• South Beach Parties</Text>
                <Text style={styles.listItem}>• Art Deco District Tours</Text>
                <Text style={styles.listItem}>• Little Havana Food</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Year content if type=years */}
      {type === "years" && showYearContent && selectedYear && (
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.contentTitle}>Year: {selectedYear}</Text>
            <Text>Data or events for {selectedYear}...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 50,
  },
  verticalContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  horizontalContainer: {
    width: '100%',
  },
  horizontalSliderContainer: {
    width: '100%',
    padding: 16,
  },
  horizontalSlider: {
    width: '100%',
    height: 40,
  },
  horizontalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  verticalSliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
    paddingHorizontal: 10,
  },
  verticalSliderContainer: {
    height: 300,
    width: 40,
    transform: [{ rotate: '270deg' }],
    marginRight: 20,
  },
  verticalSlider: {
    width: 300,
    height: 40,
  },
  verticalLabels: {
    height: 300,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  labelText: {
    fontSize: 14,
  },
  selectedLabel: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  unselectedLabel: {
    color: '#666',
  },
  contentContainer: {
    padding: 15,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  listContainer: {
    marginLeft: 10,
  },
  listItem: {
    marginBottom: 3,
  },
});

export default PageSlider;