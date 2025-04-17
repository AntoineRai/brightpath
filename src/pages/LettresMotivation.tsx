import React, { useState } from 'react';

function LettresMotivation() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    entreprise: '',
    poste: '',
    destinataire: '',
    contenu: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du formulaire (appel API, etc.)
    alert('Lettre de motivation générée avec succès !');
  };

  const handleGenererContenuAI = () => {
    // Simuler une génération IA
    setTimeout(() => {
      setFormData(prevData => ({
        ...prevData,
        contenu: `Objet : Candidature au poste de ${formData.poste}\n\nMadame, Monsieur,\n\nC'est avec un vif intérêt que je vous soumets ma candidature au poste de ${formData.poste} au sein de ${formData.entreprise}, entreprise dont la réputation d'excellence et d'innovation n'est plus à faire.\n\nActuellement [votre situation professionnelle actuelle], je possède une solide expérience dans [domaine d'expertise] qui me permettrait d'apporter une réelle valeur ajoutée à votre équipe.\n\nParticulièrement attiré(e) par [un aspect spécifique de l'entreprise ou du poste], je suis convaincu(e) que mes compétences en [compétence clé] seraient un atout pour répondre aux défis que vous rencontrez.\n\nJe reste à votre disposition pour un entretien au cours duquel je pourrai vous démontrer ma motivation et vous apporter plus de détails sur mon parcours.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n[Votre prénom et nom]`
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Générateur de lettres de motivation par IA</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">Vos informations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom</label>
                    <input 
                      type="text" 
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                    <input 
                      type="text" 
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                    <input 
                      type="tel" 
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Adresse</label>
                    <input 
                      type="text" 
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">Informations sur l'entreprise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom de l'entreprise</label>
                    <input 
                      type="text" 
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Poste convoité</label>
                    <input 
                      type="text" 
                      name="poste"
                      value={formData.poste}
                      onChange={handleChange}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Destinataire (si connu)</label>
                    <input 
                      type="text" 
                      name="destinataire"
                      value={formData.destinataire}
                      onChange={handleChange}
                      placeholder="ex: Mme Martin, Responsable RH"
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-cyan-300">Contenu de la lettre</h2>
                  <button 
                    type="button"
                    onClick={handleGenererContenuAI}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Générer avec IA
                  </button>
                </div>
                <textarea 
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  rows={12} 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Saisissez le contenu de votre lettre de motivation ou générez-le avec l'IA..."
                ></textarea>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-md font-semibold text-lg transition duration-200"
                >
                  Générer la lettre de motivation
                </button>
              </div>
            </form>
          </div>
          
          {/* Aperçu */}
          <div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">Aperçu</h2>
              <div className="bg-white p-6 rounded-md text-black">
                <div className="text-right mb-4">
                  <p>{formData.prenom} {formData.nom}</p>
                  <p>{formData.adresse}</p>
                  <p>{formData.telephone}</p>
                  <p>{formData.email}</p>
                </div>
                
                <div className="mt-8">
                  <p className="mb-2">{formData.destinataire ? `À l'attention de ${formData.destinataire}` : ''}</p>
                  <p className="mb-4">{formData.entreprise ? formData.entreprise : '[Nom de l\'entreprise]'}</p>
                </div>
                
                <div className="mt-8 whitespace-pre-line">
                  {formData.contenu || "Le contenu de votre lettre apparaîtra ici..."}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">Options d'exportation</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Télécharger en PDF
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier dans le presse-papiers
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Exemples et conseils */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">Conseils pour une lettre de motivation efficace</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Personnalisez votre lettre</h3>
              <p className="text-gray-300">
                Adaptez votre lettre à chaque entreprise et poste. Montrez que vous avez fait des recherches sur l'entreprise et que vous comprenez ses besoins spécifiques.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Montrez votre valeur ajoutée</h3>
              <p className="text-gray-300">
                Ne vous contentez pas de lister vos compétences. Expliquez comment vous pouvez contribuer concrètement à l'entreprise et quels résultats vous avez obtenus par le passé.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Restez concis et précis</h3>
              <p className="text-gray-300">
                Votre lettre ne doit pas dépasser une page. Allez à l'essentiel et utilisez un langage clair et direct. Évitez le jargon technique sauf si c'est pertinent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LettresMotivation; 