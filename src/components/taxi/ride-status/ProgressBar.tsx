
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { TaxiRideStatus } from '@/types/taxi';
import { getRideState } from '@/utils/rideStateMachine';

interface ProgressBarProps {
  status: TaxiRideStatus;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  const rideState = getRideState(status);
  
  return (
    <div className="space-y-2">
      <Progress value={rideState.progressPercentage} className={
        status === 'cancelled' || status === 'rejected'
          ? 'bg-red-500'
          : status === 'completed'
            ? 'bg-green-500'
            : 'bg-primary'
      } />
      <p className="text-center text-sm font-medium">{rideState.description}</p>
    </div>
  );
};
