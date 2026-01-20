// Tests pour les utilitaires de génération PDF
// Note: Ces tests simulent les fonctions utilitaires qui pourraient être utilisées
// pour la génération de PDF dans le générateur de CV

describe('PDF Utils', () => {
  // Mock des fonctions PDF
  const mockPdf = {
    save: jest.fn(),
    addPage: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    setTextColor: jest.fn(),
    setFillColor: jest.fn(),
    rect: jest.fn(),
    setFont: jest.fn(),
    getTextWidth: jest.fn(() => 50),
    getTextDimensions: jest.fn(() => ({ w: 50, h: 10 })),
    setDrawColor: jest.fn(),
    setLineWidth: jest.fn(),
    line: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatage du texte', () => {
    test('formate correctement un texte long', () => {
      const longText = 'Ceci est un texte très long qui devrait être coupé en plusieurs lignes pour s\'adapter à la largeur de la page PDF. Il contient beaucoup de mots et de phrases qui nécessitent un formatage approprié.';
      
      // Simulation d'une fonction de formatage de texte
      const formatText = (text: string, maxWidth: number) => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (testLine.length * 5 > maxWidth) { // Estimation de la largeur
            if (currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              lines.push(word);
            }
          } else {
            currentLine = testLine;
          }
        });
        
        if (currentLine) {
          lines.push(currentLine);
        }
        
        return lines;
      };

      const result = formatText(longText, 200);
      
      expect(result.length).toBeGreaterThan(1);
      expect(result.every(line => line.length * 5 <= 200)).toBe(true);
    });

    test('gère les textes courts', () => {
      const shortText = 'Texte court';
      
      const formatText = (text: string, maxWidth: number) => {
        return text.length * 5 <= maxWidth ? [text] : [text];
      };

      const result = formatText(shortText, 200);
      
      expect(result).toEqual([shortText]);
    });

    test('gère les textes vides', () => {
      const emptyText = '';
      
      const formatText = (text: string, maxWidth: number) => {
        return text ? [text] : [];
      };

      const result = formatText(emptyText, 200);
      
      expect(result).toEqual([]);
    });
  });

  describe('calcul des positions', () => {
    test('calcule correctement la position Y pour les sections', () => {
      const calculateYPosition = (currentY: number, sectionHeight: number, margin: number = 10) => {
        return currentY + sectionHeight + margin;
      };

      const result1 = calculateYPosition(50, 30);
      expect(result1).toBe(90);

      const result2 = calculateYPosition(100, 25, 15);
      expect(result2).toBe(140);
    });

    test('gère les marges de page', () => {
      const checkPageBreak = (currentY: number, contentHeight: number, pageHeight: number = 297) => {
        const margin = 20;
        return currentY + contentHeight > pageHeight - margin;
      };

      expect(checkPageBreak(250, 60)).toBe(true);
      expect(checkPageBreak(200, 60)).toBe(false);
    });
  });

  describe('formatage des dates', () => {
    test('formate correctement les dates françaises', () => {
      const formatDate = (dateString: string) => {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Date invalide';
          
          return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch {
          return 'Date invalide';
        }
      };

      expect(formatDate('2024-01-15')).toBe('15 janvier 2024');
      expect(formatDate('')).toBe('');
      expect(formatDate('date-invalide')).toBe('Date invalide');
    });

    test('formate les périodes de dates', () => {
      const formatDateRange = (startDate: string, endDate: string) => {
        if (!startDate) return '';
        
        const start = new Date(startDate);
        const startFormatted = start.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short'
        });
        
        if (!endDate) {
          return `${startFormatted} - Présent`;
        }
        
        const end = new Date(endDate);
        const endFormatted = end.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'short'
        });
        
        return `${startFormatted} - ${endFormatted}`;
      };

      expect(formatDateRange('2020-01-01', '2024-01-01')).toBe('1 janv. 2020 - 1 janv. 2024');
      expect(formatDateRange('2020-01-01', '')).toBe('1 janv. 2020 - Présent');
      expect(formatDateRange('', '2024-01-01')).toBe('');
    });
  });

  describe('gestion des couleurs', () => {
    test('valide les codes couleur hexadécimaux', () => {
      const isValidHexColor = (color: string) => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
      };

      expect(isValidHexColor('#06b6d4')).toBe(true);
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#000')).toBe(true);
      expect(isValidHexColor('invalid')).toBe(false);
      expect(isValidHexColor('#gggggg')).toBe(false);
    });

    test('convertit les couleurs hex en RGB', () => {
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      expect(hexToRgb('#06b6d4')).toEqual({ r: 6, g: 182, b: 212 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('invalid')).toBeNull();
    });
  });

  describe('gestion des modèles de CV', () => {
    test('valide les modèles de CV disponibles', () => {
      const validModels = ['modern', 'classic', 'minimal', 'professional'];
      
      const isValidModel = (model: string) => {
        return validModels.includes(model);
      };

      expect(isValidModel('modern')).toBe(true);
      expect(isValidModel('classic')).toBe(true);
      expect(isValidModel('minimal')).toBe(true);
      expect(isValidModel('professional')).toBe(true);
      expect(isValidModel('invalid')).toBe(false);
    });

    test('retourne les paramètres par défaut pour chaque modèle', () => {
      const getModelDefaults = (model: string) => {
        const defaults = {
          modern: {
            primaryColor: '#06b6d4',
            secondaryColor: '#64748b',
            accentColor: '#0891b2',
            fontSize: 12,
            lineHeight: 1.5
          },
          classic: {
            primaryColor: '#1f2937',
            secondaryColor: '#6b7280',
            accentColor: '#374151',
            fontSize: 11,
            lineHeight: 1.4
          },
          minimal: {
            primaryColor: '#000000',
            secondaryColor: '#666666',
            accentColor: '#333333',
            fontSize: 10,
            lineHeight: 1.3
          },
          professional: {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            accentColor: '#1d4ed8',
            fontSize: 11,
            lineHeight: 1.4
          }
        };
        
        return defaults[model as keyof typeof defaults] || defaults.modern;
      };

      expect(getModelDefaults('modern')).toEqual({
        primaryColor: '#06b6d4',
        secondaryColor: '#64748b',
        accentColor: '#0891b2',
        fontSize: 12,
        lineHeight: 1.5
      });

      expect(getModelDefaults('invalid')).toEqual({
        primaryColor: '#06b6d4',
        secondaryColor: '#64748b',
        accentColor: '#0891b2',
        fontSize: 12,
        lineHeight: 1.5
      });
    });
  });

  describe('validation des données', () => {
    test('valide les informations personnelles', () => {
      const validatePersonalInfo = (info: any) => {
        const errors: string[] = [];
        
        if (!info.prenom?.trim()) errors.push('Prénom requis');
        if (!info.nom?.trim()) errors.push('Nom requis');
        if (!info.email?.trim()) errors.push('Email requis');
        if (!info.telephone?.trim()) errors.push('Téléphone requis');
        if (!info.titrePoste?.trim()) errors.push('Titre du poste requis');
        
        // Validation email basique
        if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
          errors.push('Email invalide');
        }
        
        return errors;
      };

      const validInfo = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean@test.com',
        telephone: '0123456789',
        titrePoste: 'Développeur'
      };

      const invalidInfo = {
        prenom: '',
        nom: 'Dupont',
        email: 'invalid-email',
        telephone: '',
        titrePoste: 'Développeur'
      };

      expect(validatePersonalInfo(validInfo)).toEqual([]);
      expect(validatePersonalInfo(invalidInfo)).toContain('Prénom requis');
      expect(validatePersonalInfo(invalidInfo)).toContain('Téléphone requis');
      expect(validatePersonalInfo(invalidInfo)).toContain('Email invalide');
    });

    test('valide les expériences professionnelles', () => {
      const validateExperience = (experience: any) => {
        const errors: string[] = [];
        
        if (!experience.poste?.trim()) errors.push('Poste requis');
        if (!experience.entreprise?.trim()) errors.push('Entreprise requise');
        if (!experience.dateDebut?.trim()) errors.push('Date de début requise');
        if (!experience.description?.trim()) errors.push('Description requise');
        
        // Validation des dates
        if (experience.dateDebut && experience.dateFin) {
          const startDate = new Date(experience.dateDebut);
          const endDate = new Date(experience.dateFin);
          
          if (startDate > endDate) {
            errors.push('La date de fin doit être postérieure à la date de début');
          }
        }
        
        return errors;
      };

      const validExperience = {
        poste: 'Développeur',
        entreprise: 'TechCorp',
        dateDebut: '2020-01-01',
        dateFin: '2024-01-01',
        description: 'Description de l\'expérience'
      };

      const invalidExperience = {
        poste: '',
        entreprise: 'TechCorp',
        dateDebut: '2024-01-01',
        dateFin: '2020-01-01',
        description: ''
      };

      expect(validateExperience(validExperience)).toEqual([]);
      expect(validateExperience(invalidExperience)).toContain('Poste requis');
      expect(validateExperience(invalidExperience)).toContain('Description requise');
      expect(validateExperience(invalidExperience)).toContain('La date de fin doit être postérieure à la date de début');
    });
  });

  describe('gestion des erreurs PDF', () => {
    test('gère les erreurs de génération PDF', () => {
      const handlePdfError = (error: Error) => {
        const errorMessages = {
          'CANVAS_ERROR': 'Erreur lors de la génération de l\'aperçu',
          'PDF_GENERATION_ERROR': 'Erreur lors de la génération du PDF',
          'DOWNLOAD_ERROR': 'Erreur lors du téléchargement',
          'DEFAULT': 'Une erreur inattendue s\'est produite'
        };
        
        return errorMessages[error.message as keyof typeof errorMessages] || errorMessages.DEFAULT;
      };

      expect(handlePdfError(new Error('CANVAS_ERROR'))).toBe('Erreur lors de la génération de l\'aperçu');
      expect(handlePdfError(new Error('PDF_GENERATION_ERROR'))).toBe('Erreur lors de la génération du PDF');
      expect(handlePdfError(new Error('DOWNLOAD_ERROR'))).toBe('Erreur lors du téléchargement');
      expect(handlePdfError(new Error('UNKNOWN_ERROR'))).toBe('Une erreur inattendue s\'est produite');
    });
  });
});
