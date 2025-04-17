import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">À propos de BrightPath</h1>
        <div className="bg-gray-800 shadow overflow-hidden rounded-lg border border-gray-700">
          <div className="px-6 py-8">
            <p className="text-gray-300 mb-6 leading-relaxed">
              BrightPath est une application conçue pour aider les utilisateurs à atteindre leurs objectifs en fournissant une voie claire vers le succès professionnel.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Notre mission est de simplifier le processus de recherche d'emploi et de développement de carrière, en offrant des outils efficaces et une interface intuitive. Nous utilisons les dernières technologies d'intelligence artificielle pour générer des CV et des lettres de motivation personnalisés qui se démarquent auprès des recruteurs.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Fondée en 2025, notre équipe est composée d'experts en recrutement, développeurs et designers passionnés par l'innovation et déterminés à créer une expérience utilisateur exceptionnelle.
            </p>
            
            <div className="border-t border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">Notre vision</h2>
              <p className="text-gray-300 leading-relaxed">
                Nous croyons que chaque personne mérite d'accéder aux meilleures opportunités professionnelles. BrightPath vise à démocratiser l'accès à des outils de qualité pour tous les chercheurs d'emploi, indépendamment de leur expérience ou de leur formation.
              </p>
            </div>
            
            <div className="border-t border-gray-700 pt-6 mt-6">
              <h2 className="text-xl font-bold text-cyan-300 mb-4">Notre équipe</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center text-cyan-400">
                    JD
                  </div>
                  <p className="text-white font-medium">Jean Dupont</p>
                  <p className="text-gray-400 text-sm">Fondateur</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center text-cyan-400">
                    ML
                  </div>
                  <p className="text-white font-medium">Marie Leroy</p>
                  <p className="text-gray-400 text-sm">Développeuse</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center text-cyan-400">
                    PM
                  </div>
                  <p className="text-white font-medium">Pierre Martin</p>
                  <p className="text-gray-400 text-sm">Designer UX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 