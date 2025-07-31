
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface NavigationLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
}

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
    toast({
      title: message,
      duration: duration,
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return {
    navigate,
    goBack,
    currentPath: location.pathname,
    isActive,
    navigateWithToast
  };
};
