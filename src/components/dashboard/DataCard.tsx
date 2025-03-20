
import { ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  onClick?: () => void;
  footer?: ReactNode;
  loading?: boolean;
}

export default function DataCard({
  title,
  value,
  description,
  icon,
  change,
  trend = 'neutral',
  color = 'primary',
  onClick,
  footer,
  loading = false
}: DataCardProps) {
  // Fonction pour déterminer les couleurs de tendance
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="h-3 w-3 mr-1" />;
    if (trend === 'down') return <ArrowDown className="h-3 w-3 mr-1" />;
    return null;
  };

  // Définir la classe de couleur pour l'icône
  const getIconColorClass = () => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      case 'orange': return 'text-orange-500';
      case 'red': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  // Définir la classe de couleur pour l'arrière-plan de l'icône
  const getIconBgClass = () => {
    switch (color) {
      case 'primary': return 'bg-primary/10';
      case 'blue': return 'bg-blue-50 dark:bg-blue-900/30';
      case 'green': return 'bg-green-50 dark:bg-green-900/30';
      case 'orange': return 'bg-orange-50 dark:bg-orange-900/30';
      case 'red': return 'bg-red-50 dark:bg-red-900/30';
      default: return 'bg-primary/10';
    }
  };

  return (
    <div 
      className={`
        dashboard-card relative overflow-hidden
        ${onClick ? 'cursor-pointer hover:border-primary/50' : ''}
        ${loading ? 'animate-pulse' : 'animate-fade-in'}
      `}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{loading ? '-' : value}</h3>
          
          {(description || change) && (
            <div className="mt-1">
              {change && (
                <span className={`${getTrendColor()} text-sm flex items-center`}>
                  {getTrendIcon()}
                  {change}
                  {description && <span className="text-muted-foreground text-xs ml-1">{description}</span>}
                </span>
              )}
              {!change && description && (
                <span className="text-muted-foreground text-xs">{description}</span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-full ${getIconBgClass()}`}>
            <div className={getIconColorClass()}>
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-border">
          {footer}
        </div>
      )}
      
      {onClick && (
        <div className="absolute bottom-3 right-3">
          <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
        </div>
      )}
    </div>
  );
}
