import React from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  department: string;
  rating: number;
  callsHandled: number;
  avatar?: string;
}

interface CallCenterAgentListProps {
  agents?: Agent[];
  onAgentSelect?: (agent: Agent) => void;
}

export const CallCenterAgentList: React.FC<CallCenterAgentListProps> = ({
  agents = [],
  onAgentSelect
}) => {
  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online':
        return 'En ligne';
      case 'busy':
        return 'Occupé';
      case 'offline':
        return 'Hors ligne';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Agents du Centre d'Appel
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {agents.length} agent(s) disponible(s)
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {agents.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucun agent disponible
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onAgentSelect?.(agent)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {agent.avatar ? (
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {agent.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {getStatusText(agent.status)}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(agent.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({agent.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{agent.callsHandled} appels traités</span>
                    {agent.status === 'online' && (
                      <span className="text-green-600 font-medium">
                        Disponible
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CallCenterAgentList; 