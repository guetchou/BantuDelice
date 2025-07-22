import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Download, RefreshCw, Eye, Calendar, Filter } from 'lucide-react';

const ColisHistoriquePage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Mock data - à remplacer par les vraies données
  const [colisList] = useState([
    {
      id: 'BD12345678',
      type: 'national',
      status: 'Livré',
      sender: 'Jean Dupont',
      recipient: 'Marie Martin',
      from: 'Brazzaville',
      to: 'Pointe-Noire',
      date: '2024-07-15',
      price: 2500,
      weight: '2.5kg'
    },
    {
      id: 'BD87654321',
      type: 'international',
      status: 'En transit',
      sender: 'Jean Dupont',
      recipient: 'Pierre Durand',
      from: 'Brazzaville',
      to: 'Paris',
      date: '2024-07-10',
      price: 15000,
      weight: '1.8kg'
    },
    {
      id: 'BD11223344',
      type: 'national',
      status: 'En cours de livraison',
      sender: 'Jean Dupont',
      recipient: 'Sophie Bernard',
      from: 'Brazzaville',
      to: 'Dolisie',
      date: '2024-07-18',
      price: 3000,
      weight: '3.2kg'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Livré': return 'bg-green-100 text-green-800';
      case 'En cours de livraison': return 'bg-orange-100 text-orange-800';
      case 'En transit': return 'bg-blue-100 text-blue-800';
      case 'Pris en charge': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'national' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  const filteredColis = colisList.filter(colis => {
    if (filters.status && colis.status !== filters.status) return false;
    if (filters.type && colis.type !== filters.type) return false;
    if (filters.search && !colis.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const downloadLabel = (colisId: string) => {
    // Simulation de téléchargement d'étiquette
    console.log(`Téléchargement étiquette pour ${colisId}`);
  };

  const resendColis = (colisId: string) => {
    // Simulation de réexpédition
    console.log(`Réexpédition du colis ${colisId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-200">
      {/* Header avec navigation */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/logo/logo.png" alt="BantuDelice" className="h-10 w-10 rounded-full border-2 border-yellow-400 shadow" />
              <span className="font-bold text-orange-700 text-xl">BantuDelice Colis</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colis" className="text-orange-700 hover:text-orange-900 font-medium">Accueil</Link>
              <Link to="/colis/tracking" className="text-orange-700 hover:text-orange-900 font-medium">Suivi</Link>
              <Link to="/colis/tarifs" className="text-orange-700 hover:text-orange-900 font-medium">Tarifs</Link>
              <Link to="/colis/expedier" className="text-orange-700 hover:text-orange-900 font-medium">Expédier</Link>
              <Link to="/colis/historique" className="text-orange-700 hover:text-orange-900 font-medium">Historique</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
              <Link to="/colis/tracking">Suivre un colis</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-700 mb-2">Historique des envois</h1>
          <p className="text-gray-600">Consultez et gérez tous vos colis envoyés</p>
        </div>

        {/* Filtres */}
        <Card className="bg-white/90 backdrop-blur border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Numéro de tracking"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="Pris en charge">Pris en charge</SelectItem>
                    <SelectItem value="En transit">En transit</SelectItem>
                    <SelectItem value="En cours de livraison">En cours de livraison</SelectItem>
                    <SelectItem value="Livré">Livré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                <Input 
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                <Input 
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                {filteredColis.length} colis trouvé(s)
              </div>
              <Button 
                onClick={() => setFilters({status: '', type: '', dateFrom: '', dateTo: '', search: ''})}
                variant="outline"
                className="border-orange-300 text-orange-700"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des colis */}
        <div className="space-y-4">
          {filteredColis.map((colis) => (
            <Card key={colis.id} className="bg-white/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Informations principales */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-orange-500" />
                        <span className="font-bold text-lg">{colis.id}</span>
                      </div>
                      <Badge className={getStatusColor(colis.status)}>
                        {colis.status}
                      </Badge>
                      <Badge className={getTypeColor(colis.type)}>
                        {colis.type === 'national' ? 'National' : 'International'}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expéditeur :</span>
                        <div className="font-medium">{colis.sender}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Destinataire :</span>
                        <div className="font-medium">{colis.recipient}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Trajet :</span>
                        <div className="font-medium">{colis.from} → {colis.to}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Poids :</span>
                        <div className="font-medium">{colis.weight}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {colis.date}
                      </div>
                      <div className="font-medium text-orange-600">
                        {colis.price.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button asChild size="sm" className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white">
                      <Link to={`/colis/tracking?number=${colis.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Suivre
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => downloadLabel(colis.id)}
                      size="sm" 
                      variant="outline"
                      className="border-orange-300 text-orange-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Étiquette
                    </Button>
                    <Button 
                      onClick={() => resendColis(colis.id)}
                      size="sm" 
                      variant="outline"
                      className="border-blue-300 text-blue-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réexpédier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun colis */}
        {filteredColis.length === 0 && (
          <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun colis trouvé</h3>
              <p className="text-gray-500 mb-6">
                Aucun colis ne correspond à vos critères de recherche.
              </p>
              <Button asChild className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-bold">
                <Link to="/colis/expedier">Expédier un colis</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistiques */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-orange-700 mb-6">Statistiques</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{colisList.length}</div>
                <div className="text-gray-600">Total des envois</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {colisList.filter(c => c.status === 'Livré').length}
                </div>
                <div className="text-gray-600">Livrés</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {colisList.filter(c => c.type === 'international').length}
                </div>
                <div className="text-gray-600">Internationaux</div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {colisList.reduce((sum, c) => sum + c.price, 0).toLocaleString()}
                </div>
                <div className="text-gray-600">FCFA dépensés</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColisHistoriquePage; 