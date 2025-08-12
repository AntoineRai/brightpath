import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Experience {
  id: string;
  poste: string;
  entreprise: string;
  dateDebut: string;
  dateFin: string;
  description: string;
}

interface Formation {
  id: string;
  diplome: string;
  etablissement: string;
  anneeDebut: string;
  anneeFin: string;
}

interface PersonalInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  titrePoste: string;
  resume: string;
}

type CVModel = 'modern' | 'classic' | 'minimal' | 'professional';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

function CVGenerator() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState<CVModel>('modern');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#06b6d4', // cyan-500
    secondary: '#64748b', // gray-500
    accent: '#0891b2' // cyan-600
  });
  
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    titrePoste: '',
    resume: ''
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: '1',
      poste: '',
      entreprise: '',
      dateDebut: '',
      dateFin: '',
      description: ''
    }
  ]);
  
  const [competences, setCompetences] = useState<string[]>([
    'JavaScript',
    'React',
    'TypeScript'
  ]);
  
  const [nouvelleCompetence, setNouvelleCompetence] = useState('');
  
  const [formations, setFormations] = useState<Formation[]>([
    {
      id: '1',
      diplome: '',
      etablissement: '',
      anneeDebut: '',
      anneeFin: ''
    }
  ]);
  
  const nextStep = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, 4));
  };
  
  const prevStep = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 1));
  };

  // Gestion des informations personnelles
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  // Gestion des expériences
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      poste: '',
      entreprise: '',
      dateDebut: '',
      dateFin: '',
      description: ''
    };
    setExperiences(prev => [...prev, newExperience]);
  };

  const removeExperience = (id: string) => {
    if (experiences.length > 1) {
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(prev => prev.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Gestion des compétences
  const addCompetence = () => {
    if (nouvelleCompetence.trim() && !competences.includes(nouvelleCompetence.trim())) {
      setCompetences(prev => [...prev, nouvelleCompetence.trim()]);
      setNouvelleCompetence('');
    }
  };

  const removeCompetence = (competence: string) => {
    setCompetences(prev => prev.filter(comp => comp !== competence));
  };

  const handleCompetenceKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCompetence();
    }
  };

  // Gestion des formations
  const addFormation = () => {
    const newFormation: Formation = {
      id: Date.now().toString(),
      diplome: '',
      etablissement: '',
      anneeDebut: '',
      anneeFin: ''
    };
    setFormations(prev => [...prev, newFormation]);
  };

  const removeFormation = (id: string) => {
    if (formations.length > 1) {
      setFormations(prev => prev.filter(formation => formation.id !== id));
    }
  };

  const updateFormation = (id: string, field: keyof Formation, value: string) => {
    setFormations(prev => prev.map(formation => 
      formation.id === id ? { ...formation, [field]: value } : formation
    ));
  };

  // Gestion des couleurs personnalisées
  const updateCustomColor = (field: keyof CustomColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [field]: value }));
  };

  // Téléchargement PDF
  const handleDownloadPDF = async () => {
    if (!cvPreviewRef.current) {
      alert('Aperçu du CV non trouvé. Veuillez réessayer.');
      return;
    }

    setIsGeneratingPDF(true);

    try {
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
      
      // Contenu du CV selon le modèle
      const currentDate = new Date().toLocaleDateString('fr-FR');
      let cvContent = '';
      
      switch (selectedModel) {
        case 'modern':
          cvContent = `
            <div style="text-align: center; margin-bottom: 30px; border-left: 4px solid ${customColors.primary}; padding-left: 20px;">
              <h1 style="font-size: 24px; font-weight: bold; color: ${customColors.primary}; margin-bottom: 10px;">
                ${personalInfo.prenom && personalInfo.nom ? `${personalInfo.prenom} ${personalInfo.nom}` : 'Votre nom et prénom'}
              </h1>
              <p style="font-size: 18px; color: #666; font-weight: 500;">${personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p style="font-size: 12px; color: #888; margin-top: 10px;">
                ${personalInfo.email && personalInfo.telephone ? `${personalInfo.email} | ${personalInfo.telephone}` : personalInfo.email || personalInfo.telephone || 'Email et téléphone'}
              </p>
            </div>
          `;
          break;
          
        case 'classic':
          cvContent = `
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px;">
              <h1 style="font-size: 22px; font-weight: bold; color: #333; margin-bottom: 5px;">
                ${personalInfo.prenom && personalInfo.nom ? `${personalInfo.prenom} ${personalInfo.nom}` : 'Votre nom et prénom'}
              </h1>
              <p style="font-size: 16px; color: #666;">${personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p style="font-size: 12px; color: #888; margin-top: 5px;">
                ${personalInfo.email && personalInfo.telephone ? `${personalInfo.email} | ${personalInfo.telephone}` : personalInfo.email || personalInfo.telephone || 'Email et téléphone'}
              </p>
            </div>
          `;
          break;
          
        case 'minimal':
          cvContent = `
            <div style="text-align: center; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
              <h1 style="font-size: 20px; font-weight: 300; color: #333; margin-bottom: 10px;">
                ${personalInfo.prenom && personalInfo.nom ? `${personalInfo.prenom} ${personalInfo.nom}` : 'Votre nom et prénom'}
              </h1>
              <p style="color: #666;">${personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p style="font-size: 10px; color: #999; margin-top: 5px;">
                ${personalInfo.email && personalInfo.telephone ? `${personalInfo.email} | ${personalInfo.telephone}` : personalInfo.email || personalInfo.telephone || 'Email et téléphone'}
              </p>
            </div>
          `;
          break;
          
        case 'professional':
          cvContent = `
            <div style="border-bottom: 4px solid ${customColors.primary}; padding-bottom: 20px; margin-bottom: 30px;">
              <h1 style="font-size: 24px; font-weight: bold; color: ${customColors.primary}; margin-bottom: 5px;">
                ${personalInfo.prenom && personalInfo.nom ? `${personalInfo.prenom} ${personalInfo.nom}` : 'Votre nom et prénom'}
              </h1>
              <p style="font-size: 18px; color: #555; font-weight: 500;">${personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p style="font-size: 12px; color: #666; margin-top: 10px;">
                ${personalInfo.email && personalInfo.telephone ? `${personalInfo.email} | ${personalInfo.telephone}` : personalInfo.email || personalInfo.telephone || 'Email et téléphone'}
              </p>
            </div>
          `;
          break;
      }

      // Ajouter le résumé si présent
      if (personalInfo.resume) {
        cvContent += `
          <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="font-size: 16px; font-weight: bold; color: ${customColors.primary}; margin-bottom: 10px;">Résumé</h2>
            <p style="font-size: 12px; line-height: 1.6;">${personalInfo.resume}</p>
          </div>
        `;
      }

      // Ajouter les expériences
      cvContent += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; color: ${customColors.primary}; border-bottom: 2px solid ${customColors.primary}; padding-bottom: 5px; margin-bottom: 15px;">Expérience professionnelle</h2>
      `;
      
      experiences.forEach((experience) => {
        cvContent += `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <h3 style="font-weight: bold; font-size: 14px;">${experience.poste || 'Poste à définir'}</h3>
              <span style="font-size: 11px; color: #666;">
                ${experience.dateDebut && experience.dateFin ? `${new Date(experience.dateDebut).getFullYear()} - ${new Date(experience.dateFin).getFullYear()}` : 'Période à définir'}
              </span>
            </div>
            <p style="font-weight: 500; font-size: 12px; color: ${customColors.primary}; margin-bottom: 5px;">${experience.entreprise || 'Entreprise à définir'}</p>
            ${experience.description ? `<p style="font-size: 11px; line-height: 1.5;">${experience.description}</p>` : ''}
          </div>
        `;
      });
      
      cvContent += '</div>';

      // Ajouter les formations
      cvContent += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; color: ${customColors.primary}; border-bottom: 2px solid ${customColors.primary}; padding-bottom: 5px; margin-bottom: 15px;">Formation</h2>
      `;
      
      formations.forEach((formation) => {
        cvContent += `
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <h3 style="font-weight: bold; font-size: 12px;">${formation.diplome || 'Diplôme à définir'}</h3>
              <span style="font-size: 11px; color: #666;">
                ${formation.anneeDebut && formation.anneeFin ? `${formation.anneeDebut} - ${formation.anneeFin}` : 'Période à définir'}
              </span>
            </div>
            <p style="font-size: 11px; color: #666;">${formation.etablissement || 'Établissement à définir'}</p>
          </div>
        `;
      });
      
      cvContent += '</div>';

      // Ajouter les compétences
      cvContent += `
        <div>
          <h2 style="font-size: 18px; font-weight: bold; color: ${customColors.primary}; border-bottom: 2px solid ${customColors.primary}; padding-bottom: 5px; margin-bottom: 15px;">Compétences</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      `;
      
      competences.forEach((competence) => {
        cvContent += `
          <span style="background-color: ${customColors.primary}20; color: ${customColors.primary}; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
            ${competence}
          </span>
        `;
      });
      
      cvContent += '</div></div>';

      pdfElement.innerHTML = cvContent;
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
      const fileName = `cv_${personalInfo.prenom}_${personalInfo.nom}_${selectedModel}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Rendu du CV selon le modèle
  const renderCVContent = () => {
    const baseClasses = "bg-white p-6 rounded-md text-gray-800";
    
    switch (selectedModel) {
      case 'modern':
        return (
          <div className={`${baseClasses}`} style={{ borderLeft: `4px solid ${customColors.primary}` }}>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2" style={{ color: customColors.primary }}>
                {personalInfo.prenom && personalInfo.nom 
                  ? `${personalInfo.prenom} ${personalInfo.nom}`
                  : 'Votre nom et prénom'
                }
              </h1>
              <p className="text-xl text-gray-600 font-medium">{personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p className="text-sm mt-2 text-gray-500">
                {personalInfo.email && personalInfo.telephone 
                  ? `${personalInfo.email} | ${personalInfo.telephone}`
                  : personalInfo.email || personalInfo.telephone || 'Email et téléphone'
                }
              </p>
            </div>
            
            {personalInfo.resume && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-bold mb-2" style={{ color: customColors.primary }}>Résumé</h2>
                <p className="text-sm leading-relaxed">{personalInfo.resume}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Expérience professionnelle</h2>
              {experiences.map((experience, index) => (
                <div key={experience.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{experience.poste || 'Poste à définir'}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {experience.dateDebut && experience.dateFin 
                        ? `${new Date(experience.dateDebut).getFullYear()} - ${new Date(experience.dateFin).getFullYear()}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="font-medium mb-2" style={{ color: customColors.primary }}>{experience.entreprise || 'Entreprise à définir'}</p>
                  {experience.description && (
                    <p className="text-sm leading-relaxed">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Formation</h2>
              {formations.map((formation, index) => (
                <div key={formation.id} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{formation.diplome || 'Diplôme à définir'}</h3>
                    <span className="text-sm text-gray-500">
                      {formation.anneeDebut && formation.anneeFin 
                        ? `${formation.anneeDebut} - ${formation.anneeFin}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{formation.etablissement || 'Établissement à définir'}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {competences.map((competence, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${customColors.primary}20`, color: customColors.primary }}>
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'classic':
        return (
          <div className={`${baseClasses}`} style={{ border: `2px solid ${customColors.secondary}` }}>
            <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${customColors.secondary}` }}>
              <h1 className="text-2xl font-bold mb-1" style={{ color: customColors.primary }}>
                {personalInfo.prenom && personalInfo.nom 
                  ? `${personalInfo.prenom} ${personalInfo.nom}`
                  : 'Votre nom et prénom'
                }
              </h1>
              <p className="text-lg text-gray-600">{personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p className="text-sm mt-1 text-gray-500">
                {personalInfo.email && personalInfo.telephone 
                  ? `${personalInfo.email} | ${personalInfo.telephone}`
                  : personalInfo.email || personalInfo.telephone || 'Email et téléphone'
                }
              </p>
            </div>
            
            {personalInfo.resume && (
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-2" style={{ color: customColors.primary }}>Résumé</h2>
                <p className="text-sm">{personalInfo.resume}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>Expérience professionnelle</h2>
              {experiences.map((experience, index) => (
                <div key={experience.id} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{experience.poste || 'Poste à définir'}</h3>
                    <span className="text-sm text-gray-500">
                      {experience.dateDebut && experience.dateFin 
                        ? `${new Date(experience.dateDebut).getFullYear()} - ${new Date(experience.dateFin).getFullYear()}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="font-medium text-sm mb-1" style={{ color: customColors.accent }}>{experience.entreprise || 'Entreprise à définir'}</p>
                  {experience.description && (
                    <p className="text-sm">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>Formation</h2>
              {formations.map((formation, index) => (
                <div key={formation.id} className="mb-2">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{formation.diplome || 'Diplôme à définir'}</h3>
                    <span className="text-sm text-gray-500">
                      {formation.anneeDebut && formation.anneeFin 
                        ? `${formation.anneeDebut} - ${formation.anneeFin}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{formation.etablissement || 'Établissement à définir'}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: customColors.primary }}>Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {competences.map((competence, index) => (
                  <span key={index} className="px-2 py-1 rounded text-sm" style={{ backgroundColor: `${customColors.primary}20`, color: customColors.primary }}>
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'minimal':
        return (
          <div className={`${baseClasses} max-w-2xl mx-auto`}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light mb-2" style={{ color: customColors.primary }}>
                {personalInfo.prenom && personalInfo.nom 
                  ? `${personalInfo.prenom} ${personalInfo.nom}`
                  : 'Votre nom et prénom'
                }
              </h1>
              <p className="text-gray-600">{personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p className="text-xs text-gray-400 mt-1">
                {personalInfo.email && personalInfo.telephone 
                  ? `${personalInfo.email} | ${personalInfo.telephone}`
                  : personalInfo.email || personalInfo.telephone || 'Email et téléphone'
                }
              </p>
            </div>
            
            {personalInfo.resume && (
              <div className="mb-8 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">{personalInfo.resume}</p>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4" style={{ color: customColors.secondary }}>Expérience</h2>
              {experiences.map((experience, index) => (
                <div key={experience.id} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{experience.poste || 'Poste à définir'}</h3>
                    <span className="text-xs text-gray-400">
                      {experience.dateDebut && experience.dateFin 
                        ? `${new Date(experience.dateDebut).getFullYear()} - ${new Date(experience.dateFin).getFullYear()}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{experience.entreprise || 'Entreprise à définir'}</p>
                  {experience.description && (
                    <p className="text-xs text-gray-600">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4" style={{ color: customColors.secondary }}>Formation</h2>
              {formations.map((formation, index) => (
                <div key={formation.id} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{formation.diplome || 'Diplôme à définir'}</h3>
                    <span className="text-xs text-gray-400">
                      {formation.anneeDebut && formation.anneeFin 
                        ? `${formation.anneeDebut} - ${formation.anneeFin}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{formation.etablissement || 'Établissement à définir'}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide mb-4" style={{ color: customColors.secondary }}>Compétences</h2>
              <div className="flex flex-wrap gap-1">
                {competences.map((competence, index) => (
                  <span key={index} className="text-xs px-2 py-1 rounded" style={{ color: customColors.primary, border: `1px solid ${customColors.primary}` }}>
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'professional':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-gray-50 to-white`}>
            <div className="pb-4 mb-6" style={{ borderBottom: `4px solid ${customColors.primary}` }}>
              <h1 className="text-3xl font-bold mb-1" style={{ color: customColors.primary }}>
                {personalInfo.prenom && personalInfo.nom 
                  ? `${personalInfo.prenom} ${personalInfo.nom}`
                  : 'Votre nom et prénom'
                }
              </h1>
              <p className="text-xl text-gray-700 font-medium">{personalInfo.titrePoste || 'Titre du poste recherché'}</p>
              <p className="text-sm mt-2 text-gray-600">
                {personalInfo.email && personalInfo.telephone 
                  ? `${personalInfo.email} | ${personalInfo.telephone}`
                  : personalInfo.email || personalInfo.telephone || 'Email et téléphone'
                }
              </p>
            </div>
            
            {personalInfo.resume && (
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${customColors.primary}10`, borderLeft: `4px solid ${customColors.primary}` }}>
                <h2 className="text-lg font-bold mb-2" style={{ color: customColors.primary }}>Résumé professionnel</h2>
                <p className="text-sm leading-relaxed">{personalInfo.resume}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Expérience professionnelle</h2>
              {experiences.map((experience, index) => (
                <div key={experience.id} className="mb-4 p-3 bg-white rounded border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{experience.poste || 'Poste à définir'}</h3>
                    <span className="text-sm font-medium px-2 py-1 rounded" style={{ color: customColors.primary, backgroundColor: `${customColors.primary}20` }}>
                      {experience.dateDebut && experience.dateFin 
                        ? `${new Date(experience.dateDebut).getFullYear()} - ${new Date(experience.dateFin).getFullYear()}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="font-medium mb-2" style={{ color: customColors.primary }}>{experience.entreprise || 'Entreprise à définir'}</p>
                  {experience.description && (
                    <p className="text-sm leading-relaxed">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Formation</h2>
              {formations.map((formation, index) => (
                <div key={formation.id} className="mb-3 p-3 bg-white rounded border">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-800">{formation.diplome || 'Diplôme à définir'}</h3>
                    <span className="text-sm" style={{ color: customColors.primary }}>
                      {formation.anneeDebut && formation.anneeFin 
                        ? `${formation.anneeDebut} - ${formation.anneeFin}`
                        : 'Période à définir'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{formation.etablissement || 'Établissement à définir'}</p>
                </div>
              ))}
            </div>
            
            <div>
              <h2 className="text-xl font-bold pb-2 mb-4" style={{ color: customColors.primary, borderBottom: `2px solid ${customColors.primary}` }}>Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {competences.map((competence, index) => (
                  <span key={index} className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${customColors.primary}20`, color: customColors.primary }}>
                    {competence}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Générateur de CV optimisé par IA</h1>
        
        {/* Stepper - Version desktop */}
        <div className="hidden md:block mb-10">
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

        {/* Stepper - Version mobile */}
        <div className="md:hidden mb-8">
          <div className="flex justify-center items-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeStep >= step ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {step}
                </div>
                <div className={`w-1 h-1 rounded-full ${activeStep >= step ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-cyan-400 font-medium">
              {activeStep === 1 && 'Informations personnelles'}
              {activeStep === 2 && 'Expérience professionnelle'}
              {activeStep === 3 && 'Compétences & Formation'}
              {activeStep === 4 && 'Finalisation'}
            </span>
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
                  <input 
                    type="text" 
                    value={personalInfo.nom}
                    onChange={(e) => updatePersonalInfo('nom', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    value={personalInfo.prenom}
                    onChange={(e) => updatePersonalInfo('prenom', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    value={personalInfo.telephone}
                    onChange={(e) => updatePersonalInfo('telephone', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Titre du poste recherché</label>
                  <input 
                    type="text" 
                    value={personalInfo.titrePoste}
                    onChange={(e) => updatePersonalInfo('titrePoste', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Résumé professionnel</label>
                  <textarea 
                    rows={4} 
                    value={personalInfo.resume}
                    onChange={(e) => updatePersonalInfo('resume', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Décrivez votre profil professionnel..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}
          
          {activeStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-cyan-300 mb-6">Expérience professionnelle</h2>
              
              {experiences.map((experience, index) => (
                <div key={experience.id} className="mb-8 p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Expérience #{index + 1}</h3>
                    {experiences.length > 1 && (
                      <button 
                        onClick={() => removeExperience(experience.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Poste</label>
                      <input 
                        type="text" 
                        value={experience.poste}
                        onChange={(e) => updateExperience(experience.id, 'poste', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Entreprise</label>
                      <input 
                        type="text" 
                        value={experience.entreprise}
                        onChange={(e) => updateExperience(experience.id, 'entreprise', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date de début</label>
                      <input 
                        type="date" 
                        value={experience.dateDebut}
                        onChange={(e) => updateExperience(experience.id, 'dateDebut', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date de fin</label>
                      <input 
                        type="date" 
                        value={experience.dateFin}
                        onChange={(e) => updateExperience(experience.id, 'dateFin', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea 
                        rows={3} 
                        value={experience.description}
                        onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                        className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Décrivez vos responsabilités et réalisations..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center">
                <button 
                  onClick={addExperience}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center"
                >
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
              
              {/* Section Compétences */}
              <div className="mb-8">
                <label className="block text-lg font-medium text-white mb-4">Compétences</label>
                
                {/* Liste des compétences existantes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {competences.map((competence, index) => (
                    <div key={index} className="flex items-center bg-gray-700 px-3 py-2 rounded-md">
                      <span className="flex-1 text-gray-300">{competence}</span>
                      <button 
                        onClick={() => removeCompetence(competence)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Ajout de nouvelle compétence */}
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Ajouter une compétence" 
                    value={nouvelleCompetence}
                    onChange={(e) => setNouvelleCompetence(e.target.value)}
                    onKeyPress={handleCompetenceKeyPress}
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                  />
                  <button 
                    onClick={addCompetence}
                    disabled={!nouvelleCompetence.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-r-md font-medium transition duration-200"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
              
              {/* Section Formations */}
              <div className="mt-8">
                <label className="block text-lg font-medium text-white mb-4">Formation</label>
                
                {formations.map((formation, index) => (
                  <div key={formation.id} className="mb-6 p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-white">Formation #{index + 1}</h3>
                      {formations.length > 1 && (
                        <button 
                          onClick={() => removeFormation(formation.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Diplôme</label>
                        <input 
                          type="text" 
                          value={formation.diplome}
                          onChange={(e) => updateFormation(formation.id, 'diplome', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Établissement</label>
                        <input 
                          type="text" 
                          value={formation.etablissement}
                          onChange={(e) => updateFormation(formation.id, 'etablissement', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Année de début</label>
                        <input 
                          type="number" 
                          value={formation.anneeDebut}
                          onChange={(e) => updateFormation(formation.id, 'anneeDebut', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Année de fin</label>
                        <input 
                          type="number" 
                          value={formation.anneeFin}
                          onChange={(e) => updateFormation(formation.id, 'anneeFin', e.target.value)}
                          className="w-full bg-gray-600 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center">
                  <button 
                    onClick={addFormation}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center"
                  >
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
              
              {/* Sélection du modèle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Modèle de CV</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setSelectedModel('modern')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedModel === 'modern' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-2" style={{ backgroundColor: customColors.primary }}></div>
                      <span className="text-sm text-gray-300">Moderne</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel('classic')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedModel === 'classic' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-500 rounded mx-auto mb-2"></div>
                      <span className="text-sm text-gray-300">Classique</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel('minimal')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedModel === 'minimal' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                      <span className="text-sm text-gray-300">Minimaliste</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel('professional')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedModel === 'professional' 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2"></div>
                      <span className="text-sm text-gray-300">Professionnel</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Personnalisation des couleurs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Personnalisation des couleurs</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur principale</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => updateCustomColor('primary', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">{customColors.primary}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur secondaire</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => updateCustomColor('secondary', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">{customColors.secondary}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Couleur d'accent</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => updateCustomColor('accent', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-300">{customColors.accent}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Aperçu du CV */}
              <div className="p-4 bg-gray-700 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Aperçu du CV</h3>
                <div className="overflow-y-auto" ref={cvPreviewRef}>
                  {renderCVContent()}
                </div>
              </div>
              
              {/* Téléchargement */}
              <div className="flex justify-center">
                <button 
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className={`px-6 py-3 rounded-md font-semibold text-lg transition duration-200 flex items-center ${
                    isGeneratingPDF 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Génération en cours...
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