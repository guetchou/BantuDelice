
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useNavigation } from '@/contexts/NavigationContext';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  className?: string;
  items?: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, items }) => {
  const { currentPath } = useNavigation();
  
  // Si aucun élément n'est fourni, retourner null
  if (!items || items.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex text-sm ${className}`} aria-label="Fil d'Ariane">
      <ol className="flex items-center space-x-1">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />}
              {isLast ? (
                <span className="text-gray-600 font-medium" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className="text-primary hover:underline"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
