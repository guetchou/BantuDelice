import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Database } from '@/integrations/supabase/types';

type TaxiPayment = Database['public']['Tables']['taxi_payments']['Row'];

export default function TaxiBookingForm() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create the ride
      const { data: rideData, error: rideError } = await supabase
        .from('taxi_rides')
        .insert({
          pickup_address: pickup,
          destination_address: destination,
          status: 'pending',
          pickup_time: new Date().toISOString(),
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (rideError) throw rideError;

      // Create initial payment record
      const { error: paymentError } = await supabase
        .from('taxi_payments')
        .insert({
          ride_id: rideData.id,
          amount: 0, // Will be updated when driver accepts
          payment_status: 'pending'
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Réservation créée",
        description: "Votre course a été enregistrée avec succès",
      });

      navigate(`/taxi/ride/${rideData.id}`);
    } catch (error) {
      console.error('Error booking taxi:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
          Point de départ
        </label>
        <Input
          id="pickup"
          type="text"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
          placeholder="Entrez l'adresse de départ"
        />
      </div>

      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <Input
          id="destination"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          placeholder="Entrez l'adresse de destination"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Réservation en cours...' : 'Réserver maintenant'}
      </Button>
    </form>
  );
}