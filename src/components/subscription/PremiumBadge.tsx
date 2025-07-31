
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, Star } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';

interface PremiumBadgeProps {
  tier: SubscriptionTier;
  showTooltip?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PremiumBadge = ({
  tier,
  showTooltip = true,
  className = '',
  size = 'md'
}: PremiumBadgeProps) => {
  if (tier === 'standard') return null;
  
  const getBadgeContent = () => {
    const sizeClasses = {
      sm: 'text-xs py-0 px-2',
      md: 'text-sm py-0.5 px-2.5',
      lg: 'text-base py-1 px-3'
    };
    
    const iconSize = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5'
    };
    
    if (tier === 'premium') {
      return (
        <Badge 
          variant="outline"
          className={`bg-primary/10 text-primary border-primary/20 font-medium flex items-center gap-1 ${sizeClasses[size]} ${className}`}
        >
          <Star className={`${iconSize[size]} fill-primary`} />
          Premium
        </Badge>
      );
    }
    
    return (
      <Badge 
        variant="outline"
        className={`bg-amber-100 text-amber-800 border-amber-200 font-medium flex items-center gap-1 ${sizeClasses[size]} ${className}`}
      >
        <Crown className={`${iconSize[size]} fill-amber-500`} />
        Elite
      </Badge>
    );
  };
  
  const tooltipText = {
    premium: 'Restaurant partenaire Premium avec des avantages exclusifs',
    elite: 'Restaurant partenaire Elite avec une visibilité maximale et un service prioritaire'
  };
  
  if (!showTooltip) {
    return getBadgeContent();
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {getBadgeContent()}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tier === 'premium' ? tooltipText.premium : tooltipText.elite}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;
