import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, MessageCircle, PhoneCall, HelpCircle, Mail } from 'lucide-react';

interface QuickLink {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

interface ColisQuickLinksProps {
  variant?: 'horizontal' | 'vertical';
  showTitle?: boolean;
  className?: string;
}

const ColisQuickLinks: React.FC<ColisQuickLinksProps> = ({ 
  variant = 'horizontal', 
  showTitle = false,
  className = ''
}) => {
  const quickLinks: QuickLink[] = [
    {
      to: '/colis/expedition',
      label: 'Formulaire d\'expédition',
      icon: FileText,
      variant: 'default',
      size: 'md'
    },
    {
      to: '/colis/tracking',
      label: 'Suivre un colis',
      icon: MessageCircle,
      variant: 'outline',
      size: 'md'
    },
    {
      to: '/colis/reclamation',
      label: 'Réclamation',
      icon: AlertTriangle,
      variant: 'ghost',
      size: 'sm'
    },
    {
      to: '/colis/plainte',
      label: 'Plainte',
      icon: AlertTriangle,
      variant: 'ghost',
      size: 'sm'
    },
    {
      to: '/colis/support',
      label: 'Support client',
      icon: HelpCircle,
      variant: 'ghost',
      size: 'sm'
    },
    {
      to: '/contact',
      label: 'Nous contacter',
      icon: PhoneCall,
      variant: 'ghost',
      size: 'sm'
    }
  ];

  const getButtonClasses = (link: QuickLink) => {
    const baseClasses = 'transition-all duration-200';
    
    switch (link.variant) {
      case 'default':
        return `${baseClasses} bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white`;
      case 'outline':
        return `${baseClasses} border-orange-600 bg-white/80 text-orange-600 hover:bg-orange-600/10 hover:border-orange-700`;
      case 'ghost':
      default:
        return `${baseClasses} text-gray-600 hover:text-orange-600 hover:bg-orange-50`;
    }
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accès rapide</h3>
      )}
      
      <div className={`flex ${variant === 'vertical' ? 'flex-col' : 'flex-wrap'} gap-3`}>
        {quickLinks.map((link, index) => (
          <Link key={index} to={link.to}>
            <Button 
              variant={link.variant}
              size={link.size}
              className={getButtonClasses(link)}
            >
              <link.icon className="h-4 w-4 mr-2" />
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ColisQuickLinks; 