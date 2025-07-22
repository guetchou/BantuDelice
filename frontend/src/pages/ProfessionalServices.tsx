import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Wrench,
  Zap,
  Home,
  Scissors,
  Heart,
  GraduationCap,
  Scale,
  Monitor,
  Truck,
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  User,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Heart as HeartIcon,
  MessageCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  basePrice: number;
  experience: string;
  qualifications: string[];
  location: string;
  isAvailable: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  avatar: string;
  photos: string[];
  availableHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
}

interface ServiceBooking {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  scheduledDate: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  clientAddress: string;
  specialRequests: string;
  createdAt: string;
}

// Données simulées
const serviceProviders: ServiceProvider[] = [
  {
    id: 'prov1',
    name: 'Jean Plomberie',
    category: 'plomberie',
    description: 'Plombier professionnel avec 15 ans d\'expérience. Spécialisé dans la réparation et l\'installation.',
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 5000,
    basePrice: 15000,
    experience: '15 ans',
    qualifications: ['Certifié plombier', 'Assurance professionnelle', 'Garantie 1 an'],
    location: 'Brazzaville Centre',
    isAvailable: true,
    isVerified: true,
    isFeatured: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    photos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
    ],
    availableHours: {
      monday: { start: '08:00', end: '18:00', available: true },
      tuesday: { start: '08:00', end: '18:00', available: true },
      wednesday: { start: '08:00', end: '18:00', available: true },
      thursday: { start: '08:00', end: '18:00', available: true },
      friday: { start: '08:00', end: '18:00', available: true },
      saturday: { start: '09:00', end: '16:00', available: true },
      sunday: { start: '10:00', end: '14:00', available: false }
    }
  },
  {
    id: 'prov2',
    name: 'Marie Électricité',
    category: 'electricite',
    description: 'Électricienne certifiée, installation et dépannage électrique. Travail soigné et sécurisé.',
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 6000,
    basePrice: 20000,
    experience: '12 ans',
    qualifications: ['Électricienne certifiée', 'Sécurité électrique', 'Installation domotique'],
    location: 'Pointe-Noire',
    isAvailable: true,
    isVerified: true,
    isFeatured: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400'
    ],
    availableHours: {
      monday: { start: '07:00', end: '19:00', available: true },
      tuesday: { start: '07:00', end: '19:00', available: true },
      wednesday: { start: '07:00', end: '19:00', available: true },
      thursday: { start: '07:00', end: '19:00', available: true },
      friday: { start: '07:00', end: '19:00', available: true },
      saturday: { start: '08:00', end: '17:00', available: true },
      sunday: { start: '09:00', end: '15:00', available: false }
    }
  },
  {
    id: 'prov3',
    name: 'Alain Jardinage',
    category: 'jardinage',
    description: 'Jardinier paysagiste, entretien de jardins, création d\'espaces verts et aménagement paysager.',
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 4000,
    basePrice: 12000,
    experience: '8 ans',
    qualifications: ['Paysagiste diplômé', 'Entretien écologique', 'Création de jardins'],
    location: 'Brazzaville',
    isAvailable: true,
    isVerified: true,
    isFeatured: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    photos: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400'
    ],
    availableHours: {
      monday: { start: '07:00', end: '17:00', available: true },
      tuesday: { start: '07:00', end: '17:00', available: true },
      wednesday: { start: '07:00', end: '17:00', available: true },
      thursday: { start: '07:00', end: '17:00', available: true },
      friday: { start: '07:00', end: '17:00', available: true },
      saturday: { start: '08:00', end: '16:00', available: true },
      sunday: { start: '09:00', end: '14:00', available: false }
    }
  }
];

const serviceCategories = [
  { id: 'plomberie', name: 'Plomberie', icon: <Wrench className="h-5 w-5" />, color: 'bg-blue-500' },
  { id: 'electricite', name: 'Électricité', icon: <Zap className="h-5 w-5" />, color: 'bg-yellow-500' },
  { id: 'menage', name: 'Ménage', icon: <Home className="h-5 w-5" />, color: 'bg-green-500' },
  { id: 'jardinage', name: 'Jardinage', icon: <Scissors className="h-5 w-5" />, color: 'bg-emerald-500' },
  { id: 'beaute', name: 'Beauté', icon: <Heart className="h-5 w-5" />, color: 'bg-pink-500' },
  { id: 'education', name: 'Éducation', icon: <GraduationCap className="h-5 w-5" />, color: 'bg-purple-500' },
  { id: 'juridique', name: 'Juridique', icon: <Scale className="h-5 w-5" />, color: 'bg-red-500' },
  { id: 'technologie', name: 'Technologie', icon: <Monitor className="h-5 w-5" />, color: 'bg-indigo-500' }
];

// Composant pour afficher un prestataire
const ServiceProviderCard: React.FC<{ provider: ServiceProvider; onBook: (provider: ServiceProvider) => void }> = ({ provider, onBook }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.avatar} />
              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{provider.name}</h3>
                {provider.isVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Vérifié
                  </Badge>
                )}
                {provider.isFeatured && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Recommandé
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {renderStars(provider.rating)}
                <span className="text-sm text-gray-600 ml-1">
                  ({provider.reviewCount} avis)
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className={isFavorite ? 'text-red-500' : 'text-gray-400'}
          >
            <HeartIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{provider.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{provider.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{provider.experience} d'expérience</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tarif horaire:</span>
            <span className="text-lg font-bold text-green-600">
              {provider.hourlyRate.toLocaleString()} FCFA/h
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Prix de base:</span>
            <span className="text-lg font-bold text-green-600">
              {provider.basePrice.toLocaleString()} FCFA
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Qualifications:</h4>
          <div className="flex flex-wrap gap-1">
            {provider.qualifications.map((qual, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {qual}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => onBook(provider)}
            className="flex-1"
            disabled={!provider.isAvailable}
          >
            Réserver
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {!provider.isAvailable && (
          <div className="flex items-center space-x-2 text-orange-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Indisponible actuellement</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour le formulaire de réservation
const BookingForm: React.FC<{ provider: ServiceProvider; onClose: () => void }> = ({ provider, onClose }) => {
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    duration: 2,
    clientAddress: '',
    specialRequests: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Réservation créée avec succès!');
    onClose();
  };

  const totalPrice = provider.hourlyRate * formData.duration;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Réserver {provider.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Heure</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée (heures)</Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 heure</SelectItem>
                <SelectItem value="2">2 heures</SelectItem>
                <SelectItem value="3">3 heures</SelectItem>
                <SelectItem value="4">4 heures</SelectItem>
                <SelectItem value="5">5 heures</SelectItem>
                <SelectItem value="6">6 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              placeholder="Votre adresse complète"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requests">Demandes spéciales</Label>
            <Textarea
              id="requests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Précisions sur le service souhaité..."
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-green-600">
                {totalPrice.toLocaleString()} FCFA
              </span>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Confirmer la réservation
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProfessionalServices() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'experience'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [activeTab, setActiveTab] = useState('providers');

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'price':
        comparison = a.hourlyRate - b.hourlyRate;
        break;
      case 'experience':
        comparison = parseInt(a.experience) - parseInt(b.experience);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleBook = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  const handleCloseBooking = () => {
    setSelectedProvider(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Services Professionnels</h1>
        <p className="text-gray-600">
          Trouvez des professionnels qualifiés pour tous vos besoins
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">Prestataires</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="bookings">Mes Réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un prestataire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="experience">Expérience</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Liste des prestataires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                onBook={handleBook}
              />
            ))}
          </div>

          {sortedProviders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun prestataire trouvé</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setActiveTab('providers');
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${category.color} text-white flex items-center justify-center mx-auto mb-3`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes Réservations</CardTitle>
              <CardDescription>
                Gérez vos réservations de services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune réservation pour le moment</p>
                <Button className="mt-4" onClick={() => setActiveTab('providers')}>
                  Réserver un service
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de réservation */}
      {selectedProvider && (
        <BookingForm
          provider={selectedProvider}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
} 