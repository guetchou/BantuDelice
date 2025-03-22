
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMessageTime } from '@/utils/formatDate';

interface MessageProps {
  id: string;
  message: string;
  created_at: string;
  is_bot: boolean;
  user?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

const LiveChatMessage: React.FC<MessageProps> = ({ 
  message, 
  created_at, 
  is_bot,
  user
}) => {
  return (
    <div className={`flex ${is_bot ? 'justify-start' : 'justify-end'}`}>
      {is_bot && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/images/support-avatar.png" />
          <AvatarFallback className="bg-orange-500 text-white">S</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          is_bot
            ? 'bg-gray-100'
            : 'bg-orange-500 text-white'
        }`}
      >
        {is_bot && (
          <div className="text-xs font-medium mb-1">Support</div>
        )}
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-70 block text-right">
          {formatMessageTime(created_at)}
        </span>
      </div>
    </div>
  );
};

export default LiveChatMessage;
