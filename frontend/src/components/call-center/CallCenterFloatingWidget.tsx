import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageSquare, 
  X, 
  Headphones,
  Clock,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CallCenterFloatingWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [activeAgents, setActiveAgents] = useState(8);
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = 'tel:+242061234567';
  };

  const handleWhatsApp = () => {
    window.location.href = 'https://wa.me/242061234567?text=Bonjour, j\'ai besoin d\'aide';
  };

  const handleNavigateToCallCenter = () => {
    navigate('/call-center');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Widget principal */}
      <div className="relative">
        {/* Widget étendu */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Support Multicanal</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Statut du service */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isOnline ? 'Service disponible' : 'Service temporairement indisponible'}
              </span>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-blue-500" />
                <span>{activeAgents} agents actifs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <span>4.2 min de réponse</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button 
                onClick={handleCall}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Phone className="mr-2 h-4 w-4" />
                Appeler maintenant
              </Button>
              
              <Button 
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              
              <Button 
                onClick={handleNavigateToCallCenter}
                variant="outline"
                className="w-full"
              >
                <Headphones className="mr-2 h-4 w-4" />
                Voir tous les canaux
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>📞 +242 06 123 4567</div>
                <div>🕒 Lun-Ven: 8h-20h</div>
                <div>🚨 Urgences: 24h/24</div>
              </div>
            </div>
          </div>
        )}

        {/* Bouton principal */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <Headphones className="h-6 w-6" />
          )}
        </Button>

        {/* Badge de notification */}
        {!isExpanded && (
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
            {activeAgents}
          </Badge>
        )}
      </div>

      {/* Indicateur de statut */}
      {!isExpanded && (
        <div className="absolute -bottom-2 -right-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        </div>
      )}
    </div>
  );
};

export default CallCenterFloatingWidget; 