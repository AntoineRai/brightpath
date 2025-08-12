import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import aiApiService from '../services/aiApiService';

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

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

  const handleGenererContenuAI = async () => {
    // Validation des champs requis
    const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'adresse', 'entreprise', 'poste'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setGenerationError(`Veuillez remplir tous les champs obligatoires : ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setGenerationError('');

    try {
      const response = await aiApiService.generateCoverLetter({
        position: formData.poste,
        company: formData.entreprise,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        destinataire: formData.destinataire || undefined
      });

      setFormData(prevData => ({
        ...prevData,
        contenu: response.content
      }));
      
      setLastGeneratedAt(response.generatedAt);
      
      // Afficher un message de succès
      const successMessage = `Lettre générée avec succès ! (${response.model})`;
      console.log(successMessage);
      
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      
      // Messages d'erreur plus spécifiques pour mobile
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('Impossible de se connecter')) {
          setGenerationError('Erreur de connexion. Vérifiez votre connexion internet et réessayez.');
        } else if (error.message.includes('timeout') || error.message.includes('trop de temps')) {
          setGenerationError('La requête a pris trop de temps. Veuillez réessayer.');
        } else {
          setGenerationError(error.message);
        }
      } else {
        setGenerationError('Erreur lors de la génération de la lettre. Veuillez réessayer.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!formData.contenu.trim()) {
      alert('Aucun contenu à copier. Veuillez d\'abord générer ou saisir une lettre de motivation.');
      return;
    }

    setIsCopying(true);
    setCopySuccess(false);

    try {
      // Préparer le contenu complet de la lettre
      const fullLetter = `${formData.prenom} ${formData.nom}
${formData.adresse}
${formData.email}
${formData.telephone}

[Date]

${formData.destinataire ? `À l'attention de ${formData.destinataire}\n` : ''}${formData.entreprise}

${formData.contenu}`;

      // Utiliser l'API Clipboard moderne si disponible
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullLetter);
        setCopySuccess(true);
      } else {
        // Fallback pour les navigateurs plus anciens ou contextes non sécurisés
        const textArea = document.createElement('textarea');
        textArea.value = fullLetter;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopySuccess(true);
        } else {
          throw new Error('Impossible de copier dans le presse-papiers');
        }
      }

      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert('Erreur lors de la copie dans le presse-papiers. Veuillez réessayer.');
    } finally {
      setIsCopying(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData.contenu.trim()) {
      alert('Aucun contenu à télécharger. Veuillez d\'abord générer ou saisir une lettre de motivation.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      if (!previewRef.current) {
        throw new Error('Élément d\'aperçu non trouvé');
      }

      // Créer un élément temporaire pour le PDF
      const pdfElement = document.createElement('div');
      pdfElement.style.position = 'absolute';
      pdfElement.style.left = '-9999px';
      pdfElement.style.top = '0';
      pdfElement.style.width = '210mm'; // Format A4
      pdfElement.style.padding = '20mm';
      pdfElement.style.backgroundColor = 'white';
      pdfElement.style.color = 'black';
      pdfElement.style.fontFamily = 'Arial, sans-serif';
      pdfElement.style.fontSize = '12px';
      pdfElement.style.lineHeight = '1.5';
      
      // Contenu de la lettre
      const currentDate = new Date().toLocaleDateString('fr-FR');
      pdfElement.innerHTML = `
        <div style="text-align: right; margin-bottom: 30px;">
          <p style="margin: 0; font-weight: bold;">${formData.prenom} ${formData.nom}</p>
          <p style="margin: 0;">${formData.adresse}</p>
          <p style="margin: 0;">${formData.telephone}</p>
          <p style="margin: 0;">${formData.email}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <p style="margin: 0;">${currentDate}</p>
          <br>
          <p style="margin: 0;">${formData.destinataire ? `À l'attention de ${formData.destinataire}` : ''}</p>
          <p style="margin: 0; font-weight: bold;">${formData.entreprise}</p>
        </div>
        
        <div style="white-space: pre-line; margin-top: 30px; text-align: justify;">
          ${formData.contenu}
        </div>
      `;

      document.body.appendChild(pdfElement);

      // Convertir en canvas puis en PDF
      const canvas = await html2canvas(pdfElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(pdfElement);

      // Créer le PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Largeur A4
      const pageHeight = 295; // Hauteur A4
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Première page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Pages supplémentaires si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Télécharger le PDF
      const fileName = `lettre_motivation_${formData.prenom}_${formData.nom}_${formData.entreprise}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
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
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom *</label>
                    <input 
                      type="text" 
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Prénom *</label>
                    <input 
                      type="text" 
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone *</label>
                    <input 
                      type="tel" 
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Adresse *</label>
                    <input 
                      type="text" 
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">Informations sur l'entreprise</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Nom de l'entreprise *</label>
                    <input 
                      type="text" 
                      name="entreprise"
                      value={formData.entreprise}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Poste convoité *</label>
                    <input 
                      type="text" 
                      name="poste"
                      value={formData.poste}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Destinataire (optionnel)</label>
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
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Générer avec IA
                      </>
                    )}
                  </button>
                </div>
                
                {/* Message d'erreur */}
                {generationError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                    <p className="text-red-400 text-sm">{generationError}</p>
                  </div>
                )}
                
                {/* Message de succès */}
                {lastGeneratedAt && !generationError && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                    <p className="text-green-400 text-sm">
                      Lettre générée avec succès le {new Date(lastGeneratedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
                
                <textarea 
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  rows={12} 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Saisissez le contenu de votre lettre de motivation ou générez-le avec l'IA..."
                ></textarea>
              </div>
              
            </form>
          </div>
          
          {/* Aperçu */}
          <div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-semibold text-cyan-300 mb-4">Aperçu</h2>
              <div ref={previewRef} className="bg-white p-6 rounded-md text-black">
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
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF || !formData.contenu.trim()}
                  className={`${
                    isGeneratingPDF 
                      ? 'bg-blue-800 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed'
                  } text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center`}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération PDF...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Télécharger en PDF
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCopyToClipboard}
                  disabled={isCopying || !formData.contenu.trim()}
                  className={`${
                    copySuccess 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed'
                  } text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center justify-center`}
                >
                  {isCopying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Copie...
                    </>
                  ) : copySuccess ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copié !
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copier dans le presse-papiers
                    </>
                  )}
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