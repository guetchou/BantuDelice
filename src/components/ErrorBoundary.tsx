import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur non gérée:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
          <div className="max-w-lg bg-white p-6 rounded-lg shadow-lg border border-red-200">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h2 className="text-xl font-bold text-red-800">Une erreur est survenue</h2>
            </div>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || "Une erreur inattendue s'est produite."}
            </p>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={this.handleReset}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;