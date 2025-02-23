import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageSlider } from "@/components/PageSlider";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const airlineLogos: { [key: string]: string } = {
  "American Airlines": "https://images.unsplash.com/photo-1540339832862-46d6a6c50677?w=100&h=100&fit=crop",
  "Delta Airlines": "https://images.unsplash.com/photo-1579256945418-f3b7eaa1e26f?w=100&h=100&fit=crop",
  "United Airlines": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=100&h=100&fit=crop",
  "JetBlue Airways": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop",
};

export default function Plane() {
  const { toast } = useToast();
  const [selectedCity, setSelectedCity] = useState<string>("Miami");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [searchQuery, setSearchQuery] = useState("");

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  const { data: flights } = useQuery({
    queryKey: ["flights", selectedCity],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flights")
        .select("*")
        .eq("departure_city", selectedCity)
        .order("departure_time", { ascending: true });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching flights",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const filteredFlights = flights?.filter((flight: any) =>
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.arrival_city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* MOBILE NAVBAR (hidden on md+) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
        <button
          className="text-sm px-2 py-1 bg-gray-200 rounded"
          onClick={() => setShowLeftDrawer(true)}
        >
          Cities
        </button>
        <h1 className="font-bold text-lg">Flights</h1>
        <button
          className="text-sm px-2 py-1 bg-gray-200 rounded"
          onClick={() => setShowRightDrawer(true)}
        >
          Years
        </button>
      </div>

      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* LEFT SIDEBAR - visible on md+ only */}
        <div className="hidden md:block w-32 sticky top-0 h-screen bg-white shadow">
          <PageSlider
            orientation="vertical"
            className="flex-1"
            type="cities"
            onCityChange={setSelectedCity}
            showCityContent={false}
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          <PageSlider orientation="horizontal" />

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-6 px-4">
            <Search className="absolute left-8 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search flights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full"
            />
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {filteredFlights?.map((flight: any) => (
                <Card
                  key={flight.id}
                  className="p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <img
                          src={airlineLogos[flight.airline]}
                          alt={flight.airline}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold">
                            {flight.airline}
                          </h3>
                          <span className="text-gray-600">
                            Flight #{flight.flight_number}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {flight.seat_type}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="font-medium text-lg">
                            {flight.departure_city}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(flight.departure_time).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <div className="text-2xl rotate-90">✈️</div>
                        <div className="text-right">
                          <p className="font-medium text-lg">
                            {flight.arrival_city}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(flight.arrival_time).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg">
                          ${flight.price}
                        </span>
                        <span className="text-sm text-gray-600">
                          {flight.seat_type}
                        </span>
                      </div>
                      <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - visible on md+ only */}
        <div className="hidden md:block w-32 sticky top-0 h-screen bg-white shadow">
          <PageSlider
            orientation="vertical"
            className="flex-1"
            type="years"
            onYearChange={(year) => setSelectedYear(year.toString())}
            showYearContent={false}
          />
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
              onCityChange={(city) => {
                setSelectedCity(city);
                setShowLeftDrawer(false);
              }}
              showCityContent
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
            <PageSlider orientation="vertical" type="years" showYearContent />
          </div>
        </div>
      )}
    </div>
  );
}
