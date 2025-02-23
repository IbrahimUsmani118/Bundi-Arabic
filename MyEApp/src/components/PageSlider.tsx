import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider"; // <-- Adjust path if needed
import { useEffect, useState } from "react";

// ====== ARRAYS FOR NAVIGATION, CITIES, YEARS ======
const navigationPages = [
  { name: "Home", path: "/", value: 0 },
  { name: "Flights", path: "/plane", value: 25 },
  { name: "Hotels", path: "/hotels", value: 50 },
  { name: "Beauty", path: "/beauty", value: 75 },
  { name: "Events", path: "/events", value: 100 }
];

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

export interface PageSliderProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  type?: "navigation" | "cities" | "years";
  onCityChange?: (city: string) => void;
  onYearChange?: (year: number) => void;

  showCityContent?: boolean;
  showYearContent?: boolean;
}

export const PageSlider = ({
  orientation = "horizontal",
  className = "",
  type = "navigation",
  onCityChange,
  onYearChange,
  showCityContent = true,
  showYearContent = true

}: PageSliderProps) => {
  const navigate = useNavigate();
  const isVertical = orientation === "vertical";

  // States for navigation and vertical sliders
  const [rawHorizontal, setRawHorizontal] = useState(0);
  const [snappedHorizontal, setSnappedHorizontal] = useState(0);
  const [value, setValue] = useState([0]);

  // States for the selected city & year
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Decide which array to use based on the type
  const getItems = () => {
    switch (type) {
      case "cities":
        return cities;
      case "years":
        return years;
      default:
        return navigationPages;
    }
  };

  // On mount, if "navigation", set the slider to match the current path
  useEffect(() => {
    if (type === "navigation") {
      const currentPage = navigationPages.find(
        (page) => page.path === window.location.pathname
      );
      if (currentPage) {
        setRawHorizontal(currentPage.value);
        setSnappedHorizontal(currentPage.value);
      }
    }
  }, [type]);

  // Fires continuously while dragging the slider
  const handleValueChange = (newValue: number[]) => {
    if (orientation === "horizontal" && type === "navigation") {
      setRawHorizontal(newValue[0]);
      return;
    }

    const items = getItems();
    const adjustedValue = isVertical ? 100 - newValue[0] : newValue[0];

    const closestItem = items.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.value - adjustedValue);
      const currDiff = Math.abs(curr.value - adjustedValue);
      return prevDiff < currDiff ? prev : curr;
    });

    setValue(isVertical ? [100 - closestItem.value] : [closestItem.value]);

    if (type === "cities") {
      setSelectedCity(closestItem.name);
      onCityChange?.(closestItem.name);
    }

    if (type === "years") {
      const yearNum = parseInt(closestItem.name, 10);
      setSelectedYear(yearNum);
      onYearChange?.(yearNum);
    }

    if (type === "navigation" && "path" in closestItem) {
      navigate(closestItem.path as string);
    }
  };

  // Fires once after the user releases the thumb
  const handleValueCommit = (finalValue: number[]) => {
    if (orientation === "horizontal" && type === "navigation") {
      const items = navigationPages;
      const nearestPage = items.reduce((prev, curr) => {
        const prevDiff = Math.abs(prev.value - finalValue[0]);
        const currDiff = Math.abs(curr.value - finalValue[0]);
        return currDiff < prevDiff ? curr : prev;
      });
      setRawHorizontal(nearestPage.value);
      setSnappedHorizontal(nearestPage.value);
      navigate(nearestPage.path as string);
    }
  };

  const sliderValue =
    orientation === "horizontal" && type === "navigation"
      ? [rawHorizontal]
      : value;

  return (
    <div className={`bg-white shadow-md ${isVertical ? "h-full" : "sticky top-0"} z-50 ${className}`}>
      <div className={`${isVertical ? "h-full py-2 px-2 flex" : "w-full px-4 py-2 sm:max-w-3xl sm:mx-auto sm:px-8 sm:py-6"}`}>
        {/* VERTICAL CITIES LABELS */}
        {isVertical && type === "cities" && (
          <div className="flex flex-col justify-between h-48 text-xs mr-2 sm:text-sm sm:mr-4">
            {cities.map((city) => (
              <span
                key={city.value}
                className={`cursor-pointer transition-colors ${
                  Math.abs(value[0] - (100 - city.value)) < 0.1 ? "text-black font-bold" : "text-gray-600"
                }`}
                onClick={() => handleValueChange([100 - city.value])}
              >
                {city.name}
              </span>
            ))}
          </div>
        )}

        {/* SLIDER COMPONENT */}
        <div className={`${isVertical ? "h-full min-h-[200px] max-h-[300px] w-1" : ""}`}>
          <Slider
            value={sliderValue}
            max={100}
            step={0.1}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            orientation={orientation}
            className={`${isVertical ? "h-full" : "w-full"}`}
          />
        </div>

        {/* VERTICAL YEARS LABELS */}
        {isVertical && type === "years" && (
          <div className="flex flex-col justify-between h-64 text-sm ml-4">
            {years.map((year) => (
              <span
                key={year.value}
                className={`cursor-pointer transition-colors ${
                  Math.abs(value[0] - (100 - year.value)) < 0.1 ? "text-black font-bold" : "text-gray-600"
                }`}
                onClick={() => handleValueChange([100 - year.value])}
              >
                {year.name}
              </span>
            ))}
          </div>
        )}

        {/* HORIZONTAL NAV LABELS */}
        {!isVertical && (
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            {getItems().map((item) => {
              const highlightVal =
                orientation === "horizontal" && type === "navigation"
                  ? rawHorizontal
                  : value[0];
              return (
                <span
                  key={item.value}
                  className={`cursor-pointer ${
                    Math.abs(highlightVal - item.value) < 0.1 ? "text-black font-bold" : ""
                  }`}
                  onClick={() => {
                    if (orientation === "horizontal" && type === "navigation") {
                      setRawHorizontal(item.value);
                      setSnappedHorizontal(item.value);
                      if ("path" in item) navigate(item.path as string);
                    } else {
                      handleValueChange([item.value]);
                    }
                  }}
                >
                  {item.name}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* CITY CONTENT */}
      {type === "cities" && showCityContent && (
        <div className="px-8 py-4">
          {selectedCity === "New York" && (
            <div className="text-gray-700">
              <h3 className="text-lg font-bold mb-1">Things in New York</h3>
              <ul className="list-disc ml-5">
                <li>Broadway Shows</li>
                <li>Statue of Liberty Tours</li>
                <li>Times Square Events</li>
              </ul>
            </div>
          )}
          {selectedCity === "Miami" && (
            <div className="text-gray-700">
              <h3 className="text-lg font-bold mb-1">Things in Miami</h3>
              <ul className="list-disc ml-5">
                <li>South Beach Parties</li>
                <li>Art Deco District Tours</li>
                <li>Little Havana Food</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* YEAR CONTENT */}
      {type === "years" && showYearContent && (
        <div className="px-8 py-4">
          {selectedYear && (
            <div className="text-gray-700">
              <h3 className="text-lg font-bold mb-1">Year: {selectedYear}</h3>
              <p>Here you could show data, events, or stats for {selectedYear}...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
