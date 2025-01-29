import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ChefHat, Truck, Package, Heart, Car, Calendar, Fuel } from "lucide-react";

interface BookingFormData {
  date: string;
  time: string;
  notes: string;
}

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<BookingFormData>();

  const services = [
    {
      icon: <ChefHat className="w-12 h-12 text-primary" />,
      title: "Service Traiteur",
      description: "Service traiteur professionnel pour vos événements",
      price: 25000
    },
    {
      icon: <Car className="w-12 h-12 text-primary" />,
      title: "Transport VIP",
      description: "Service de transport personnalisé",
      price: 15000
    },
    {
      icon: <Fuel className="w-12 h-12 text-primary" />,
      title: "Livraison de Gaz",
      description: "Livraison rapide et sécurisée à domicile",
      price: 5000
    },
    {
      icon: <Calendar className="w-12 h-12 text-primary" />,
      title: "Réservations",
      description: "Réservez une table dans nos restaurants partenaires",
      price: 10000
    }
  ];

  const handleBookService = async (service: any) => {
    setSelectedService(service);
    setIsBooking(true);
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour réserver un service",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        service_name: selectedService.title,
        total_amount: selectedService.price,
        status: 'pending',
        notes: data.notes,
        scheduled_date: `${data.date}T${data.time}`,
      });

      if (error) throw error;

      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès",
      });

      setIsBooking(false);
      navigate("/orders");
    } catch (error) {
      console.error('Error booking service:', error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la réservation",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Nos Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              {service.icon}
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="font-semibold">{service.price.toLocaleString('fr-FR')} FCFA</p>
              <Button 
                className="w-full"
                onClick={() => handleBookService(service)}
              >
                Réserver
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isBooking} onOpenChange={setIsBooking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver {selectedService?.title}</DialogTitle>
            <DialogDescription>
              Choisissez la date et l'heure de votre réservation
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes spéciales</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ajoutez des instructions spéciales si nécessaire" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsBooking(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Confirmer la réservation
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;