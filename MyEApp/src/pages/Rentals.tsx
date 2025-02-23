import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageSlider } from "@/components/PageSlider";
import { Car, Star, Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const Rentals = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  // Default selected city is "Miami"
  const [selectedCity, setSelectedCity] = useState("Miami");

  // Log the selected city (useful for debugging or ensuring the slider works)
  useEffect(() => {
    console.log("Selected city:", selectedCity);
  }, [selectedCity]);

  const { data: rentals } = useQuery({
    queryKey: ["rentals", selectedCity],
    queryFn: async () => {
      let query = supabase
        .from("rentals")
        .select("*")
        .eq("type", "car")
        .order("rating", { ascending: false });
      if (selectedCity) {
        // Use ilike for case-insensitive filtering.
        query = query.ilike("store_location", `%${selectedCity}%`);
      }
      const { data, error } = await query;
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching rentals",
          description: error.message,
        });
        throw error;
      }
      return data;
    },
  });

  const handleRent = (rental: any) => {
    if (!rental.available) {
      toast({
        variant: "destructive",
        title: "Not Available",
        description: "Sorry, this vehicle is currently not available.",
      });
      return;
    }
    toast({
      title: "Reservation Successful!",
      description: `You have successfully reserved the ${rental.name}. We'll contact you shortly with next steps.`,
    });
  };

  const filteredRentals = rentals?.filter((rental) =>
    rental.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /**
   * getRentalData returns fallback image and price based on the selected city.
   * For NY (or New York) we have two options (cycling through them if more than one rental exists),
   * and for Miami we use a single image and price.
   */
  const getRentalData = (index: number) => {
    if (
      selectedCity.toLowerCase() === "ny" ||
      selectedCity.toLowerCase() === "new york"
    ) {
      const rentalDataNY = [
        {
          image:
            "https://unsplash.com/photos/blue-coupe-beside-gray-house-p7tai9P7H-s",
          price: 50,
        },
        {
          image:
            "https://unsplash.com/photos/orange-audi-coupe-parked-on-gray-concrete-road-GRV4ypBKgxE",
          price: 70,
        },
      ];
      return rentalDataNY[index % rentalDataNY.length];
    } else if (selectedCity.toLowerCase() === "miami") {
      return {
        image:
          "https://unsplash.com/photos/red-ferrari-458-italia-on-gray-asphalt-road-79-SQCseV08",
        price: 45,
      };
    }
    // Fallback values for any other city.
    return {
      image:
        "https://unsplash.com/photos/red-ferrari-458-italia-on-gray-asphalt-road-79-SQCseV08",
      price: 45,
    };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Left Sidebar - Cities (with onCityChange) */}
      <div className="flex w-32 sticky top-0 h-screen">
        <PageSlider
          orientation="vertical"
          className="flex-1"
          type="cities"
          onCityChange={setSelectedCity}
          showCityContent={false}
        />
      </div>

      <div className="flex-1">
        {/* Horizontal Slider */}
        <PageSlider orientation="horizontal" />

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6 px-4">
          <Search className="absolute left-8 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search rentals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-full"
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRentals && filteredRentals.length > 0 ? (
              filteredRentals.map((rental, index) => {
                // Use the rental's own image/price if available; otherwise, fallback.
                const { image, price } = getRentalData(index);
                return (
                  <Card
                    key={rental.id}
                    className="group hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <img
                        src={rental.image_url || image}
                        alt={rental.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {(rental.price_per_day || price) && (
                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                          <span className="font-bold text-lg">
                            ${rental.price_per_day || price}
                          </span>
                          <span className="text-sm text-gray-600">/day</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {rental.name}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {rental.store_location}
                      </p>
                      <div className="flex items-center mb-4">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(rental.rating!) // Use ! to assert non-null
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {rental.rating!.toFixed(1)} / 5
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Car className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600 capitalize">
                          {rental.type}
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        {rental.available ? (
                          <div className="flex items-center text-green-600">
                            <Check className="w-5 h-5 mr-1" />
                            <span>Available</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <X className="w-5 h-5 mr-1" />
                            <span>Not Available</span>
                          </div>
                        )}
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleRent(rental)}
                        disabled={!rental.available}
                      >
                        {rental.available ? "Rent Now" : "Not Available"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center text-gray-700">
                No rentals found for "{selectedCity}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Years */}
      <div className="flex w-32 sticky top-0 h-screen">
        <PageSlider orientation="vertical" className="flex-1" type="years" />
        showYearContent={false}
      </div>
    </div>
  );
};

export default Rentals;
