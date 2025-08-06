import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text = 'Chargement...',
  className = '',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-primary rounded-full animate-bounce ${sizeClasses[size]}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`bg-primary rounded-full animate-pulse ${sizeClasses[size]}`} />
  );

  const renderSkeleton = () => (
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-4 ${className}`}>
      {renderLoader()}
      {text && (
        <p className="mt-3 text-sm text-gray-500 text-center">
          {text}
        </p>
      )}
    </div>
  );
};

// Composant de fallback pour Suspense
export const SuspenseFallback: React.FC<{ text?: string }> = ({ text }) => (
  <Loader text={text} />
);

// Composant de chargement pour les pages
export const PageLoader: React.FC = () => (
  <Loader size="lg" text="Chargement de la page..." />
);

// Composant de chargement pour les composants
export const ComponentLoader: React.FC = () => (
  <Loader size="md" text="Chargement..." />
);

// Composant de chargement pour les cartes
export const CardLoader: React.FC = () => (
  <Loader size="sm" text="Chargement..." variant="skeleton" />
);

// Composant de chargement pour les listes
export const ListLoader: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

export default Loader; 