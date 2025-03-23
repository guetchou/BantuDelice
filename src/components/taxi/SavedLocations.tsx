
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Building2, Star, Plus, Trash2, Edit } from "lucide-react";
import { useTaxiLocations, SavedLocation } from '@/hooks/useTaxiLocations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface LocationFormValues {
  name: string;
  address: string;
  type: 'home' | 'work' | 'other';
}

export default function SavedLocations({ onSelectLocation }: { onSelectLocation: (address: string) => void }) {
  const { savedLocations, recentLocations, saveLocation, deleteLocation, isLoading } = useTaxiLocations();
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationFormValues>({
    defaultValues: {
      name: '',
      address: '',
      type: 'other'
    }
  });
  
  const onSubmit = async (data: LocationFormValues) => {
    try {
      await saveLocation({
        name: data.name,
        address: data.address,
        latitude: 0, // Normalement, nous utiliserions un service de géocodage ici
        longitude: 0, // pour convertir l'adresse en coordonnées
        is_favorite: true,
        type: data.type
      });
      
      setIsAddFormOpen(false);
      reset();
    } catch (error) {
      toast.error("Impossible d'ajouter l'emplacement");
    }
  };
  
  const handleDeleteLocation = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet emplacement ?")) {
      await deleteLocation(id);
    }
  };
  
  // Détermine l'icône à afficher en fonction du type de lieu
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building2 className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  // Traduit le type en français
  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Domicile';
      case 'work':
        return 'Travail';
      default:
        return 'Autre';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Emplacements enregistrés</CardTitle>
          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un emplacement</DialogTitle>
                <DialogDescription>
                  Enregistrez un nouvel emplacement pour un accès rapide.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Le nom est requis' })}
                    placeholder="Ex: Maison, Bureau, Gym"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    {...register('address', { required: 'L\'adresse est requise' })}
                    placeholder="Adresse complète"
                  />
                  {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Type d'emplacement</Label>
                  <RadioGroup defaultValue="other">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="home" 
                          id="home"
                          {...register('type')}
                        />
                        <Label htmlFor="home" className="flex items-center">
                          <Home className="mr-1 h-3.5 w-3.5" />
                          Domicile
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="work" 
                          id="work"
                          {...register('type')}
                        />
                        <Label htmlFor="work" className="flex items-center">
                          <Building2 className="mr-1 h-3.5 w-3.5" />
                          Travail
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="other" 
                          id="other"
                          {...register('type')}
                        />
                        <Label htmlFor="other" className="flex items-center">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          Autre
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddFormOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Accédez rapidement à vos destinations favorites
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedLocations.length > 0 ? (
              <div className="space-y-2">
                {savedLocations.map(location => (
                  <div 
                    key={location.id}
                    className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-all"
                    onClick={() => onSelectLocation(location.address)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${location.type === 'home' ? 'bg-blue-100' : location.type === 'work' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                          {getLocationIcon(location.type)}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{location.name}</h3>
                            {location.is_favorite && (
                              <Star className="h-3.5 w-3.5 text-yellow-500 ml-1 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{getLocationTypeLabel(location.type)}</p>
                          <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLocation(location.id);
                        }}>
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MapPin className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>Aucun emplacement enregistré</p>
                <p className="text-sm">Ajoutez vos destinations fréquentes pour un accès rapide</p>
              </div>
            )}
            
            {recentLocations.length > 0 && (
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Destinations récentes</h3>
                <div className="space-y-2">
                  {recentLocations.map(location => (
                    <div 
                      key={location.id}
                      className="border rounded-lg p-2 hover:border-primary cursor-pointer transition-all"
                      onClick={() => onSelectLocation(location.address)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <div>
                          <p className="text-sm">{location.address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
