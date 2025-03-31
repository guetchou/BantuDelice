
import { useToast as useShadcnToast, type ToastActionElement } from "@/components/ui/toast";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ToastActionElement;
  duration?: number;
};

export const useToast = () => {
  const { toast: shadcnToast } = useShadcnToast();

  return {
    toast: ({ title, description, variant = "default", action, duration = 5000 }: ToastProps) => {
      return shadcnToast({
        title,
        description,
        variant,
        action,
        duration,
      });
    },
  };
};

export { ToastAction } from "@/components/ui/toast";

// For backwards compatibility with directly imported toast
export const toast = ({ title, description, variant = "default", action, duration = 5000 }: ToastProps) => {
  const { toast: internalToast } = useToast();
  return internalToast({
    title,
    description,
    variant,
    action,
    duration,
  });
};
