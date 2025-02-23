import { PageSlider } from "@/components/PageSlider";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Travel = () => {
  const { toast } = useToast();

  const { data: destinations } = useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(6);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching destinations",
          description: error.message,
        });
        throw error;
      }
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PageSlider />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          {destinations?.map((destination) => (
            <Card 
              key={destination.id} 
              className="w-full hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={destination.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800'} 
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{destination.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{destination.location}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">${destination.price}</span>
                  {destination.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm">{destination.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Travel;