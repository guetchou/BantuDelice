
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from 'date-fns';
import { 
  Building, 
  GraduationCap, 
  MapPin, 
  Clock, 
  Users, 
  CreditCard, 
  User, 
  Car, 
  Plus, 
  Trash, 
  Edit, 
  Check, 
  Landmark,
  Bus,
  Route,
  CalendarDays,
  Building2,
  UserCircle
} from "lucide-react";
import { useRidesharing } from '@/hooks/useRidesharing';
import { useUser } from '@/hooks/useUser';
import { 
  Organization, 
  OrganizationRoute, 
  OrganizationMember,
  OrganizationTripAssignment,
  RidesharingTrip
} from '@/types/ridesharing';

interface OrganizationTripsTabProps {
  onNavigateToSearch: () => void;
  onNavigateToCreate: () => void;
}

const OrganizationTripsTab: React.FC<OrganizationTripsTabProps> = ({
  onNavigateToSearch,
  onNavigateToCreate
}) => {
  const { user } = useUser();
  const ridesharing = useRidesharing();
  const [activeTab, setActiveTab] = useState<string>('routes');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [routes, setRoutes] = useState<OrganizationRoute[]>([]);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [assignments, setAssignments] = useState<OrganizationTripAssignment[]>([]);
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [newRoute, setNewRoute] = useState<Partial<OrganizationRoute>>({
    name: '',
    description: '',
    destination_address: '',
    destination_latitude: 0,
    destination_longitude: 0,
    active: true,
    schedule: [
      {
        day: 'monday',
        arrival_time: '08:30',
        departure_time: '17:30'
      }
    ]
  });
  
  // Mock organization data (in a real app this would come from the backend)
  const mockOrganizations: Organization[] = [
    {
      id: "org-1",
      name: "Université Marien Ngouabi",
      type: "university",
      address: "Avenue de l'Université, Brazzaville",
      logo_url: "https://randomuser.me/api/portraits/men/32.jpg",
      contact_email: "contact@umng.cg",
      contact_phone: "+242 123 456 789",
      created_at: new Date().toISOString(),
      subsidy_policy: {
        subsidy_type: "fixed",
        subsidy_amount: 500,
        subsidy_cap: 2000,
        min_riders_required: 3,
        active: true,
        applies_to_recurring_only: true
      }
    },
    {
      id: "org-2",
      name: "Lycée Savorgnan de Brazza",
      type: "school",
      address: "Avenue du Lycée, Brazzaville",
      contact_email: "contact@lsb.cg",
      created_at: new Date().toISOString(),
      subsidy_policy: {
        subsidy_type: "percentage",
        subsidy_amount: 30,
        active: true
      }
    },
    {
      id: "org-3",
      name: "Ministère des Transports",
      type: "government",
      address: "Boulevard des Ministères, Brazzaville",
      contact_email: "contact@transport.gouv.cg",
      created_at: new Date().toISOString(),
      subsidy_policy: {
        subsidy_type: "full",
        subsidy_amount: 100,
        active: true,
        applies_to_recurring_only: true
      }
    }
  ];
  
  // Mock routes data
  const mockRoutes: OrganizationRoute[] = [
    {
      id: "route-1",
      organization_id: "org-1",
      name: "Campus - Centre-ville",
      description: "Route quotidienne du campus au centre-ville",
      destination_address: "Université Marien Ngouabi, Brazzaville",
      destination_latitude: -4.2679,
      destination_longitude: 15.2516,
      schedule: [
        { day: "monday", arrival_time: "08:00", departure_time: "17:30" },
        { day: "tuesday", arrival_time: "08:00", departure_time: "17:30" },
        { day: "wednesday", arrival_time: "08:00", departure_time: "17:30" },
        { day: "thursday", arrival_time: "08:00", departure_time: "17:30" },
        { day: "friday", arrival_time: "08:00", departure_time: "17:30" }
      ],
      active: true,
      created_at: new Date().toISOString(),
      intermediate_stops: [
        {
          address: "Marché Total, Brazzaville",
          latitude: -4.2602,
          longitude: 15.2462,
          order: 1,
          name: "Marché Total"
        },
        {
          address: "Rond-point CCF, Brazzaville",
          latitude: -4.2634,
          longitude: 15.2491,
          order: 2,
          name: "CCF"
        }
      ]
    },
    {
      id: "route-2",
      organization_id: "org-1",
      name: "Campus - Bacongo",
      description: "Desserte du quartier Bacongo",
      destination_address: "Université Marien Ngouabi, Brazzaville",
      destination_latitude: -4.2679,
      destination_longitude: 15.2516,
      schedule: [
        { day: "monday", arrival_time: "08:30", departure_time: "18:00" },
        { day: "wednesday", arrival_time: "08:30", departure_time: "18:00" },
        { day: "friday", arrival_time: "08:30", departure_time: "18:00" }
      ],
      active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "route-3",
      organization_id: "org-2",
      name: "Lycée - Poto-Poto",
      description: "Desserte de Poto-Poto pour les lycéens",
      destination_address: "Lycée Savorgnan de Brazza, Brazzaville",
      destination_latitude: -4.2701,
      destination_longitude: 15.2628,
      schedule: [
        { day: "monday", arrival_time: "07:30", departure_time: "16:30" },
        { day: "tuesday", arrival_time: "07:30", departure_time: "16:30" },
        { day: "wednesday", arrival_time: "07:30", departure_time: "12:30" },
        { day: "thursday", arrival_time: "07:30", departure_time: "16:30" },
        { day: "friday", arrival_time: "07:30", departure_time: "16:30" }
      ],
      active: true,
      created_at: new Date().toISOString()
    }
  ];
  
  // Mock members data
  const mockMembers: OrganizationMember[] = [
    {
      id: "member-1",
      organization_id: "org-1",
      user_id: "d1",
      employee_id: "EMP001",
      member_role: "driver",
      department: "Transport",
      status: "active",
      join_date: "2023-01-15",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "member-2",
      organization_id: "org-1",
      user_id: "d2",
      employee_id: "EMP002",
      member_role: "regular",
      department: "Administration",
      status: "active",
      join_date: "2023-02-10",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "member-3",
      organization_id: "org-1",
      user_id: "d3",
      employee_id: "EMP003",
      member_role: "admin",
      department: "Direction",
      status: "active",
      join_date: "2022-12-05",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Mock assignments data
  const mockAssignments: OrganizationTripAssignment[] = [
    {
      id: "assignment-1",
      organization_id: "org-1",
      route_id: "route-1",
      trip_id: "trip-001",
      driver_id: "d1",
      capacity: 4,
      status: "scheduled",
      recurrence_pattern: {
        frequency: "weekdays",
        days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        start_date: "2023-08-01",
        auto_accept_riders: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "assignment-2",
      organization_id: "org-1",
      route_id: "route-2",
      trip_id: "trip-002",
      driver_id: "d2",
      capacity: 3,
      status: "scheduled",
      recurrence_pattern: {
        frequency: "custom",
        days_of_week: ["monday", "wednesday", "friday"],
        start_date: "2023-08-01",
        auto_accept_riders: true
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  // Load organization data
  useEffect(() => {
    // In a real app, this would fetch from the backend
    setOrganizations(mockOrganizations);
    if (mockOrganizations.length > 0) {
      setSelectedOrganization(mockOrganizations[0]);
      
      // Filter routes for the selected organization
      const orgRoutes = mockRoutes.filter(
        route => route.organization_id === mockOrganizations[0].id
      );
      setRoutes(orgRoutes);
      
      // Filter members for the selected organization
      const orgMembers = mockMembers.filter(
        member => member.organization_id === mockOrganizations[0].id
      );
      setMembers(orgMembers);
      
      // Filter assignments for the selected organization
      const orgAssignments = mockAssignments.filter(
        assignment => assignment.organization_id === mockOrganizations[0].id
      );
      setAssignments(orgAssignments);
    }
  }, []);
  
  // Handle organization change
  const handleOrganizationChange = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setSelectedOrganization(org);
      
      // Filter routes for the selected organization
      const orgRoutes = mockRoutes.filter(route => route.organization_id === orgId);
      setRoutes(orgRoutes);
      
      // Filter members for the selected organization
      const orgMembers = mockMembers.filter(member => member.organization_id === orgId);
      setMembers(orgMembers);
      
      // Filter assignments for the selected organization
      const orgAssignments = mockAssignments.filter(assignment => assignment.organization_id === orgId);
      setAssignments(orgAssignments);
    }
  };
  
  // Add a new route
  const handleAddRoute = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (selectedOrganization) {
        const newRouteData: OrganizationRoute = {
          id: `route-${Math.floor(Math.random() * 1000)}`,
          organization_id: selectedOrganization.id,
          name: newRoute.name || 'Nouveau trajet',
          description: newRoute.description || '',
          destination_address: newRoute.destination_address || 'Adresse de destination',
          destination_latitude: newRoute.destination_latitude || 0,
          destination_longitude: newRoute.destination_longitude || 0,
          schedule: newRoute.schedule || [],
          active: true,
          created_at: new Date().toISOString()
        };
        
        setRoutes([...routes, newRouteData]);
        setIsAddingRoute(false);
        setNewRoute({
          name: '',
          description: '',
          destination_address: '',
          destination_latitude: 0,
          destination_longitude: 0,
          active: true,
          schedule: [
            {
              day: 'monday',
              arrival_time: '08:30',
              departure_time: '17:30'
            }
          ]
        });
        
        toast.success('Itinéraire ajouté avec succès !');
      } else {
        toast.error('Veuillez sélectionner une organisation');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Create assignment for a route
  const handleCreateAssignment = (routeId: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newAssignment: OrganizationTripAssignment = {
        id: `assignment-${Math.floor(Math.random() * 1000)}`,
        organization_id: selectedOrganization?.id || '',
        route_id: routeId,
        trip_id: `trip-${Math.floor(Math.random() * 1000)}`,
        driver_id: members.find(m => m.member_role === 'driver')?.user_id || 'd1',
        capacity: 4,
        status: 'scheduled',
        recurrence_pattern: {
          frequency: 'weekdays',
          days_of_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_date: format(new Date(), 'yyyy-MM-dd'),
          auto_accept_riders: true
        },
        created_at: new Date().toISOString()
      };
      
      setAssignments([...assignments, newAssignment]);
      toast.success('Covoiturage programmé avec succès !');
      setIsLoading(false);
    }, 1000);
  };

  // Handle address search to get coordinates
  const handleAddressSearch = (address: string) => {
    // Simulate geocoding with random coordinates (for demo purposes)
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    const baseLatitude = -4.2634; // Brazzaville
    const baseLongitude = 15.2429;
    
    setNewRoute((prev) => ({
      ...prev,
      destination_address: address,
      destination_latitude: baseLatitude + randomOffset(),
      destination_longitude: baseLongitude + randomOffset()
    }));
  };
  
  const getOrganizationTypeIcon = (type: string) => {
    switch (type) {
      case 'university':
      case 'school':
        return <GraduationCap className="h-5 w-5" />;
      case 'government':
        return <Landmark className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Organization selection header */}
      <div className="bg-primary/10 p-5 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              {selectedOrganization && getOrganizationTypeIcon(selectedOrganization.type)}
            </div>
            
            <Select 
              value={selectedOrganization?.id || ''} 
              onValueChange={handleOrganizationChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Sélectionner une organisation" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>
                    <div className="flex items-center gap-2">
                      {getOrganizationTypeIcon(org.type)}
                      <span>{org.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedOrganization?.subsidy_policy && (
            <Badge 
              variant="outline" 
              className="bg-green-50 text-green-700 border-green-200"
            >
              {selectedOrganization.subsidy_policy.subsidy_type === 'full' 
                ? 'Transport entièrement subventionné' 
                : selectedOrganization.subsidy_policy.subsidy_type === 'percentage'
                  ? `Subvention de ${selectedOrganization.subsidy_policy.subsidy_amount}%`
                  : `Subvention de ${selectedOrganization.subsidy_policy.subsidy_amount} FCFA`
              }
            </Badge>
          )}
        </div>
        
        {selectedOrganization && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{selectedOrganization.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{members.length} membres</span>
            </div>
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-gray-500" />
              <span>{routes.length} itinéraires</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="routes" className="flex items-center gap-1">
            <Route className="h-4 w-4" />
            <span>Itinéraires</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-1">
            <UserCircle className="h-4 w-4" />
            <span>Membres</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-1">
            <Bus className="h-4 w-4" />
            <span>Covoiturages</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Itinéraires disponibles</h3>
            <Button 
              onClick={() => setIsAddingRoute(!isAddingRoute)}
              variant={isAddingRoute ? "destructive" : "default"}
              size="sm"
            >
              {isAddingRoute ? (
                <>
                  <Trash className="h-4 w-4 mr-1" /> Annuler
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" /> Ajouter un itinéraire
                </>
              )}
            </Button>
          </div>
          
          {isAddingRoute ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nouvel itinéraire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="route-name">Nom de l'itinéraire</Label>
                      <Input 
                        id="route-name" 
                        placeholder="Ex: Campus - Centre-ville" 
                        value={newRoute.name}
                        onChange={(e) => setNewRoute({...newRoute, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="route-description">Description</Label>
                      <Input 
                        id="route-description" 
                        placeholder="Description de l'itinéraire" 
                        value={newRoute.description}
                        onChange={(e) => setNewRoute({...newRoute, description: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="route-destination">Adresse de destination</Label>
                    <Input 
                      id="route-destination" 
                      placeholder="Adresse de l'organisation" 
                      value={newRoute.destination_address}
                      onChange={(e) => setNewRoute({...newRoute, destination_address: e.target.value})}
                      onBlur={(e) => handleAddressSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Jours et horaires</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schedule-day">Jour</Label>
                        <Select 
                          value={newRoute.schedule?.[0]?.day || 'monday'}
                          onValueChange={(value) => setNewRoute({
                            ...newRoute, 
                            schedule: [{
                              ...newRoute.schedule?.[0],
                              day: value as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
                            }]
                          })}
                        >
                          <SelectTrigger id="schedule-day">
                            <SelectValue placeholder="Jour" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">Lundi</SelectItem>
                            <SelectItem value="tuesday">Mardi</SelectItem>
                            <SelectItem value="wednesday">Mercredi</SelectItem>
                            <SelectItem value="thursday">Jeudi</SelectItem>
                            <SelectItem value="friday">Vendredi</SelectItem>
                            <SelectItem value="saturday">Samedi</SelectItem>
                            <SelectItem value="sunday">Dimanche</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="arrival-time">Heure d'arrivée</Label>
                        <Input 
                          id="arrival-time"
                          type="time"
                          value={newRoute.schedule?.[0]?.arrival_time || '08:30'}
                          onChange={(e) => setNewRoute({
                            ...newRoute, 
                            schedule: [{
                              ...newRoute.schedule?.[0],
                              arrival_time: e.target.value
                            }]
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="departure-time">Heure de départ</Label>
                        <Input 
                          id="departure-time"
                          type="time"
                          value={newRoute.schedule?.[0]?.departure_time || '17:30'}
                          onChange={(e) => setNewRoute({
                            ...newRoute, 
                            schedule: [{
                              ...newRoute.schedule?.[0],
                              departure_time: e.target.value
                            }]
                          })}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Pour ajouter plusieurs jours et horaires, vous pourrez le faire après avoir créé l'itinéraire.
                    </p>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleAddRoute} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Création...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Créer l'itinéraire
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : routes.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Route className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucun itinéraire défini</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Vous n'avez pas encore défini d'itinéraires pour cette organisation. 
                  Créez un premier itinéraire pour commencer à organiser les covoiturages.
                </p>
                <Button 
                  className="mt-6"
                  onClick={() => setIsAddingRoute(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un itinéraire
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {routes.map(route => (
                <Card key={route.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium">{route.name}</h3>
                          <Badge variant={route.active ? "default" : "secondary"}>
                            {route.active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        
                        {route.description && (
                          <p className="text-gray-500 text-sm mb-4">{route.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="flex items-start mb-2">
                              <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                              <div>
                                <p className="text-gray-500 text-sm">Destination</p>
                                <p className="font-medium">{route.destination_address}</p>
                              </div>
                            </div>
                            
                            {route.intermediate_stops && route.intermediate_stops.length > 0 && (
                              <div className="flex items-start">
                                <Bus className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                                <div>
                                  <p className="text-gray-500 text-sm">Arrêts intermédiaires</p>
                                  <p className="font-medium">
                                    {route.intermediate_stops.map(stop => stop.name).join(', ')}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-start mb-2">
                              <CalendarDays className="h-5 w-5 text-primary mr-2 mt-1" />
                              <div>
                                <p className="text-gray-500 text-sm">Jours programmés</p>
                                <p className="font-medium">
                                  {route.schedule.map(s => {
                                    const dayMap: Record<string, string> = {
                                      'monday': 'Lun',
                                      'tuesday': 'Mar',
                                      'wednesday': 'Mer',
                                      'thursday': 'Jeu',
                                      'friday': 'Ven',
                                      'saturday': 'Sam',
                                      'sunday': 'Dim'
                                    };
                                    return dayMap[s.day];
                                  }).join(', ')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-primary mr-2 mt-1" />
                              <div>
                                <p className="text-gray-500 text-sm">Horaires</p>
                                <p className="font-medium">
                                  Arrivée: {route.schedule[0]?.arrival_time || '08:00'} | 
                                  Départ: {route.schedule[0]?.departure_time || '17:30'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between mt-4 md:mt-0 md:ml-6">
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info('Fonctionnalité à venir')}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          
                          {!assignments.some(a => a.route_id === route.id) && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleCreateAssignment(route.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>Programmation...</>
                              ) : (
                                <>
                                  <Car className="h-4 w-4 mr-1" />
                                  Programmer un covoiturage
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Membres de l'organisation</h3>
            <Button 
              onClick={() => toast.info('Fonctionnalité à venir')}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Ajouter un membre
            </Button>
          </div>
          
          {members.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucun membre</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Vous n'avez pas encore ajouté de membres à cette organisation.
                </p>
                <Button 
                  className="mt-6"
                  onClick={() => toast.info('Fonctionnalité à venir')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter un membre
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {members.map(member => (
                <Card key={member.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">
                                {/* In a real app, we would fetch user info */}
                                {member.user_id === 'd1' ? 'Thomas Mbengue' : 
                                 member.user_id === 'd2' ? 'Marie Loemba' : 
                                 member.user_id === 'd3' ? 'Paul Moukala' : 'Utilisateur'}
                              </h3>
                              <Badge variant={member.status === 'active' ? 'outline' : 'secondary'}>
                                {member.status === 'active' ? 'Actif' : 'Inactif'}
                              </Badge>
                              
                              {member.member_role === 'driver' && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  Conducteur
                                </Badge>
                              )}
                              
                              {member.member_role === 'admin' && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                  Administrateur
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-500 mt-1">
                              {member.employee_id && (
                                <span className="mr-4">ID: {member.employee_id}</span>
                              )}
                              {member.department && (
                                <span className="mr-4">Département: {member.department}</span>
                              )}
                              <span>Membre depuis: {new Date(member.join_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button variant="outline" size="sm" onClick={() => toast.info('Fonctionnalité à venir')}>
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            
                            {member.member_role === 'driver' ? (
                              <Button variant="outline" size="sm" onClick={() => toast.info('Fonctionnalité à venir')}>
                                Voir les trajets
                              </Button>
                            ) : (
                              <Button variant="default" size="sm" onClick={() => toast.info('Fonctionnalité à venir')}>
                                Assigner comme conducteur
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Trajets programmés</h3>
            <Button 
              onClick={() => setActiveTab('routes')}
              size="sm"
              variant="outline"
            >
              <Route className="h-4 w-4 mr-1" /> Voir les itinéraires
            </Button>
          </div>
          
          {assignments.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">Aucun trajet programmé</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Vous n'avez pas encore programmé de trajets. Choisissez un itinéraire et assignez un conducteur.
                </p>
                <Button 
                  className="mt-6"
                  onClick={() => setActiveTab('routes')}
                >
                  <Route className="h-4 w-4 mr-1" />
                  Voir les itinéraires
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignments.map(assignment => {
                // Find the corresponding route
                const route = routes.find(r => r.id === assignment.route_id);
                
                return (
                  <Card key={assignment.id} className="overflow-hidden hover:shadow-md transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{route?.name || 'Trajet'}</h3>
                            <Badge variant={assignment.status === 'scheduled' ? 'default' : 'secondary'}>
                              {assignment.status === 'scheduled' ? 'Programmé' : 
                               assignment.status === 'ongoing' ? 'En cours' : 
                               assignment.status === 'completed' ? 'Terminé' : 'Annulé'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                              <div className="flex items-start mb-2">
                                <MapPin className="h-5 w-5 text-primary mr-2 mt-1" />
                                <div>
                                  <p className="text-gray-500 text-sm">Destination</p>
                                  <p className="font-medium">{route?.destination_address || 'Destination'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start">
                                <User className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                                <div>
                                  <p className="text-gray-500 text-sm">Conducteur</p>
                                  <p className="font-medium">
                                    {assignment.driver_id === 'd1' ? 'Thomas Mbengue' :
                                     assignment.driver_id === 'd2' ? 'Marie Loemba' :
                                     assignment.driver_id === 'd3' ? 'Paul Moukala' : 'Conducteur'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-start mb-2">
                                <CalendarDays className="h-5 w-5 text-primary mr-2 mt-1" />
                                <div>
                                  <p className="text-gray-500 text-sm">Récurrence</p>
                                  <p className="font-medium">
                                    {assignment.recurrence_pattern?.frequency === 'weekdays' ? 'Jours de semaine' :
                                     assignment.recurrence_pattern?.frequency === 'daily' ? 'Tous les jours' :
                                     assignment.recurrence_pattern?.frequency === 'weekly' ? 'Hebdomadaire' : 'Personnalisé'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start">
                                <Users className="h-5 w-5 text-primary mr-2 mt-1" />
                                <div>
                                  <p className="text-gray-500 text-sm">Capacité</p>
                                  <p className="font-medium">
                                    {assignment.capacity} places
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-between mt-4 md:mt-0 md:ml-6">
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info('Fonctionnalité à venir')}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast.info('Fonctionnalité à venir')}
                            >
                              Voir les inscrits
                            </Button>
                            
                            <Button
                              variant="default"
                              size="sm"
                              onClick={onNavigateToSearch}
                            >
                              Voir le trajet
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationTripsTab;
