import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";

const FeaturedEvents = () => {
  const { toast } = useToast();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(10);  // Increased to show 10 events
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: error.message,
        });
        throw error;
      }
      return data;
    }
  });

  const formatDate = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    const eventDate = new Date(date);
    return eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6 max-w-lg mx-auto">
        {events?.map((event) => (
          <Card key={event.id} className="w-full overflow-hidden bg-white">
            <div className="relative h-72">
              <img 
                src={event.image_url || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/70 px-4 py-2 rounded-full">
                <span className="text-white font-semibold text-lg">${event.price}</span>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="text-base">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="w-5 h-5" />
                <span className="text-base">{formatTime(event.date)}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-base">{event.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Tag className="w-5 h-5" />
                <span className="text-base capitalize">{event.type}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-base text-gray-600">Limited spots</span>
                </div>
                {event.rating && (
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="ml-2 text-gray-600 text-base">{event.rating}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturedEvents;