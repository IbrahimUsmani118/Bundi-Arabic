import { PageSlider } from "@/components/PageSlider";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plane, Hotel, CalendarDays, Scissors, Trophy } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Example icons for your nav items
// import { ... } from "lucide-react";

export default function Index() {
  const [selectedLetter, setSelectedLetter] = useState(0);
  const [selectedCity, setSelectedCity] = useState("Miami");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { toast } = useToast();

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Example data fetches
  const { data: events } = useQuery({
    queryKey: ["events", selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("city", selectedCity)
        .limit(3);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const { data: beautyServices } = useQuery({
    queryKey: ["beauty_services", selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("beauty_services")
        .select("*")
        .eq("city", selectedCity)
        .limit(3);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching beauty services",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const navigationItems = [
    { name: "Beauty", path: "/beauty", icon: Scissors, color: "pink" },
    { name: "Events", path: "/events", icon: CalendarDays, color: "yellow" },
    { name: "Flights", path: "/plane", icon: Plane, color: "blue" },
    { name: "Hotels", path: "/hotels", icon: Hotel, color: "indigo" },
  ];

  // Letters for your letter slider
  const letters = useMemo(() => {
    const uniqueLetters = [...new Set(navigationItems.map(item => item.name[0]))].sort();
    return uniqueLetters;
  }, [navigationItems]);

  const sortedItems = useMemo(() => {
    const selectedChar = letters[Math.floor((selectedLetter / 100) * letters.length)] || "";
    return [...navigationItems].sort((a, b) => {
      const aStarts = a.name.startsWith(selectedChar);
      const bStarts = b.name.startsWith(selectedChar);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [selectedLetter, letters, navigationItems]);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    toast({
      title: "Location Updated",
      description: `Showing content for ${city}`,
    });
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    toast({
      title: "Time Period Updated",
      description: `Showing content for ${year}`,
    });
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-x-hidden">
      {/* MOBILE NAVBAR (hidden on md+) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <button
          className="text-sm px-2 py-1 bg-gray-200 rounded"
          onClick={() => setShowLeftDrawer(true)}
        >
          Cities
        </button>
        <h1 className="font-bold text-lg">Home</h1>
        <button
          className="text-sm px-2 py-1 bg-gray-200 rounded"
          onClick={() => setShowRightDrawer(true)}
        >
          Years
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Desktop layout: sidebars visible */}
        <div className="hidden md:flex justify-between">
          {/* Left Sidebar */}
          <div className="w-24 sticky top-0 h-[600px] bg-white shadow">
            <PageSlider
              orientation="vertical"
              type="cities"
              className="h-full"
              showCityContent={false}
              onCityChange={handleCityChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 mx-8">
            {/* Letter Slider */}
            <div className="mb-8 max-w-xl mx-auto">
              <Slider
                value={[selectedLetter]}
                onValueChange={(value) => setSelectedLetter(value[0])}
                className="w-full"
                step={0.1}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                {letters.map((letter, index) => (
                  <span
                    key={letter}
                    className={`cursor-pointer ${
                      Math.floor((selectedLetter / 100) * letters.length) === index
                        ? "text-blue-600 font-bold"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedLetter((index / (letters.length - 1)) * 100)
                    }
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>

            {/* City & Year Display */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedCity}</h2>
              <p className="text-gray-600">{selectedYear}</p>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              {sortedItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link to={item.path} key={item.name}>
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/50 backdrop-blur-sm border-2">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 bg-${item.color}-100 rounded-xl`}>
                          <Icon className={`w-6 h-6 text-${item.color}-600`} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                          {item.name === "Events" && events && (
                            <p className="text-sm text-gray-600">
                              {events.length} upcoming events
                            </p>
                          )}
                          {item.name === "Beauty" && beautyServices && (
                            <p className="text-sm text-gray-600">
                              {beautyServices.length} services available
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-24 sticky top-0 h-[600px] bg-white shadow">
            <PageSlider
              orientation="vertical"
              type="years"
              className="h-full"
              showYearContent={false}
              onYearChange={handleYearChange}
            />
          </div>
        </div>

        {/* Mobile layout: sidebars hidden, show content in a single column */}
        <div className="md:hidden mt-8">
          {/* For mobile, you can replicate the letter slider & main content here, 
              or just show the same content in a simpler layout. */}
          {/* Example: Just a simplified version */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{selectedCity}</h2>
            <p>{selectedYear}</p>
          </div>
          {/* The same 'sortedItems' map, etc. */}
          <div className="max-w-md mx-auto">
            {sortedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link to={item.path} key={item.name}>
                  <Card className="p-4 mb-2 bg-white shadow">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${item.color}-100 rounded-xl`}>
                        <Icon className={`w-5 h-5 text-${item.color}-600`} />
                      </div>
                      <span className="text-lg font-semibold">{item.name}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE LEFT DRAWER */}
      {showLeftDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 max-w-xs bg-white shadow">
            <div className="flex justify-end p-2">
              <button
                className="text-sm px-2 py-1 bg-gray-300 rounded"
                onClick={() => setShowLeftDrawer(false)}
              >
                Close
              </button>
            </div>
            <PageSlider
              orientation="vertical"
              type="cities"
              showCityContent
              onCityChange={(city) => {
                handleCityChange(city);
                setShowLeftDrawer(false);
              }}
            />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setShowLeftDrawer(false)}
          />
        </div>
      )}

      {/* MOBILE RIGHT DRAWER */}
      {showRightDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setShowRightDrawer(false)}
          />
          <div className="w-64 max-w-xs bg-white shadow">
            <div className="flex justify-end p-2">
              <button
                className="text-sm px-2 py-1 bg-gray-300 rounded"
                onClick={() => setShowRightDrawer(false)}
              >
                Close
              </button>
            </div>
            <PageSlider
              orientation="vertical"
              type="years"
              showYearContent
              onYearChange={(year) => handleYearChange(year)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
