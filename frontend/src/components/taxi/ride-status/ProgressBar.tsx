
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  status: string;
}

export const ProgressBar = ({ status }: ProgressBarProps) => {
  const getProgress = () => {
    switch (status) {
      case 'pending': return 25;
      case 'accepted': return 50;
      case 'in_progress': return 75;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getProgressColor = () => {
    if (status === 'cancelled') return 'bg-red-500';
    if (status === 'completed') return 'bg-green-500';
    return 'bg-primary';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progression</span>
        <span>{getProgress()}%</span>
      </div>
      <Progress 
        value={getProgress()} 
        className="h-2" 
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Demande</span>
        <span>Acceptée</span>
        <span>En cours</span>
        <span>Terminée</span>
      </div>
    </div>
  );
};
