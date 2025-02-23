import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageSlider } from "@/components/PageSlider";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Hotels() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Miami");

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  useEffect(() => {
    console.log("Selected city:", selectedCity);
  }, [selectedCity]);

  const { data: hotels } = useQuery({
    queryKey: ["resorts", selectedCity],
    queryFn: async () => {
      let query = supabase
        .from("resorts")
        .select("*")
        .order("rating", { ascending: false });
      if (selectedCity) {
        query = query.ilike("city", `%${selectedCity}%`);
      }
      const { data, error } = await query;
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching hotels",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const handlePurchase = (hotelName: string, price: number) => {
    toast({
      title: "Booking Initiated",
      description: `Processing booking for ${hotelName} at $${price}/night`,
    });
  };

  const filteredHotels = hotels?.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function renderStars(rating: number | null) {
    if (!rating) return null;
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  }

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
        <h1 className="font-bold text-lg">Hotels</h1>
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
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full"
            />
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHotels && filteredHotels.length > 0 ? (
                filteredHotels.map((hotel) => (
                  <Card
                    key={hotel.id}
                    className="group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <img
                        src={
                          hotel.image_url ||
                          "https://images.unsplash.com/photo-1566073771259-6a8506099945"
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {hotel.price_per_night && (
                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                          <span className="font-bold text-lg">
                            ${hotel.price_per_night}
                          </span>
                          <span className="text-sm text-gray-600">/night</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {hotel.name}
                      </h3>
                      <p className="text-gray-600 mb-3">{hotel.location}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {renderStars(hotel.rating)}
                        </div>
                        {hotel.rating && (
                          <span className="text-sm text-gray-600">
                            {hotel.rating.toFixed(1)} / 5
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {hotel.amenities?.map((amenity: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() =>
                          handlePurchase(
                            hotel.name,
                            hotel.price_per_night || 0
                          )
                        }
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-gray-700">
                  No hotels found for "{selectedCity}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - visible on md+ only */}
        <div className="hidden md:block w-32 sticky top-0 h-screen bg-white shadow">
          <PageSlider orientation="vertical" type="years" showYearContent={false} />
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
