
import React from 'react';
import { Button } from "@/components/ui/button";
import { History, Clock, MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onOptimizationClick: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onOptimizationClick }) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Button
        variant="outline"
        className="h-auto py-6"
        onClick={() => navigate("/delivery/history")}
      >
        <History className="w-6 h-6 mr-2" />
        Historique des livraisons
      </Button>
      <Button
        variant="outline"
        className="h-auto py-6"
        onClick={() => navigate("/delivery/schedule")}
      >
        <Clock className="w-6 h-6 mr-2" />
        Planning des livraisons
      </Button>
      <Button
        variant="outline"
        className="h-auto py-6"
        onClick={onOptimizationClick}
      >
        <MapIcon className="w-6 h-6 mr-2" />
        Optimisation des itinéraires
      </Button>
    </div>
  );
};

export default QuickActions;
