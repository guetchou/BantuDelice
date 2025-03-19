
import React from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Repeat, Star, MapPin, Clock, Calendar, Users, CreditCard, CheckCircle2 } from "lucide-react";
import { RidesharingTrip, RecurringTripMatch } from '@/types/ridesharing';

interface RecurringTripMatchesProps {
  matches: RecurringTripMatch[];
  onSelectMatch: (tripId: string) => void;
  onRefreshMatches: () => void;
  isLoading: boolean;
}

const RecurringTripMatches: React.FC<RecurringTripMatchesProps> = ({
  matches,
  onSelectMatch,
  onRefreshMatches,
  isLoading
}) => {
  const getMatchScore = (match: RecurringTripMatch) => {
    // Convert score to percentage
    return Math.round(match.similarity_score * 100);
  };
  
  const getMatchText = (score: number) => {
    if (score >= 90) return "Correspondance parfaite";
    if (score >= 75) return "Excellente correspondance";
    if (score >= 60) return "Bonne correspondance";
    return "Correspondance possible";
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 75) return "bg-emerald-100 text-emerald-800";
    if (score >= 60) return "bg-blue-100 text-blue-800";
    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Trajets recommandés</h2>
        <Button onClick={onRefreshMatches} disabled={isLoading} variant="outline">
          {isLoading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>
      
      {matches.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Repeat className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Aucune correspondance trouvée</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nous n'avons pas trouvé de trajets réguliers correspondant à vos critères. 
              Essayez de modifier votre recherche ou créez votre propre trajet régulier.
            </p>
            <Button className="mt-6" onClick={onRefreshMatches}>
              Rechercher à nouveau
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const matchScore = getMatchScore(match);
            
            return (
              <Card key={match.trip_id} className="overflow-hidden border hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${match.driver_id}`} />
                        <AvatarFallback>{match.driver_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{match.driver_name}</h3>
                          <Badge className={`ml-3 ${getScoreColor(matchScore)}`}>
                            {getMatchText(matchScore)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center mt-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{match.driver_rating.toFixed(1)}</span>
                          
                          {match.previous_trips_together > 0 && (
                            <Badge className="ml-3 bg-violet-100 text-violet-800">
                              {match.previous_trips_together} trajets ensemble
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{matchScore}% compatibilité</div>
                      <div className="flex mt-2 space-x-1">
                        {match.matched_route && (
                          <Badge variant="outline" className="bg-gray-50">Itinéraire ✓</Badge>
                        )}
                        {match.matched_schedule && (
                          <Badge variant="outline" className="bg-gray-50">Horaire ✓</Badge>
                        )}
                        {match.matched_preferences && (
                          <Badge variant="outline" className="bg-gray-50">Préférences ✓</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                      <div className="mr-6">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Repeat className="h-4 w-4 mr-1" />
                          <span>Trajet régulier</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm">Lun, Mar, Mer, Jeu, Ven</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-primary mr-1" />
                          <span className="text-sm">Départ à 08:00</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onSelectMatch(match.trip_id)}
                      className="mt-4 md:mt-0"
                    >
                      Voir les détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecurringTripMatches;
