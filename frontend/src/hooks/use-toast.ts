
import { useContext } from 'react';
import { ToastContext } from '@/components/ui/toast';
import { toast as sonnerToast } from 'sonner';

// Hook pour utiliser les toasts
export const useToast = () => {
  const context = useContext(ToastContext);
  return {
    ...context,
    toast: sonnerToast,
    success: (message: string) => sonnerToast.success(message),
    error: (message: string) => sonnerToast.error(message),
    warning: (message: string) => sonnerToast.warning(message),
    info: (message: string) => sonnerToast.info(message),
  };
};

// Export direct de la fonction toast
export const toast = sonnerToast;
