
import { CheckCircle2, Clock, CookingPot, PackageCheck, Send, Truck } from 'lucide-react';
import { OrderStatus } from '@/types/order';

interface OrderProgressProps {
  status: OrderStatus | string;
}

const OrderProgress = ({ status }: OrderProgressProps) => {
  // Conversion de string en OrderStatus si nécessaire
  const orderStatus = status as OrderStatus;
  
  const steps = [
    { key: 'pending', label: 'Commande reçue', icon: Clock, description: 'Votre commande a été reçue' },
    { key: 'accepted', label: 'Acceptée', icon: CheckCircle2, description: 'Le restaurant a confirmé votre commande' },
    { key: 'preparing', label: 'En préparation', icon: CookingPot, description: 'Vos plats sont en cours de préparation' },
    { key: 'prepared', label: 'Prête', icon: PackageCheck, description: 'Votre commande est prête' },
    { key: 'delivering', label: 'En livraison', icon: Truck, description: 'Votre commande est en route' },
    { key: 'delivered', label: 'Livrée', icon: Send, description: 'Votre commande a été livrée' },
  ];

  const getCurrentStepIndex = () => {
    const statusIndex = steps.findIndex(step => step.key === orderStatus);
    if (statusIndex === -1) {
      // Si le status n'est pas trouvé, déterminer l'étape la plus proche
      if (orderStatus === 'cancelled') return -1;
      return 0; // Par défaut, première étape
    }
    return statusIndex;
  };

  const currentStepIndex = getCurrentStepIndex();
  
  if (orderStatus === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-center text-red-600">Cette commande a été annulée</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2" />
        
        {/* Étapes */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step.key} className={`relative flex items-start ${isActive ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-40'}`}>
                <div className={`
                  absolute left-6 -ml-3 mt-1 h-6 w-6 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-primary text-white' : 'bg-gray-200'}
                  ${isActive ? 'ring-4 ring-primary/20' : ''}
                `}>
                  <step.icon className="h-3 w-3" />
                </div>
                
                <div className="ml-10">
                  <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderProgress;
