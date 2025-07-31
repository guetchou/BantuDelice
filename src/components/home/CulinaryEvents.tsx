
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CulturalEvent } from "@/types/cultural";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CulinaryEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: events, isLoading } = useQuery({
    queryKey: ['culinaryEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cultural_events')
        .select('*')
        .eq('category', 'gastronomie')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true })
        .limit(3);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les événements culinaires",
          variant: "destructive",
        });
        throw error;
      }

      return data as CulturalEvent[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Chargement des événements...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Événements Culinaires à Venir
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les événements gastronomiques qui célèbrent la cuisine congolaise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full">
                    {event.price === 0 ? 'Gratuit' : `${event.price.toLocaleString()} FCFA`}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.event_date), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {event.registered_count} / {event.capacity || '∞'} participants
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    S'inscrire
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/events')}
            className="border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Voir tous les événements
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CulinaryEvents;
