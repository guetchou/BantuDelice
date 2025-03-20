
import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = true, 
  text = "Chargement...",
  size = 'medium'
}) => {
  // Définir les tailles selon la prop
  const sizeClasses = {
    small: "h-8 w-8 border-2",
    medium: "h-16 w-16 border-3",
    large: "h-24 w-24 border-4",
  };

  const spinnerSize = sizeClasses[size];
  
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-primary border-b-primary border-r-transparent border-l-transparent`} />
      {text && <p className="mt-4 text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;
