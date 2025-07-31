
import { Award } from "lucide-react";

interface LoyaltyBadgeProps {
  tier: string;
  points: number;
  showPoints?: boolean;
  className?: string;
}

export const LoyaltyBadge = ({ tier, points, showPoints = true, className = "" }: LoyaltyBadgeProps) => {
  const getTierColor = () => {
    switch (tier) {
      case 'Diamond':
        return 'bg-purple-500 text-white';
      case 'Gold':
        return 'bg-yellow-500 text-black';
      case 'Silver':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-orange-500 text-white';
    }
  };

  return (
    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTierColor()} ${className}`}>
      <Award className="h-3 w-3" />
      <span>{tier}</span>
      {showPoints && (
        <span className="ml-1">({points} pts)</span>
      )}
    </div>
  );
};

export default LoyaltyBadge;
