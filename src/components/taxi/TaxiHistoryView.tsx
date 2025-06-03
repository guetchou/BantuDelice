
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, CreditCard, Star, Search, Filter, Download } from "lucide-react";
import { TaxiRide } from '@/types/taxi';
import { useToast } from '@/hooks/use-toast';

interface TaxiHistoryViewProps {
  userId?: string;
}

const TaxiHistoryView: React.FC<TaxiHistoryViewProps> = ({ userId }) => {
  const [rides, setRides] = useState<TaxiRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<TaxiRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockRides: TaxiRide[] = [
      {
        id: '1',
        pickup_address: 'Gombe, Kinshasa',
        destination_address: 'Limete, Kinshasa',
        status: 'completed',
        price: 15000,
        distance: 12,
        duration: 25,
        created_at: '2024-01-15T10:30:00Z',
        estimated_price: 15000,
        payment_status: 'paid',
        vehicle_type: 'standard',
        payment_method: 'mobile_money'
      },
      {
        id: '2',
        pickup_address: 'Bandalungwa, Kinshasa',
        destination_address: 'Kintambo, Kinshasa',
        status: 'completed',
        price: 8000,
        distance: 6,
        duration: 15,
        created_at: '2024-01-14T14:15:00Z',
        estimated_price: 8000,
        payment_status: 'paid',
        vehicle_type: 'comfort',
        payment_method: 'credit_card'
      },
      {
        id: '3',
        pickup_address: 'Matete, Kinshasa',
        destination_address: 'Centre-ville, Kinshasa',
        status: 'cancelled',
        price: 0,
        distance: 0,
        duration: 0,
        created_at: '2024-01-13T09:45:00Z',
        estimated_price: 12000,
        payment_status: 'pending',
        vehicle_type: 'standard',
        payment_method: 'cash'
      }
    ];
    
    setRides(mockRides);
    setFilteredRides(mockRides);
    setLoading(false);
  }, [userId]);

  // Filter rides based on search and filters
  useEffect(() => {
    let filtered = [...rides];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(ride =>
        ride.pickup_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.destination_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ride => ride.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(ride => ride.payment_method === paymentFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (dateRange !== 'all') {
        filtered = filtered.filter(ride => new Date(ride.created_at) >= filterDate);
      }
    }

    setFilteredRides(filtered);
  }, [rides, searchQuery, statusFilter, paymentFilter, dateRange]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'completed': 'default',
      'cancelled': 'destructive',
      'in_progress': 'secondary',
      'pending': 'outline'
    } as const;
    
    const labels = {
      'completed': 'Terminée',
      'cancelled': 'Annulée',
      'in_progress': 'En cours',
      'pending': 'En attente'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      'cash': 'Espèces',
      'credit_card': 'Carte bancaire',
      'mobile_money': 'Mobile Money',
      'wallet': 'Portefeuille'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} FCFA`;
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Date', 'Départ', 'Destination', 'Statut', 'Prix', 'Paiement'],
      ...filteredRides.map(ride => [
        new Date(ride.created_at).toLocaleDateString(),
        ride.pickup_address,
        ride.destination_address,
        ride.status,
        ride.price.toString(),
        getPaymentMethodLabel(ride.payment_method || '')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historique_courses.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "L'historique a été exporté avec succès",
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Historique des courses</span>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les paiements</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="credit_card">Carte bancaire</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="wallet">Portefeuille</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {filteredRides.length === 0 ? (
            <div className="text-center p-8">
              <div className="text-gray-400 mb-2">
                <Filter className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500">Aucune course trouvée avec ces critères</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => (
                <Card key={ride.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Course #{ride.id.substring(0, 8)}</span>
                          {getStatusBadge(ride.status)}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Départ</p>
                              <p className="font-medium">{ride.pickup_address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Destination</p>
                              <p className="font-medium">{ride.destination_address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:text-right space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(ride.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(ride.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {getPaymentMethodLabel(ride.payment_method || '')}
                          </span>
                        </div>
                        
                        <div className="text-lg font-bold">
                          {formatPrice(ride.price)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxiHistoryView;
