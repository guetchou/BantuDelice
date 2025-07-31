import React from 'react';
import { cn } from '@/lib/utils';

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AlertDialog = React.forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ open = false, onOpenChange, children }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={() => onOpenChange?.(false)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    );
  }
);

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4", className)}
      >
        {children}
      </div>
    );
  }
);

const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn("mb-4", className)}>
        {children}
      </div>
    );
  }
);

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, children }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn("text-lg font-semibold text-gray-900", className)}
      >
        {children}
      </h2>
    );
  }
);

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, children }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-600", className)}
      >
        {children}
      </p>
    );
  }
);

const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex justify-end gap-2 mt-6", className)}
      >
        {children}
      </div>
    );
  }
);

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, children, onClick, disabled }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        {children}
      </button>
    );
  }
);

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, children, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          "px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",
          className
        )}
      >
        {children}
      </button>
    );
  }
);

AlertDialog.displayName = 'AlertDialog';
AlertDialogContent.displayName = 'AlertDialogContent';
AlertDialogHeader.displayName = 'AlertDialogHeader';
AlertDialogTitle.displayName = 'AlertDialogTitle';
AlertDialogDescription.displayName = 'AlertDialogDescription';
AlertDialogFooter.displayName = 'AlertDialogFooter';
AlertDialogAction.displayName = 'AlertDialogAction';
AlertDialogCancel.displayName = 'AlertDialogCancel';

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
}; 