
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRidesharing } from '@/hooks/useRidesharing';
import { RecurringTripMatch, RidesharingTrip } from '@/types/ridesharing';
import RecurringTripMatches from './RecurringTripMatches';
import RecurringTripDetails from './RecurringTripDetails';
import RecurringBookingModal from './RecurringBookingModal';
import UserRecurringTrips from './UserRecurringTrips';
import OrganizationTripsTab from './OrganizationTripsTab';
import { Repeat, Search, Plus, Building2, User } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

interface RecurringTripsTabProps {
  onNavigateToSearch: () => void;
  onNavigateToCreate: () => void;
}

const RecurringTripsTab: React.FC<RecurringTripsTabProps> = ({
  onNavigateToSearch,
  onNavigateToCreate
}) => {
  const { user } = useUser();
  const ridesharing = useRidesharing();
  const [activeTab, setActiveTab] = useState<string>('matches');
  const [selectedTrip, setSelectedTrip] = useState<RidesharingTrip | null>(null);
  const [tripDetailsOpen, setTripDetailsOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  // Mock driver data (in a real app this would come from the backend)
  const driverData = {
    "driver-001": { name: "Thomas Mbengue", avatar: "https://randomuser.me/api/portraits/men/32.jpg", rating: 4.8, trips: 127 },
    "driver-002": { name: "Marie Loemba", avatar: "https://randomuser.me/api/portraits/women/44.jpg", rating: 4.9, trips: 89 },
    "driver-003": { name: "Paul Moukala", avatar: "https://randomuser.me/api/portraits/men/22.jpg", rating: 4.7, trips: 53 },
    "d1": { name: "Sandrine Loubota", avatar: "https://randomuser.me/api/portraits/women/28.jpg", rating: 4.6, trips: 32 },
  };
  
  useEffect(() => {
    // Initial data loading
    if (activeTab === 'matches') {
      ridesharing.findRecurringTripMatches({});
    } else if (activeTab === 'my-trips' && user) {
      ridesharing.fetchMyTrips();
    }
  }, [activeTab, ridesharing, user]);
  
  // Handle trip selection
  const handleSelectTrip = (tripId: string) => {
    const trip = ridesharing.recurringTrips.find(t => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setTripDetailsOpen(true);
    }
  };
  
  // Handle trip booking
  const handleBookTrip = (trip: RidesharingTrip) => {
    setSelectedTrip(trip);
    setTripDetailsOpen(false);
    setBookingModalOpen(true);
  };
  
  // Confirm booking
  const handleConfirmBooking = async (bookingData: any) => {
    if (!selectedTrip) return;
    
    try {
      const booking = await ridesharing.bookRecurringTrip(selectedTrip.id, bookingData);
      if (booking) {
        setBookingModalOpen(false);
        setActiveTab('my-trips');
        await ridesharing.fetchMyTrips();
      }
    } catch (error) {
      console.error("Error booking recurring trip:", error);
    }
  };
  
  // Handle trip editing
  const handleEditTrip = (tripId: string) => {
    // Implementation would navigate to the edit form
    console.log("Edit trip:", tripId);
  };
  
  // Handle trip pausing
  const handlePauseTrip = async (tripId: string) => {
    await ridesharing.pauseRecurringTrip(tripId);
    await ridesharing.fetchMyTrips();
  };
  
  // Handle trip resuming
  const handleResumeTrip = async (tripId: string) => {
    await ridesharing.resumeRecurringTrip(tripId);
    await ridesharing.fetchMyTrips();
  };
  
  // Handle trip cancellation
  const handleCancelTrip = async (tripId: string) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir annuler ce trajet ?");
    if (confirmed) {
      await ridesharing.cancelTrip(tripId);
      await ridesharing.fetchMyTrips();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-primary/10 p-5 rounded-lg flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Repeat className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Trajets réguliers</h2>
          <p className="text-gray-600">
            Optimisez vos déplacements quotidiens avec le covoiturage régulier. 
            Créez ou rejoignez des trajets récurrents pour vos déplacements domicile-travail, école ou autres destinations habituelles.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={onNavigateToSearch}>
              <Search className="mr-2 h-4 w-4" />
              Rechercher un trajet
            </Button>
            <Button variant="outline" onClick={onNavigateToCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Proposer un trajet
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="matches">
            <User className="h-4 w-4 mr-1" />
            Trajets recommandés
          </TabsTrigger>
          <TabsTrigger value="my-trips">
            <User className="h-4 w-4 mr-1" />
            Mes trajets récurrents
          </TabsTrigger>
          <TabsTrigger value="organizations">
            <Building2 className="h-4 w-4 mr-1" />
            Entreprises & Écoles
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="space-y-6">
          <RecurringTripMatches 
            matches={ridesharing.tripMatches}
            onSelectMatch={handleSelectTrip}
            onRefreshMatches={() => ridesharing.findRecurringTripMatches({})}
            isLoading={ridesharing.isLoading}
          />
        </TabsContent>
        
        <TabsContent value="my-trips">
          {user ? (
            <UserRecurringTrips 
              recurringTrips={ridesharing.recurringTrips.filter(trip => trip.driver_id === user.id)}
              recurringBookings={ridesharing.recurringBookings}
              onEditTrip={handleEditTrip}
              onPauseTrip={handlePauseTrip}
              onResumeTrip={handleResumeTrip}
              onCancelTrip={handleCancelTrip}
              onViewDetails={handleSelectTrip}
            />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <h3 className="text-xl font-medium mb-2">Connectez-vous pour accéder à vos trajets récurrents</h3>
                <p className="text-gray-500 mb-4">
                  Vous devez être connecté pour gérer vos trajets réguliers et vos réservations.
                </p>
                <Button>Se connecter</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="organizations">
          <OrganizationTripsTab 
            onNavigateToSearch={onNavigateToSearch}
            onNavigateToCreate={onNavigateToCreate}
          />
        </TabsContent>
      </Tabs>
      
      {/* Trip details dialog */}
      {selectedTrip && (
        <RecurringTripDetails 
          trip={selectedTrip}
          driverName={driverData[selectedTrip.driver_id as keyof typeof driverData]?.name || "Conducteur"}
          driverAvatar={driverData[selectedTrip.driver_id as keyof typeof driverData]?.avatar}
          driverRating={driverData[selectedTrip.driver_id as keyof typeof driverData]?.rating || 4.5}
          totalTrips={driverData[selectedTrip.driver_id as keyof typeof driverData]?.trips || 0}
          isOpen={tripDetailsOpen}
          onClose={() => setTripDetailsOpen(false)}
          onBookTrip={handleBookTrip}
        />
      )}
      
      {/* Booking modal */}
      {selectedTrip && (
        <RecurringBookingModal 
          trip={selectedTrip}
          driverName={driverData[selectedTrip.driver_id as keyof typeof driverData]?.name || "Conducteur"}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          onBook={handleConfirmBooking}
          isLoading={ridesharing.isLoading}
          selectedDays={selectedDays}
        />
      )}
    </div>
  );
};

export default RecurringTripsTab;
