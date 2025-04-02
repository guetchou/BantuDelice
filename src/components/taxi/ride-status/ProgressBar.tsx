
import React from 'react';
import { TaxiRideStatus } from '@/types/taxi';
import { getRideState } from '@/utils/rideStateMachine';

interface ProgressBarProps {
  status: TaxiRideStatus;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ status }) => {
  // Map TaxiRideStatus to RideStatus from rideStateMachine
  const mappedStatus = mapStatusToRideStateMachine(status);
  
  // Get progress percentage from the ride state machine
  const progressInfo = getRideState(mappedStatus);
  const progress = progressInfo.progressPercentage;

  const getColorClass = () => {
    if (status === 'cancelled' || status === 'rejected') {
      return 'bg-red-500';
    }
    if (status === 'completed') {
      return 'bg-green-500';
    }
    return 'bg-primary';
  };

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${getColorClass()}`} 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Helper function to map TaxiRideStatus to RideStatus
function mapStatusToRideStateMachine(status: TaxiRideStatus): 'pending' | 'driver_assigned' | 'driver_en_route' | 'driver_arrived' | 'ride_in_progress' | 'arrived_at_destination' | 'completed' | 'cancelled' | 'rejected' {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'accepted':
    case 'driver_assigned':
      return 'driver_assigned';
    case 'driver_en_route':
      return 'driver_en_route';
    case 'driver_arrived':
      return 'driver_arrived';
    case 'in_progress':
    case 'ride_in_progress':
      return 'ride_in_progress';
    case 'arrived_at_destination':
      return 'arrived_at_destination';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'rejected':
      return 'rejected';
    default:
      return 'pending';
  }
}
