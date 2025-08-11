import React from 'react';

const MockIndicator: React.FC = () => {
  // Afficher seulement en mode développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Optionnel : masquer l'indicateur si nécessaire
  // return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-500 text-black px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>Mode Mock</span>
      </div>
    </div>
  );
};

export default MockIndicator; 