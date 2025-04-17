import React, { useState } from 'react';

function CVGenerator() {
  const [activeStep, setActiveStep] = useState(1);
  
  const nextStep = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, 4));
  };
  
  const prevStep = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Générateur de CV optimisé par IA</h1>
        
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                1
              </div>
              <span className="text-sm">Informations personnelles</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-cyan-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                2
              </div>
              <span className="text-sm">Expérience professionnelle</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-cyan-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                3
              </div>
              <span className="text-sm">Compétences & Formation</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 4 ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 4 ? 'text-cyan-400' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep >= 4 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                4
              </div>
              <span className="text-sm">Finalisation</span>
            </div>
          </div>
        </div>
        
        {/* Contenu du formulaire */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          {activeStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-cyan-300 mb-6">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                  <input type="text" className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                  <input type="text" className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                  <input type="tel" className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Titre du poste recherché</label>
                  <input type="text" className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Résumé professionnel</label>
                  <textarea rows={4} className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"></textarea>
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-cyan-300 mb-6">Expérience professionnelle</h2>
              <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Expérience #1</h3>
                  <button className="text-red-400 hover:text-red-300">Supprimer</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Poste</label>
                    <input type="text" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Entreprise</label>
                    <input type="text" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date de début</label>
                    <input type="date" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date de fin</label>
                    <input type="date" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea rows={3} className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter une expérience
                </button>
              </div>
            </div>
          )}
          
          {activeStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-cyan-300 mb-6">Compétences & Formation</h2>
              <div className="mb-6">
                <label className="block text-lg font-medium text-white mb-2">Compétences</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center bg-gray-700 px-3 py-2 rounded-md">
                    <span className="flex-1 text-gray-300">JavaScript</span>
                    <button className="text-red-400 hover:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center bg-gray-700 px-3 py-2 rounded-md">
                    <span className="flex-1 text-gray-300">React</span>
                    <button className="text-red-400 hover:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center bg-gray-700 px-3 py-2 rounded-md">
                    <span className="flex-1 text-gray-300">TypeScript</span>
                    <button className="text-red-400 hover:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex">
                  <input type="text" placeholder="Ajouter une compétence" className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-r-md font-medium transition duration-200">
                    Ajouter
                  </button>
                </div>
              </div>
              
              <div className="mt-8">
                <label className="block text-lg font-medium text-white mb-2">Formation</label>
                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Formation #1</h3>
                    <button className="text-red-400 hover:text-red-300">Supprimer</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Diplôme</label>
                      <input type="text" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Établissement</label>
                      <input type="text" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Année de début</label>
                      <input type="number" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Année de fin</label>
                      <input type="number" className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter une formation
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-cyan-300 mb-6">Finalisation</h2>
              <div className="p-4 bg-gray-700 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Aperçu du CV</h3>
                <div className="bg-white p-6 rounded-md text-gray-800 mb-4 overflow-y-auto max-h-96">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <p>Développeur Web Front-end</p>
                    <p className="text-sm mt-2">john.doe@example.com | +33 6 12 34 56 78</p>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Résumé</h2>
                    <p className="text-sm">Développeur front-end passionné avec 5 ans d'expérience dans la création d'interfaces utilisateur modernes et réactives. Spécialisé en React et TypeScript.</p>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Expérience professionnelle</h2>
                    <div className="mb-3">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Développeur Front-end</h3>
                        <span className="text-sm">2020 - Actuel</span>
                      </div>
                      <p className="font-medium text-sm">TechVision</p>
                      <ul className="list-disc pl-5 text-sm mt-1">
                        <li>Développement d'applications SPA avec React</li>
                        <li>Intégration de designs UI/UX avec Tailwind CSS</li>
                        <li>Optimisation des performances et accessibilité</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Formation</h2>
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Master en Informatique</h3>
                        <span className="text-sm">2015 - 2020</span>
                      </div>
                      <p className="text-sm">Université de Paris</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Compétences</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">JavaScript</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">React</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">TypeScript</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">Tailwind CSS</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-sm">Git</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Modèle de CV</label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="modern">Moderne</option>
                    <option value="classic">Classique</option>
                    <option value="minimal">Minimaliste</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Format de téléchargement</label>
                  <select className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="pdf">PDF</option>
                    <option value="docx">Word (.docx)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold text-lg transition duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger le CV
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button 
            onClick={prevStep}
            className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeStep > 1 ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            disabled={activeStep === 1}
          >
            Précédent
          </button>
          
          <button 
            onClick={nextStep}
            className={`px-4 py-2 rounded-md font-medium transition duration-200 ${activeStep < 4 ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
            disabled={activeStep === 4}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

export default CVGenerator; 