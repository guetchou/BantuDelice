
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { toast } from 'sonner';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('all');

  const statsCards = [
    { title: 'Clients', value: '3,456', icon: Users, change: '+12%', color: 'text-blue.DEFAULT', up: true },
    { title: 'Revenus', value: '24,530 €', icon: CreditCard, change: '+8%', color: 'text-green.DEFAULT', up: true },
    { title: 'Commandes', value: '1,245', icon: ShoppingCart, change: '-3%', color: 'text-orange.DEFAULT', up: false },
    { title: 'Taux de conversion', value: '3.2%', icon: TrendingUp, change: '+2%', color: 'text-blue.DEFAULT', up: true },
  ];

  const recentOrders = [
    { id: '#4532', client: 'Martin Dupont', status: 'Complété', date: '15 Oct 2023', amount: '123.45 €' },
    { id: '#4533', client: 'Sophie Martin', status: 'En attente', date: '15 Oct 2023', amount: '345.00 €' },
    { id: '#4534', client: 'Thomas Bernard', status: 'Traitement', date: '14 Oct 2023', amount: '212.00 €' },
    { id: '#4535', client: 'Claire Leroy', status: 'Complété', date: '14 Oct 2023', amount: '159.90 €' },
    { id: '#4536', client: 'Lucas Moreau', status: 'Annulé', date: '13 Oct 2023', amount: '99.99 €' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Réunion marketing', due: '14:00', priority: 'Haute' },
    { id: 2, title: 'Appel client Durand', due: '15:30', priority: 'Moyenne' },
    { id: 3, title: 'Révision des factures', due: '16:45', priority: 'Basse' },
    { id: 4, title: 'Rapport hebdomadaire', due: 'Demain', priority: 'Haute' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complété': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'En attente': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Traitement': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Annulé': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Haute': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Moyenne': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'Basse': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex space-x-2">
            <button 
              className="fancy-button"
              onClick={() => toast.success('Action rapide déclenchée')}
            >
              Action rapide
            </button>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <div 
              key={index} 
              className="dashboard-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`${card.up ? 'text-green-500' : 'text-red-500'} text-sm flex items-center`}>
                      {card.up ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {card.change}
                    </span>
                    <span className="text-muted-foreground text-xs ml-1">ce mois</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.up ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activité récente et tâches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commandes récentes */}
          <div className="lg:col-span-2">
            <div className="dashboard-card h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Commandes récentes</h2>
                <div className="flex space-x-1 bg-secondary rounded-lg p-1">
                  {['all', 'pending', 'completed', 'cancelled'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        selectedTab === tab 
                          ? 'bg-card shadow-sm' 
                          : 'hover:bg-card/60'
                      }`}
                      onClick={() => setSelectedTab(tab)}
                    >
                      {tab === 'all' ? 'Toutes' : 
                       tab === 'pending' ? 'En attente' : 
                       tab === 'completed' ? 'Complétées' : 'Annulées'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="interactive-table">
                  <thead>
                    <tr>
                      <th>Commande</th>
                      <th>Client</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Montant</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-medium">{order.id}</td>
                        <td>{order.client}</td>
                        <td>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="text-muted-foreground">{order.date}</td>
                        <td className="font-medium">{order.amount}</td>
                        <td>
                          <button className="text-primary hover:text-primary/80 p-1 rounded">
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center">
                  Voir toutes les commandes
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tâches à venir */}
          <div className="lg:col-span-1">
            <div className="dashboard-card h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Tâches à venir</h2>
                <button className="text-primary hover:text-primary/80">
                  <Calendar className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => toast.info(`Tâche "${task.title}" sélectionnée`)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" /> {task.due}
                        </p>
                      </div>
                      {getPriorityIcon(task.priority)}
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="w-full mt-4 py-2 border border-dashed border-border rounded-lg text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                onClick={() => toast.success('Nouvelle tâche ajoutée')}
              >
                + Ajouter une tâche
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
