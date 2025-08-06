import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  hover = true 
}) => {
  return (
    <Card className={`border-0 shadow-xl backdrop-blur-md bg-white/70 hover:bg-white/90 transition-all duration-300 ${hover ? 'group' : ''} ${className}`}>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default GlassCard; 