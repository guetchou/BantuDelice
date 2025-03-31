
import { useState } from "react";
import { ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
  duration?: number;
};

type Toast = ToastProps & {
  id: string;
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = ({ title, description, variant = "default", action, duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, title, description, variant, action, duration };
    
    setToasts((currentToasts) => [...currentToasts, toast]);
    
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
    }, duration);
    
    return id;
  };

  const toast = (props: ToastProps) => addToast(props);
  toast.map = (callback: (toast: Toast) => React.ReactNode) => toasts.map(callback);

  return { toast };
};

export { ToastActionElement, Toast } from "@/components/ui/toast";

// Pour la rétrocompatibilité
export const toast = (props: ToastProps) => {
  const { toast: internalToast } = useToast();
  return internalToast(props);
};
