import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[90vh] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Éléments visuels d'arrière-plan */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-transparent opacity-30"></div>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Grille décorative */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzYTM5M2YiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTE1IDE1aDMwdjMwSDE1eiIgZmlsbD0iIzBjMDkwYyIgZmlsbC1vcGFjaXR5PSIuNSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-16">
          <div className="mb-4 text-cyan-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 pb-8 tracking-tight">BrightPath</h1>
          <p className="text-2xl md:text-3xl max-w-3xl mb-12 text-gray-100 leading-relaxed">
            Votre chemin vers le succès commence ici.
          </p>
          <Link to="/candidatures" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-5 rounded-md font-semibold text-xl transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/20">
            Commencer maintenant
          </Link>

          <div className="mt-16 flex space-x-8 items-center text-gray-400">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-cyan-400">250+</span>
              <span className="text-sm">Emplois trouvés</span>
            </div>
            <div className="h-10 w-px bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-cyan-400">98%</span>
              <span className="text-sm">Satisfaction</span>
            </div>
            <div className="h-10 w-px bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-cyan-400">24/7</span>
              <span className="text-sm">Support</span>
            </div>
          </div>
        </div>
        
        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Comparaison Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 text-center mb-20">Pourquoi choisir BrightPath ?</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Méthode traditionnelle */}
            <div className="bg-gray-900 p-10 rounded-lg shadow-xl transform transition-all hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-white mb-6">Méthode traditionnelle</h3>
              <ul className="space-y-6">
                <li className="flex items-center">
                  <span className="text-red-500 mr-3 text-xl">✕</span>
                  <span className="text-lg">Chronophage : des heures à rédiger des CV et lettres</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-3 text-xl">✕</span>
                  <span className="text-lg">Épuisante : répétition des mêmes tâches</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-3 text-xl">✕</span>
                  <span className="text-lg">Décourageante : manque de visibilité sur votre progression</span>
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-3 text-xl">✕</span>
                  <span className="text-lg">Désorganisée : difficile de suivre toutes vos candidatures</span>
                </li>
              </ul>
            </div>

            {/* Méthode BrightPath */}
            <div className="bg-gray-700 p-10 rounded-lg shadow-xl transform transition-all hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-cyan-300 mb-6">Méthode BrightPath</h3>
              <ul className="space-y-6">
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-lg">Simple : interface épurée et intuitive</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-lg">Rapide : génération automatisée et personnalisée</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-lg">Efficace : suivez votre progression en temps réel</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span className="text-lg">Organisée : toutes vos candidatures au même endroit</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Section */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 text-center mb-20">Nos fonctionnalités</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Fonctionnalité 1 */}
            <div className="bg-gray-800 p-10 rounded-lg transition duration-300 hover:bg-gray-700 flex flex-col items-center text-center shadow-xl transform hover:-translate-y-2">
              <div className="bg-cyan-900 p-6 rounded-full mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Suivi des candidatures</h3>
              <p className="text-gray-300 text-lg">
                Suivez en temps réel l'état de toutes vos candidatures. Ne perdez plus aucune opportunité.
              </p>
            </div>

            {/* Fonctionnalité 2 */}
            <div className="bg-gray-800 p-10 rounded-lg transition duration-300 hover:bg-gray-700 flex flex-col items-center text-center shadow-xl transform hover:-translate-y-2">
              <div className="bg-cyan-900 p-6 rounded-full mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">CV optimisés par IA</h3>
              <p className="text-gray-300 text-lg">
                Créez des CV personnalisés et optimisés pour chaque offre grâce à notre IA intégrée.
              </p>
            </div>

            {/* Fonctionnalité 3 */}
            <div className="bg-gray-800 p-10 rounded-lg transition duration-300 hover:bg-gray-700 flex flex-col items-center text-center shadow-xl transform hover:-translate-y-2">
              <div className="bg-cyan-900 p-6 rounded-full mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lettres de motivation IA</h3>
              <p className="text-gray-300 text-lg">
                Générez des lettres de motivation convaincantes adaptées à chaque entreprise en quelques clics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900 to-blue-900 text-center mt-16">
        <h2 className="text-4xl font-bold text-white mb-8">Prêt à transformer votre recherche d'emploi ?</h2>
        <Link to="/candidatures" className="bg-white hover:bg-gray-100 text-cyan-900 px-10 py-5 rounded-md font-semibold text-xl transition duration-300 transform hover:scale-105 inline-block shadow-xl">
          Commencer gratuitement
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
            <div>
              © {new Date().getFullYear()} BrightPath
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 