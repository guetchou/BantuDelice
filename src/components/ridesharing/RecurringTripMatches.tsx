
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecurringTripMatch } from '@/types/ridesharing';
import { MapPin, Clock, Star, Users, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-4 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">Aucun trajet récurrent correspondant</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Nous n'avons pas trouvé de trajets récurrents qui correspondent à vos habitudes de déplacement.
          </p>
          <Button onClick={onRefreshMatches} variant="outline" className="mx-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualiser
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Trajets qui correspondent à vos habitudes</h3>
        <Button variant="ghost" size="sm" onClick={onRefreshMatches}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      {matches.map((match) => (
        <Card key={match.trip_id} className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => onSelectMatch(match.trip_id)}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    {/* Placeholder for driver avatar */}
                    <div className="bg-primary/20 w-full h-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">{match.driver_name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{match.driver_rating.toFixed(1)}</span>
                    <span className="mx-2">•</span>
                    <span>{match.previous_trips_together} trajets ensemble</span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">Route similaire à {match.similarity_score.toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">
                        {match.matched_schedule ? "Horaires compatibles" : "Horaires différents"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-2 md:mt-0" onClick={(e) => {
                e.stopPropagation();
                onSelectMatch(match.trip_id);
              }}>
                Voir les détails
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecurringTripMatches;
