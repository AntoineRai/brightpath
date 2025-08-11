import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Met à jour l'état pour que le prochain rendu affiche l'UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur pour le debugging
    console.error('Erreur capturée par ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Éléments visuels d'arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent opacity-30"></div>
          
          {/* Cercles décoratifs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"></div>
          
          {/* Grille décorative */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzYTM5M2YiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTE1IDE1aDMwdjMwSDE1eiIgZmlsbD0iIzBjMDkwYyIgZmlsbC1vcGFjaXR5PSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

          <div className="max-w-2xl w-full text-center relative z-10">
            {/* Icône d'erreur */}
            <div className="mb-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Titre et message */}
            <h1 className="text-4xl font-bold text-red-400 mb-4">Oups !</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">Une erreur inattendue s'est produite</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
              Désolé, quelque chose s'est mal passé. Notre équipe a été notifiée et travaille à résoudre le problème.
            </p>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser la page
              </button>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Retour à l'accueil
                </Link>
                
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Page précédente
                </button>
              </div>
            </div>

            {/* Détails de l'erreur (en mode développement) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700 text-left">
                <h3 className="text-lg font-medium text-white mb-2">Détails de l'erreur (développement)</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><strong>Message :</strong> {this.state.error.message}</p>
                  <p><strong>Stack :</strong></p>
                  <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack :</strong></p>
                      <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Message d'aide */}
            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                Si le problème persiste, contactez notre support technique.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 