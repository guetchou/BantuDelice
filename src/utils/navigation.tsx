
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  to,
  children,
  className,
  activeClassName = 'bg-primary/10',
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link 
      to={to} 
      className={cn(className, isActive && activeClassName)} 
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const navigateWithToast = (path: string, message: string, duration = 3000) => {
    navigate(path);
    toast.success(message, { duration });
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return {
    goBack,
    navigateWithToast,
    currentPath: location.pathname,
    isActive
  };
};
