import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageSlider } from "@/components/PageSlider";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Beauty() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState("Miami");

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Fetch data from Supabase
  const { data: services } = useQuery({
    queryKey: ["beauty_services", selectedCity],
    queryFn: async () => {
      let query = supabase
        .from("beauty_services")
        .select("*")
        .order("rating", { ascending: false });
      if (selectedCity) {
        query = query.eq("city", selectedCity);
      }
      const { data, error } = await query;
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

  const handlePurchase = (serviceName: string, price: number) => {
    toast({
      title: "Booking Initiated",
      description: `Processing booking for ${serviceName} at $${price}`,
    });
  };

  const filteredServices = services?.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || service.service_type === selectedType;
    return matchesSearch && matchesType;
  });

  const serviceTypes = [
    { value: "all", label: "All Services" },
    { value: "women_haircut", label: "Women's Haircuts" },
    { value: "men_haircut", label: "Men's Haircuts" },
    { value: "nail_service", label: "Nail Services" },
  ];

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
        <h1 className="font-bold text-lg">Beauty</h1>
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
          {/* Horizontal PageSlider for navigation if needed */}
          <PageSlider orientation="horizontal" />

          {/* Search & Filter */}
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full sm:max-w-4xl mx-auto">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search beauty services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Card Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices?.map((service) => (
                <Card
                  key={service.id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative max-h-64 overflow-hidden rounded-t-lg">
                    <img
                      src={
                        service.image_url ||
                        "https://images.unsplash.com/photo-1560066984-138dadb4c035"
                      }
                      alt={service.name}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 px-4 py-2 rounded-full">
                      <span className="text-white font-semibold text-lg">
                        ${service.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{service.provider}</p>
                    <p className="text-gray-500 mb-2">{service.city}</p>
                    <p className="text-gray-500 mb-4">{service.duration}</p>
                    {service.rating && (
                      <div className="flex items-center mb-4">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="ml-2 text-gray-600">
                          {service.rating.toFixed(1)} / 5
                        </span>
                      </div>
                    )}
                    <Button
                      className="w-full mt-4"
                      onClick={() =>
                        handlePurchase(service.name, service.price || 0)
                      }
                    >
                      Book Now
                    </Button>
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
            type="years"
            showYearContent={false}
          />
        </div>
      </div>

      {/* MOBILE LEFT DRAWER */}
      {showLeftDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 max-w-xs bg-white shadow">
            {/* City PageSlider in the drawer */}
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
                setShowLeftDrawer(false); // close on selection if you want
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
            <PageSlider
              orientation="vertical"
              type="years"
              showYearContent
            />
          </div>
        </div>
      )}
    </div>
  );
}
