
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent, Calendar, StarIcon } from "lucide-react";
import { MenuPromotion } from "@/types/menu";
import { useNavigate } from "react-router-dom";

interface PromotionCardProps {
  promotion: MenuPromotion;
  restaurantId: string;
  restaurantName: string;
}

export const PromotionCard = ({ promotion, restaurantId, restaurantName }: PromotionCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };
  
  const formatTimeRange = (start: string, end: string) => {
    return `${start} - ${end}`;
  };
  
  const formatDays = (days: string[]) => {
    const dayMap: Record<string, string> = {
      'monday': 'Lun',
      'tuesday': 'Mar',
      'wednesday': 'Mer',
      'thursday': 'Jeu',
      'friday': 'Ven',
      'saturday': 'Sam',
      'sunday': 'Dim'
    };
    
    return days.map(day => dayMap[day] || day).join(', ');
  };
  
  const getDiscountText = () => {
    if (promotion.discount_type === 'percentage') {
      return `${promotion.discount_value}% de réduction`;
    } else if (promotion.discount_type === 'fixed_amount') {
      return `${promotion.discount_value} XAF de réduction`;
    } else {
      return `Item gratuit`;
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 text-white">
        <Badge variant="outline" className="bg-white/20 text-white border-white/40">
          Promotion
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{promotion.title}</span>
          <Badge className="bg-orange-500">
            {getDiscountText()}
          </Badge>
        </CardTitle>
        <CardDescription>{restaurantName}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm">{promotion.description}</p>
        
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Valable du {formatDate(promotion.valid_from)} au {formatDate(promotion.valid_to)}</span>
        </div>
        
        {promotion.promotion_hours && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {formatTimeRange(promotion.promotion_hours.start, promotion.promotion_hours.end)}
              {' '}
              ({formatDays(promotion.promotion_hours.days)})
            </span>
          </div>
        )}
        
        {promotion.conditions && promotion.conditions.length > 0 && (
          <div className="text-sm text-gray-500">
            <p className="font-medium mb-1">Conditions:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {promotion.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
        )}
        
        {promotion.min_order_value && (
          <div className="text-sm text-gray-500 flex items-center">
            <Percent className="h-4 w-4 mr-1" />
            <span>Commande minimum: {promotion.min_order_value.toLocaleString('fr-FR')} XAF</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate(`/restaurants/${restaurantId}`)}
        >
          En profiter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromotionCard;
