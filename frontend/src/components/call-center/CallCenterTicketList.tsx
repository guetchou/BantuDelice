import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
// Import removed - using local types

interface CallCenterTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  description: string;
  assignedAgent?: {
    id: string;
    name: string;
  };
  channel: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CallCenterTicketList: React.FC = () => {
  const [tickets, setTickets] = useState<CallCenterTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      // Simulation des données - à remplacer par l'appel API réel
      const mockTickets: CallCenterTicket[] = [
        {
          id: '1',
          customerName: 'Jean Mutombo',
          customerPhone: '+242 06 123 4567',
          customerEmail: 'jean@example.com',
          type: TicketType.ORDER,
          status: TicketStatus.OPEN,
          priority: TicketPriority.HIGH,
          subject: 'Commande de repas',
          description: 'Je souhaite commander un repas pour livraison',
          assignedAgent: {
            id: '1',
            name: 'Marie Dubois'
          },
          channel: {
            id: '1',
            name: 'Téléphone Principal',
            type: 'phone'
          },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:35:00Z'
        },
        {
          id: '2',
          customerName: 'Sophie Nkounkou',
          customerPhone: '+242 05 987 6543',
          type: TicketType.SUPPORT,
          status: TicketStatus.IN_PROGRESS,
          priority: TicketPriority.MEDIUM,
          subject: 'Problème de paiement',
          description: 'Je n\'arrive pas à effectuer le paiement mobile',
          channel: {
            id: '2',
            name: 'WhatsApp Business',
            type: 'whatsapp'
          },
          createdAt: '2024-01-15T09:15:00Z',
          updatedAt: '2024-01-15T09:20:00Z'
        },
        {
          id: '3',
          customerName: 'Pierre Makaya',
          customerPhone: '+242 04 555 1234',
          type: TicketType.COMPLAINT,
          status: TicketStatus.RESOLVED,
          priority: TicketPriority.LOW,
          subject: 'Livraison tardive',
          description: 'Ma commande a été livrée avec 30 minutes de retard',
          assignedAgent: {
            id: '2',
            name: 'Paul Martin'
          },
          channel: {
            id: '3',
            name: 'SMS',
            type: 'sms'
          },
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-14T17:00:00Z'
        }
      ];

      setTickets(mockTickets);
    } catch (error) {
      console.error('Erreur lors du chargement des tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-500" />;
      case TicketStatus.RESOLVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case TicketStatus.CLOSED:
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <Badge variant="destructive">Ouvert</Badge>;
      case TicketStatus.IN_PROGRESS:
        return <Badge variant="default">En cours</Badge>;
      case TicketStatus.RESOLVED:
        return <Badge variant="secondary">Résolu</Badge>;
      case TicketStatus.CLOSED:
        return <Badge variant="outline">Fermé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return <Badge variant="outline" className="text-green-600">Faible</Badge>;
      case TicketPriority.MEDIUM:
        return <Badge variant="outline" className="text-yellow-600">Moyenne</Badge>;
      case TicketPriority.HIGH:
        return <Badge variant="outline" className="text-orange-600">Élevée</Badge>;
      case TicketPriority.URGENT:
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value={TicketStatus.OPEN}>Ouvert</SelectItem>
                <SelectItem value={TicketStatus.IN_PROGRESS}>En cours</SelectItem>
                <SelectItem value={TicketStatus.RESOLVED}>Résolu</SelectItem>
                <SelectItem value={TicketStatus.CLOSED}>Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les priorités</SelectItem>
                <SelectItem value={TicketPriority.LOW}>Faible</SelectItem>
                <SelectItem value={TicketPriority.MEDIUM}>Moyenne</SelectItem>
                <SelectItem value={TicketPriority.HIGH}>Élevée</SelectItem>
                <SelectItem value={TicketPriority.URGENT}>Urgente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value={TicketType.ORDER}>Commande</SelectItem>
                <SelectItem value={TicketType.SUPPORT}>Support</SelectItem>
                <SelectItem value={TicketType.COMPLAINT}>Plainte</SelectItem>
                <SelectItem value={TicketType.FEEDBACK}>Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(ticket.status)}
                    <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{ticket.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{ticket.customerPhone}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {getChannelIcon(ticket.channel.type)}
                      <span>{ticket.channel.name}</span>
                    </div>
                    <span>Créé le {formatDate(ticket.createdAt)}</span>
                    {ticket.assignedAgent && (
                      <span>Assigné à {ticket.assignedAgent.name}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    Voir détails
                  </Button>
                  {ticket.status === TicketStatus.OPEN && (
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Prendre en charge
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CallCenterTicketList;
