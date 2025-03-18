
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderStatus as Status } from "@/types/order";

interface OrderProgressProps {
  status: Status | string;
  estimatedTime?: number;
}

interface StepProps {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

const Step = ({ title, description, status }: StepProps) => {
  return (
    <div className="flex items-start mb-6 last:mb-0">
      <div className="flex flex-col items-center mr-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
          status === 'current' ? 'bg-blue-500 border-blue-500 text-white' :
          'bg-transparent border-gray-600 text-gray-500'
        }`}>
          {status === 'completed' ? '✓' : ''}
        </div>
        {/* Vertical line connecting steps */}
        <div className={`w-0.5 h-12 ${
          status === 'completed' ? 'bg-green-500' :
          status === 'current' ? 'bg-gradient-to-b from-blue-500 to-gray-600' :
          'bg-gray-600'
        }`}></div>
      </div>
      <div className="pt-1">
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
        {status === 'current' && (
          <Badge variant="outline" className="mt-2 bg-blue-500/10 text-blue-400 border-blue-400">
            En cours
          </Badge>
        )}
      </div>
    </div>
  );
};

const OrderProgress = ({ status, estimatedTime = 0 }: OrderProgressProps) => {
  // Define all possible steps
  const allSteps = [
    {
      key: 'pending',
      title: 'Commande reçue',
      description: 'Votre commande a été reçue par le restaurant'
    },
    {
      key: 'accepted',
      title: 'Commande acceptée',
      description: 'Le restaurant a accepté votre commande'
    },
    {
      key: 'preparing',
      title: 'En préparation',
      description: 'Vos plats sont en cours de préparation'
    },
    {
      key: 'prepared',
      title: 'Prête pour livraison',
      description: 'Votre commande est prête et attend un livreur'
    },
    {
      key: 'delivering',
      title: 'En livraison',
      description: 'Votre commande est en route'
    },
    {
      key: 'delivered',
      title: 'Livrée',
      description: 'Votre commande a été livrée avec succès'
    }
  ];

  // Status mapping to determine current step
  const statusIndex = {
    'pending': 0,
    'accepted': 1,
    'preparing': 2,
    'prepared': 3,
    'delivering': 4,
    'delivered': 5,
    'cancelled': -1
  }[status] || 0;

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Suivi de commande</h2>
        {estimatedTime > 0 && (
          <p className="text-sm text-gray-300 mt-1">
            Temps estimé: {estimatedTime} minutes
          </p>
        )}
        {status === 'cancelled' && (
          <Badge variant="destructive" className="mt-2">
            Commande annulée
          </Badge>
        )}
      </div>

      {status !== 'cancelled' && (
        <div className="pt-2">
          {allSteps.map((step, index) => (
            <Step
              key={step.key}
              title={step.title}
              description={step.description}
              status={
                index < statusIndex ? 'completed' :
                index === statusIndex ? 'current' : 'upcoming'
              }
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default OrderProgress;
