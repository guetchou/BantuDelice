import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

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

  const navigateWithToast = (path: string, message: string) => {
    navigate(path);
    toast.success(message);
  };

  return {
    goBack,
    navigateWithToast,
    currentPath: location.pathname
  };
};