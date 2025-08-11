import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  // Désactiver le scroll sur le body quand la page 404 est affichée
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ overflow: 'hidden', height: '100vh' }}>
      {/* Éléments visuels d'arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent opacity-30"></div>
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Grille décorative */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzYTM5M2YiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTE1IDE1aDMwdjMwSDE1eiIgZmlsbD0iIzBjMDkwYyIgZmlsbC1vcGFjaXR5PSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Icône 404 */}
        <div className="mb-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Titre et message */}
        <h1 className="text-6xl font-bold text-cyan-400 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Page introuvable</h2>
        <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Page précédente
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {/* Liens utiles */}
        <div className="mb-4 pt-4 border-t border-gray-700">
          <h3 className="text-base font-medium text-white mb-3">Pages populaires</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/candidatures"
              className="text-cyan-400 hover:text-cyan-300 transition duration-200 text-sm"
            >
              Suivi des candidatures
            </Link>
            <Link
              to="/cv-generator"
              className="text-cyan-400 hover:text-cyan-300 transition duration-200 text-sm"
            >
              Générateur de CV
            </Link>
            <Link
              to="/lettres-motivation"
              className="text-cyan-400 hover:text-cyan-300 transition duration-200 text-sm"
            >
              Lettres de motivation
            </Link>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 transition duration-200 text-sm"
            >
              Connexion
            </Link>
          </div>
        </div>

        {/* Message d'aide */}
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 