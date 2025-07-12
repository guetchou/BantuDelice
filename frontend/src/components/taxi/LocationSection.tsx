
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, MapPinned, CornerDownLeft, Phone, MessageCircle, Loader2 } from "lucide-react";
import { ComboboxPopover } from "@/components/ui/combobox";
import { toast } from "@/hooks/use-toast";
import TaxiMap from './TaxiMap';

interface LocationSectionProps {
  pickupAddress: string;
  setPickupAddress: (address: string) => void;
  destinationAddress: string;
  setDestinationAddress: (address: string) => void;
  onLocationSelect: (address: string, isPickup: boolean, coordinates?: [number, number]) => void;
  onUseCurrentLocation: () => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  pickupAddress,
  setPickupAddress,
  destinationAddress,
  setDestinationAddress,
  onLocationSelect,
  onUseCurrentLocation
}) => {
  const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isSelectingOnMap, setIsSelectingOnMap] = useState<'pickup' | 'destination' | null>(null);
  const [pickupCoordinates, setPickupCoordinates] = useState<[number, number] | undefined>();
  const [destinationCoordinates, setDestinationCoordinates] = useState<[number, number] | undefined>();
  const [showMap, setShowMap] = useState(false);
  
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destInputRef = useRef<HTMLInputElement>(null);
  
  // Load recent addresses
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        // Simulate loading addresses from backend
        await new Promise(resolve => setTimeout(resolve, 800));
        setRecentAddresses([
          "Centre-ville, Brazzaville",
          "Aéroport Maya-Maya, Brazzaville",
          "Marché Total, Brazzaville",
          "Stade Alphonse Massemba-Débat, Brazzaville",
          "Université Marien Ngouabi, Brazzaville"
        ]);
      } catch (error) {
        console.error("Error loading addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    
    loadAddresses();
  }, []);
  
  // Request permission for geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          // Automatically use current location if permission is already granted
          if (!pickupAddress) {
            onUseCurrentLocation();
          }
        } else if (permissionStatus.state === 'prompt') {
          // We'll show the button for the user to click
          console.log("Geolocation permission will be requested when needed");
        } else {
          toast({
            title: "Accès à la géolocalisation bloqué",
            description: "Veuillez activer l'accès à votre position dans les paramètres de votre navigateur."
          });
        }
      });
    }
  }, []);
  
  // Handle input focus for suggestions
  const handleInputFocus = (isPickup: boolean) => {
    if (isPickup) {
      setShowPickupSuggestions(true);
      setShowDestSuggestions(false);
    } else {
      setShowDestSuggestions(true);
      setShowPickupSuggestions(false);
    }
    
    // Show recent addresses as suggestions
    setSuggestions(recentAddresses);
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding the suggestions to allow for clicking on them
    setTimeout(() => {
      setShowPickupSuggestions(false);
      setShowDestSuggestions(false);
    }, 200);
  };
  
  // Search for suggestions based on input
  const handleInputChange = (value: string, isPickup: boolean) => {
    if (isPickup) {
      setPickupAddress(value);
    } else {
      setDestinationAddress(value);
    }
    
    // Filter suggestions based on input
    if (value.length > 2) {
      const filtered = recentAddresses.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(recentAddresses);
    }
  };
  
  // Handle selection of a suggestion
  const handleSuggestionSelect = (suggestion: string, isPickup: boolean) => {
    if (isPickup) {
      setPickupAddress(suggestion);
      onLocationSelect(suggestion, true);
      setShowPickupSuggestions(false);
    } else {
      setDestinationAddress(suggestion);
      onLocationSelect(suggestion, false);
      setShowDestSuggestions(false);
    }
  };
  
  // Handle map location selection
  const handleMapLocationSelect = (coordinates: [number, number], address: string) => {
    if (isSelectingOnMap === 'pickup') {
      setPickupAddress(address);
      setPickupCoordinates(coordinates);
      onLocationSelect(address, true, coordinates);
      setIsSelectingOnMap(null);
    } else if (isSelectingOnMap === 'destination') {
      setDestinationAddress(address);
      setDestinationCoordinates(coordinates);
      onLocationSelect(address, false, coordinates);
      setIsSelectingOnMap(null);
    }
  };
  
  // Handle sending chat message for location precision
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Un agent vous contactera pour préciser votre adresse."
    });
    
    // Reset chat
    setChatMessage('');
    setChatOpen(false);
  };
  
  // Call for assistance
  const handleCallForAssistance = () => {
    toast({
      title: "Appel en cours...",
      description: "Un agent va vous contacter pour préciser votre adresse."
    });
  };

  // Toggle map view
  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  // Select location on map
  const selectLocationOnMap = (type: 'pickup' | 'destination') => {
    setIsSelectingOnMap(type);
    setShowMap(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 inset-y-0 flex flex-col items-center justify-between py-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="w-0.5 h-full bg-gray-200 -mt-1.5 -mb-1.5"></div>
          <div className="w-3 h-3 rounded-full bg-primary"></div>
        </div>
        
        <div className="space-y-6 pl-10">
          <div className="space-y-2">
            <Label htmlFor="pickup">Point de départ</Label>
            <div className="relative">
              <Input
                id="pickup"
                placeholder="D'où partez-vous?"
                value={pickupAddress}
                onChange={(e) => handleInputChange(e.target.value, true)}
                onFocus={() => handleInputFocus(true)}
                onBlur={handleInputBlur}
                ref={pickupInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pickupAddress) {
                    onLocationSelect(pickupAddress, true);
                  }
                }}
                className="pr-20"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={() => onUseCurrentLocation()}
                  title="Utiliser ma position actuelle"
                >
                  <MapPinned className="h-4 w-4 text-primary" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={() => selectLocationOnMap('pickup')}
                  title="Sélectionner sur la carte"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Pickup Suggestions */}
              {showPickupSuggestions && suggestions.length > 0 && (
                <ComboboxPopover
                  className="w-full max-h-[200px] overflow-auto"
                  items={suggestions.map(address => ({
                    label: address,
                    value: address
                  }))}
                  onSelect={(item) => handleSuggestionSelect(item.value, true)}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <Input
                id="destination"
                placeholder="Où allez-vous?"
                value={destinationAddress}
                onChange={(e) => handleInputChange(e.target.value, false)}
                onFocus={() => handleInputFocus(false)}
                onBlur={handleInputBlur}
                ref={destInputRef}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && destinationAddress) {
                    onLocationSelect(destinationAddress, false);
                  }
                }}
                className="pr-20"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8"
                  onClick={() => selectLocationOnMap('destination')}
                  title="Sélectionner sur la carte"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-primary"
                  onClick={toggleMapView}
                  title="Voir sur la carte"
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Destination Suggestions */}
              {showDestSuggestions && suggestions.length > 0 && (
                <ComboboxPopover
                  className="w-full max-h-[200px] overflow-auto"
                  items={suggestions.map(address => ({
                    label: address,
                    value: address
                  }))}
                  onSelect={(item) => handleSuggestionSelect(item.value, false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map View */}
      {showMap && (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200">
          <TaxiMap
            pickupCoordinates={pickupCoordinates}
            destinationCoordinates={destinationCoordinates}
            onPickupSelect={handleMapLocationSelect}
            onDestinationSelect={handleMapLocationSelect}
            isSelectingPickup={isSelectingOnMap === 'pickup'}
            isSelectingDestination={isSelectingOnMap === 'destination'}
          />
        </div>
      )}
      
      {/* Assistance Options */}
      <div className="flex items-center justify-center space-x-4 py-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2" 
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageCircle className="h-4 w-4" />
          Préciser par chat
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
          onClick={handleCallForAssistance}
        >
          <Phone className="h-4 w-4" />
          Appeler pour préciser
        </Button>
      </div>
      
      {/* Chat Interface */}
      {chatOpen && (
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="mb-3 bg-gray-100 p-3 rounded-lg text-sm">
              <p className="font-medium">Agent</p>
              <p>Comment puis-je vous aider à préciser votre adresse ?</p>
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Écrivez votre message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendChatMessage();
                  }
                }}
              />
              <Button onClick={handleSendChatMessage}>Envoyer</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Recent Addresses Section */}
      {!chatOpen && !showMap && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium mb-2">Adresses récentes</p>
            {isLoadingAddresses ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {recentAddresses.slice(0, 3).map((address, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-2 h-auto py-2"
                    onClick={() => {
                      if (!pickupAddress) {
                        setPickupAddress(address);
                        onLocationSelect(address, true);
                      } else if (!destinationAddress) {
                        setDestinationAddress(address);
                        onLocationSelect(address, false);
                      }
                    }}
                  >
                    {index % 2 === 0 ? (
                      <MapPin className="h-4 w-4 text-primary" />
                    ) : (
                      <Navigation className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="truncate text-sm font-normal">{address}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationSection;
