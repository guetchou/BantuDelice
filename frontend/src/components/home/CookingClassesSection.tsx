
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { CookingClass } from "@/types/cultural";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChefHat, Users, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  'débutant': 'bg-green-100 text-green-800',
  'intermédiaire': 'bg-yellow-100 text-yellow-800',
  'avancé': 'bg-red-100 text-red-800',
};

const CookingClassesSection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: classes, isLoading } = useQuery({
    queryKey: ['cookingClasses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cooking_classes')
        .select('*')
        .eq('status', 'scheduled')
        .order('schedule', { ascending: true })
        .limit(3);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les cours de cuisine",
          variant: "destructive",
        });
        throw error;
      }

      return data as CookingClass[];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Chargement des cours...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Cours de Cuisine
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Apprenez à cuisiner avec nos chefs experts et découvrez les secrets de la cuisine congolaise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes?.map((cookingClass, index) => (
            <motion.div
              key={cookingClass.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{cookingClass.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[cookingClass.difficulty_level]}`}>
                      {cookingClass.difficulty_level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{cookingClass.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {format(new Date(cookingClass.schedule), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Cuisine {cookingClass.cuisine_type}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {cookingClass.current_participants} / {cookingClass.max_participants} participants
                    </div>
                    <div className="flex items-center text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      {cookingClass.duration} minutes
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {cookingClass.price.toLocaleString()} FCFA
                    </span>
                    <Button 
                      className="bg-indigo-500 hover:bg-indigo-600"
                      onClick={() => navigate(`/cooking-classes/${cookingClass.id}`)}
                    >
                      Réserver
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => navigate('/cooking-classes')}
            className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
          >
            Voir tous les cours
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CookingClassesSection;
