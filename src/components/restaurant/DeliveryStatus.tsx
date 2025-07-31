
import DeliveryMap from "@/components/DeliveryMap";

interface DeliveryStatusProps {
  show: boolean;
  status: string;
  restaurant: {
    latitude: number;
    longitude: number;
  };
}

const DeliveryStatus = ({ show, status, restaurant }: DeliveryStatusProps) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Suivi de la livraison</h3>
      <div className="mb-4">
        <span className="text-sm font-medium">
          Statut: {status === 'preparing' ? 'En préparation' : 'En livraison'}
        </span>
      </div>
      <DeliveryMap 
        latitude={restaurant.latitude}
        longitude={restaurant.longitude}
      />
    </div>
  );
};

export default DeliveryStatus;
