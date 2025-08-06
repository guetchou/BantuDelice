import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  onClick,
  hover = true
}) => {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 ease-in-out transform",
        hover && "hover:scale-105 hover:shadow-lg cursor-pointer",
        "animate-in fade-in-0 slide-in-from-bottom-4",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

export default AnimatedCard; 