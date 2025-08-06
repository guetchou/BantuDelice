import * as React from 'react';

// Contexte Toast
export const ToastContext = React.createContext<unknown>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<unknown[]>([]);

  const addToast = (toast: unknown) => setToasts((prev) => [...prev, toast]);
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastViewport>{toasts.map((toast) => <Toast key={toast.id} {...toast} />)}</ToastViewport>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return React.useContext(ToastContext);
}

export function Toast({ title, description, onClose }: { title: string; description?: string; onClose?: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-orange-200 rounded-lg shadow-lg p-4 z-50 min-w-[280px] max-w-xs animate-fade-in">
      <ToastTitle>{title}</ToastTitle>
      {description && <ToastDescription>{description}</ToastDescription>}
      <ToastClose onClick={onClose} />
    </div>
  );
}

export function ToastTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-bold text-orange-700 mb-1">{children}</div>;
}

export function ToastDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-700 text-sm mb-2">{children}</div>;
}

export function ToastClose({ onClick }: { onClick?: () => void }) {
  return (
    <button
      className="absolute top-2 right-2 text-orange-400 hover:text-orange-700 text-lg font-bold"
      onClick={onClick}
      aria-label="Fermer la notification"
      type="button"
    >
      ×
    </button>
  );
}

export function ToastViewport({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">{children}</div>;
} 