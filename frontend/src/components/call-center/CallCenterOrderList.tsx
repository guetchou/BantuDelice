import React from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  amount: number;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

interface CallCenterOrderListProps {
  orders?: Order[];
  onOrderSelect?: (order: Order) => void;
}

export const CallCenterOrderList: React.FC<CallCenterOrderListProps> = ({
  orders = [],
  onOrderSelect
}) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: Order['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return 'Inconnue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Commandes Récentes
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} commande(s) récente(s)
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {orders.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucune commande récente
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onOrderSelect?.(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getPriorityColor(order.priority)}`}
                      title={getPriorityText(order.priority)}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.category} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatAmount(order.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Priorité: {getPriorityText(order.priority)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallCenterOrderList; 