import React, { useState } from 'react';

interface TestErrorProps {
  throwError?: boolean;
}

const TestError: React.FC<TestErrorProps> = ({ throwError = false }) => {
  const [shouldThrow, setShouldThrow] = useState(throwError);

  if (shouldThrow) {
    throw new Error('Ceci est une erreur de test pour vérifier l\'ErrorBoundary !');
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4">Test de l'ErrorBoundary</h3>
      <p className="text-gray-300 mb-4">
        Ce composant permet de tester le fonctionnement de l'ErrorBoundary.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200"
      >
        Déclencher une erreur
      </button>
    </div>
  );
};

export default TestError; 