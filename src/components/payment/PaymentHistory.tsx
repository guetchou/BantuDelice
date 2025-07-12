import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useSupabase';
import { PaymentService, PaymentTransaction } from '@/services/paymentService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Wallet, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'mobile_money':
      return <Smartphone className="w-4 h-4" />;
    case 'card':
      return <CreditCard className="w-4 h-4" />;
    case 'cash':
      return <Banknote className="w-4 h-4" />;
    case 'wallet':
      return <Wallet className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'completed':
      return {
        label: 'Complété',
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />
      };
    case 'pending':
      return {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />
      };
    case 'processing':
      return {
        label: 'En cours',
        color: 'bg-blue-100 text-blue-800',
        icon: <Clock className="w-4 h-4" />
      };
    case 'failed':
      return {
        label: 'Échoué',
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-4 h-4" />
      };
    case 'refunded':
      return {
        label: 'Remboursé',
        color: 'bg-gray-100 text-gray-800',
        icon: <CheckCircle className="w-4 h-4" />
      };
    default:
      return {
        label: 'Inconnu',
        color: 'bg-gray-100 text-gray-800',
        icon: <AlertCircle className="w-4 h-4" />
      };
  }
};

export default function PaymentHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user?.id]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const userTransactions = await PaymentService.getUserTransactions(user!.id);
      setTransactions(userTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'XOF') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter !== 'all' && transaction.payment_method !== filter) {
      return false;
    }
    
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.created_at);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case 'today':
          return diffInDays === 0;
        case 'week':
          return diffInDays <= 7;
        case 'month':
          return diffInDays <= 30;
        default:
          return true;
      }
    }
    
    return true;
  });

  const generateReport = async () => {
    try {
      const report = await PaymentService.generatePaymentReport(user!.id);
      toast.success('Rapport généré avec succès');
      console.log('Payment Report:', report);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erreur lors de la génération du rapport');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Non connecté</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour voir vos paiements</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos paiements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Paiements</h1>
          <p className="text-gray-600">Consultez tous vos paiements et transactions</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total des paiements</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réussies</p>
                  <p className="text-2xl font-bold text-green-600">
                    {transactions.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {transactions.filter(t => t.status === 'pending').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Filtres:</span>
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="all">Toutes les méthodes</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Carte bancaire</option>
                <option value="cash">Espèces</option>
                <option value="wallet">Portefeuille</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>

              <Button
                onClick={generateReport}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Rapport
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des transactions */}
        {filteredTransactions.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune transaction</h2>
              <p className="text-gray-600 mb-6">Vous n'avez pas encore effectué de paiement</p>
              <Button onClick={() => window.location.href = '/order'}>
                Passer une commande
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const statusConfig = getStatusConfig(transaction.status);
              
              return (
                <Card key={transaction.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {getPaymentMethodIcon(transaction.payment_method)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Transaction #{transaction.id.slice(-8)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Commande: {transaction.order_id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </div>
                      </div>
                    </div>
                    
                    {transaction.provider_data && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Méthode:</span> {transaction.payment_method}
                          </div>
                          {transaction.provider_data.phone_number && (
                            <div>
                              <span className="font-medium">Téléphone:</span> {transaction.provider_data.phone_number}
                            </div>
                          )}
                          {transaction.provider_data.operator && (
                            <div>
                              <span className="font-medium">Opérateur:</span> {transaction.provider_data.operator}
                            </div>
                          )}
                          {transaction.provider_data.last_four && (
                            <div>
                              <span className="font-medium">Carte:</span> **** **** **** {transaction.provider_data.last_four}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 