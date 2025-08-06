import React from 'react';
import { LucideIcon } from 'lucide-react';
import GlassCard from './GlassCard';

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label }) => {
  return (
    <GlassCard className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </GlassCard>
  );
};

export default StatsCard; 