import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PageSlider } from "@/components/PageSlider";
import { Calendar, MapPin, Music, Theater, Ticket, Star, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function Events() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Miami");

  // For drawers
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  // Debug: log selected city changes
  useEffect(() => {
    console.log("Selected city:", selectedCity);
  }, [selectedCity]);

  const { data: events } = useQuery({
    queryKey: ["events", selectedCity],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (selectedCity) {
        query = query.eq("city", selectedCity);
      }
      const { data, error } = await query;
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

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getEventIcon(type: string) {
    switch (type.toLowerCase()) {
      case "concert":
        return <Music className="w-5 h-5" />;
      case "theater":
        return <Theater className="w-5 h-5" />;
      default:
        return <Ticket className="w-5 h-5" />;
    }
  }

  const handlePurchase = (event: any) => {
    toast({
      title: "Ticket Reserved!",
      description: `You've reserved a ticket for ${event.title}. Total: $${event.price}`,
    });
  };

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
        <h1 className="font-bold text-lg">Events</h1>
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
          {/* Horizontal Slider */}
          <PageSlider orientation="horizontal" />

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-6 px-4">
            <Search className="absolute left-8 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full"
            />
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents?.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden rounded-t-lg">
                    <img
                      src={
                        event.image_url ||
                        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold text-lg">{event.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      {event.rating && (
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="text-gray-700">
                            {event.rating.toFixed(1)} / 5
                          </span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4" onClick={() => handlePurchase(event)}>
                      <Ticket className="mr-2" />
                      Purchase Ticket
                    </Button>
                  </div>
                </Card>
              ))}
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
