
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppNavigation } from '@/utils/navigation';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  className?: string;
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  className, 
  items,
  showHomeIcon = true,
  separator = <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
}) => {
  const { isActive } = useAppNavigation();
  
  // Si aucun élément n'est fourni, retourner null
  if (!items || items.length === 0) {
    return null;
  }

  // Si la page d'accueil n'est pas dans les items et showHomeIcon est true, l'ajouter
  const breadcrumbItems = [...items];
  if (showHomeIcon && items[0]?.path !== '/') {
    breadcrumbItems.unshift({ label: 'Accueil', path: '/' });
  }

  return (
    <nav 
      className={cn("flex text-sm py-2", className)} 
      aria-label="Fil d'Ariane"
      itemScope 
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="flex items-center flex-wrap">
        {breadcrumbItems.map((crumb, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isHome = crumb.path === '/';
          
          return (
            <li 
              key={crumb.path} 
              className="flex items-center"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && separator}
              {isLast ? (
                <span className="text-gray-600 font-medium" aria-current="page" itemProp="name">
                  {isHome && showHomeIcon ? <Home className="h-4 w-4" /> : crumb.label}
                </span>
              ) : (
                <Link 
                  to={crumb.path} 
                  className={cn(
                    "text-primary hover:underline flex items-center",
                    isActive(crumb.path) && "font-medium"
                  )}
                  itemProp="item"
                >
                  {isHome && showHomeIcon ? (
                    <Home className="h-4 w-4" />
                  ) : (
                    <span itemProp="name">{crumb.label}</span>
                  )}
                </Link>
              )}
              <meta itemProp="position" content={`${index + 1}`} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
