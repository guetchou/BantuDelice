import React from 'react';

interface Channel {
  id: string;
  name: string;
  type: 'phone' | 'chat' | 'email' | 'social';
  status: 'active' | 'inactive' | 'maintenance';
  queueLength: number;
  avgResponseTime: number;
  agentCount: number;
}

interface CallCenterChannelListProps {
  channels?: Channel[];
  onChannelSelect?: (channel: Channel) => void;
}

export const CallCenterChannelList: React.FC<CallCenterChannelListProps> = ({
  channels = [],
  onChannelSelect
}) => {
  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'phone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'chat':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'social':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: Channel['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Channel['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'maintenance':
        return 'Maintenance';
      default:
        return 'Inconnu';
    }
  };

  const getTypeText = (type: Channel['type']) => {
    switch (type) {
      case 'phone':
        return 'Téléphone';
      case 'chat':
        return 'Chat';
      case 'email':
        return 'Email';
      case 'social':
        return 'Réseaux sociaux';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          Canaux de Communication
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {channels.length} canal(aux) configuré(s)
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {channels.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucun canal configuré
          </div>
        ) : (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onChannelSelect?.(channel)}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {getChannelIcon(channel.type)}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(channel.status)}`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {channel.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getTypeText(channel.type)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {getStatusText(channel.status)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {channel.agentCount} agent(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-500">File d'attente</p>
                      <p className="font-medium text-gray-900">
                        {channel.queueLength}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Temps moyen</p>
                      <p className="font-medium text-gray-900">
                        {channel.avgResponseTime}min
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Statut</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        channel.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : channel.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusText(channel.status)}
                      </span>
                    </div>
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

export default CallCenterChannelList; 