import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

class ColisApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    retryCount: 0,
    isRetrying: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ColisApiErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = async () => {
    this.setState({ isRetrying: true });
    
    try {
      // Attendre un peu avant de réessayer
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1,
        isRetrying: false,
      });
    } catch (error) {
      this.setState({ isRetrying: false });
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    });
  };

  private isNetworkError = (error: Error): boolean => {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError')
    );
  };

  private isApiError = (error: Error): boolean => {
    return (
      error.message.includes('API') ||
      error.message.includes('HTTP') ||
      error.message.includes('500') ||
      error.message.includes('404') ||
      error.message.includes('403')
    );
  };

  private getErrorMessage = (error: Error): string => {
    if (this.isNetworkError(error)) {
      return 'Erreur de connexion. Vérifiez votre connexion internet.';
    }
    
    if (this.isApiError(error)) {
      return 'Erreur du serveur. Veuillez réessayer plus tard.';
    }
    
    return error.message || 'Une erreur inattendue s\'est produite.';
  };

  private getErrorIcon = (error: Error) => {
    if (this.isNetworkError(error)) {
      return <WifiOff className="h-12 w-12 text-red-500" />;
    }
    
    if (this.isApiError(error)) {
      return <AlertTriangle className="h-12 w-12 text-orange-500" />;
    }
    
    return <AlertTriangle className="h-12 w-12 text-red-500" />;
  };

  public render() {
    if (this.state.hasError) {
      const { error, retryCount, isRetrying } = this.state;
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white/90 backdrop-blur border-0 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                {error && this.getErrorIcon(error)}
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Oups ! Une erreur s'est produite
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {error && (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {this.getErrorMessage(error)}
                  </p>
                  
                  {retryCount > 0 && (
                    <p className="text-sm text-gray-500 mb-4">
                      Tentative {retryCount} de reconnexion...
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  onClick={this.handleRetry}
                  disabled={isRetrying}
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-semibold"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Reconnexion...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réessayer
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReset}
                  className="border-gray-300 text-gray-700"
                >
                  Réinitialiser
                </Button>
              </div>

              {error && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    Détails techniques
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-600 overflow-auto">
                    <div><strong>Erreur:</strong> {error.message}</div>
                    {error.stack && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour gérer les erreurs API dans les composants fonctionnels
export const useApiErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleError = React.useCallback((error: Error) => {
    console.error('API Error:', error);
    setError(error);
  }, []);

  const retry = React.useCallback(async (retryFunction: () => Promise<unknown>) => {
    setIsRetrying(true);
    setError(null);
    
    try {
      await retryFunction();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setIsRetrying(false);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isRetrying,
    handleError,
    retry,
    clearError,
  };
};

// Composant pour afficher les erreurs API inline
export const ColisApiError: React.FC<{
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}> = ({ error, onRetry, onDismiss, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Erreur de connexion
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {error.message || 'Une erreur s\'est produite lors de la communication avec le serveur.'}
          </p>
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Réessayer
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDismiss}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Ignorer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les états de chargement
export const ColisApiLoading: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'Chargement en cours...', className = '' }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Composant pour les états vides
export const ColisApiEmpty: React.FC<{
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ 
  title = 'Aucune donnée', 
  message = 'Aucune information disponible pour le moment.',
  icon,
  action,
  className = '' 
}) => {
  return (
    <div className={`text-center p-8 ${className}`}>
      {icon && <div className="mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default ColisApiErrorBoundary; 