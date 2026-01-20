// Tests pour les utilitaires de génération PDF des lettres de motivation
// Note: Ces tests simulent les fonctions utilitaires utilisées pour la génération de PDF

describe('PDF Utils - Lettres de Motivation', () => {
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

  describe('formatage de la lettre', () => {
    test('formate correctement l\'en-tête de la lettre', () => {
      const formatHeader = (personalInfo: any) => {
        const lines = [];
        lines.push(`${personalInfo.prenom} ${personalInfo.nom}`);
        lines.push(personalInfo.adresse);
        lines.push(personalInfo.telephone);
        lines.push(personalInfo.email);
        return lines.join('\n');
      };

      const personalInfo = {
        prenom: 'Jean',
        nom: 'Dupont',
        adresse: '123 Rue de Paris, 75001 Paris',
        telephone: '01 23 45 67 89',
        email: 'jean.dupont@email.com'
      };

      const result = formatHeader(personalInfo);

      expect(result).toContain('Jean Dupont');
      expect(result).toContain('123 Rue de Paris, 75001 Paris');
      expect(result).toContain('01 23 45 67 89');
      expect(result).toContain('jean.dupont@email.com');
    });

    test('formate correctement la date', () => {
      const formatDate = () => {
        return new Date().toLocaleDateString('fr-FR');
      };

      const result = formatDate();
      const expectedFormat = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      expect(result).toMatch(expectedFormat);
    });

    test('formate correctement l\'adresse de l\'entreprise', () => {
      const formatCompanyAddress = (companyInfo: any) => {
        const lines = [];
        if (companyInfo.destinataire) {
          lines.push(`À l'attention de ${companyInfo.destinataire}`);
        }
        lines.push(companyInfo.entreprise);
        return lines.join('\n');
      };

      const companyInfo = {
        entreprise: 'TechCorp',
        destinataire: 'M. Martin'
      };

      const result = formatCompanyAddress(companyInfo);

      expect(result).toContain('À l\'attention de M. Martin');
      expect(result).toContain('TechCorp');
    });

    test('gère l\'absence de destinataire', () => {
      const formatCompanyAddress = (companyInfo: any) => {
        const lines = [];
        if (companyInfo.destinataire) {
          lines.push(`À l'attention de ${companyInfo.destinataire}`);
        }
        lines.push(companyInfo.entreprise);
        return lines.join('\n');
      };

      const companyInfo = {
        entreprise: 'TechCorp'
      };

      const result = formatCompanyAddress(companyInfo);

      expect(result).toBe('TechCorp');
      expect(result).not.toContain('À l\'attention de');
    });
  });

  describe('formatage du contenu', () => {
    test('formate correctement un texte long', () => {
      const formatContent = (content: string, maxWidth: number = 80) => {
        const words = content.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (testLine.length > maxWidth) {
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

      const longContent = 'Ceci est un texte très long qui devrait être coupé en plusieurs lignes pour s\'adapter à la largeur de la page. Il contient beaucoup de mots et nécessite un formatage approprié.';

      const result = formatContent(longContent, 50);

      expect(result.length).toBeGreaterThan(1);
      expect(result.every(line => line.length <= 50)).toBe(true);
    });

    test('gère les paragraphes multiples', () => {
      const formatParagraphs = (content: string) => {
        return content.split('\n\n').map(paragraph => paragraph.trim());
      };

      const content = 'Premier paragraphe.\n\nDeuxième paragraphe.\n\nTroisième paragraphe.';

      const result = formatParagraphs(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('Premier paragraphe.');
      expect(result[1]).toBe('Deuxième paragraphe.');
      expect(result[2]).toBe('Troisième paragraphe.');
    });

    test('gère les sauts de ligne simples', () => {
      const formatLineBreaks = (content: string) => {
        return content.split('\n').map(line => line.trim());
      };

      const content = 'Ligne 1\nLigne 2\nLigne 3';

      const result = formatLineBreaks(content);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('Ligne 1');
      expect(result[1]).toBe('Ligne 2');
      expect(result[2]).toBe('Ligne 3');
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

    test('gère les marges de page pour les lettres', () => {
      const checkPageBreak = (currentY: number, contentHeight: number, pageHeight: number = 297) => {
        const margin = 20;
        return currentY + contentHeight > pageHeight - margin;
      };

      expect(checkPageBreak(250, 60)).toBe(true);
      expect(checkPageBreak(200, 60)).toBe(false);
    });

    test('calcule la hauteur du contenu', () => {
      const calculateContentHeight = (lines: string[], lineHeight: number = 12) => {
        return lines.length * lineHeight;
      };

      const lines = ['Ligne 1', 'Ligne 2', 'Ligne 3', 'Ligne 4'];
      const result = calculateContentHeight(lines);

      expect(result).toBe(48); // 4 lignes * 12px
    });
  });

  describe('formatage des données personnelles', () => {
    test('valide les informations personnelles', () => {
      const validatePersonalInfo = (info: any) => {
        const errors: string[] = [];
        
        if (!info.prenom?.trim()) errors.push('Prénom requis');
        if (!info.nom?.trim()) errors.push('Nom requis');
        if (!info.email?.trim()) errors.push('Email requis');
        if (!info.telephone?.trim()) errors.push('Téléphone requis');
        if (!info.adresse?.trim()) errors.push('Adresse requise');
        
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
        adresse: '123 Rue de Paris'
      };

      const invalidInfo = {
        prenom: '',
        nom: 'Dupont',
        email: 'invalid-email',
        telephone: '',
        adresse: '123 Rue de Paris'
      };

      expect(validatePersonalInfo(validInfo)).toEqual([]);
      expect(validatePersonalInfo(invalidInfo)).toContain('Prénom requis');
      expect(validatePersonalInfo(invalidInfo)).toContain('Téléphone requis');
      expect(validatePersonalInfo(invalidInfo)).toContain('Email invalide');
    });

    test('valide les informations de l\'entreprise', () => {
      const validateCompanyInfo = (info: any) => {
        const errors: string[] = [];
        
        if (!info.entreprise?.trim()) errors.push('Nom de l\'entreprise requis');
        if (!info.poste?.trim()) errors.push('Poste convoité requis');
        
        return errors;
      };

      const validInfo = {
        entreprise: 'TechCorp',
        poste: 'Développeur Frontend',
        destinataire: 'M. Martin'
      };

      const invalidInfo = {
        entreprise: '',
        poste: 'Développeur Frontend'
      };

      expect(validateCompanyInfo(validInfo)).toEqual([]);
      expect(validateCompanyInfo(invalidInfo)).toContain('Nom de l\'entreprise requis');
    });
  });

  describe('génération du nom de fichier', () => {
    test('génère un nom de fichier valide', () => {
      const generateFileName = (personalInfo: any, companyInfo: any) => {
        const sanitizeString = (str: string) => {
          return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        };

        const firstName = sanitizeString(personalInfo.prenom);
        const lastName = sanitizeString(personalInfo.nom);
        const company = sanitizeString(companyInfo.entreprise);

        return `lettre_motivation_${firstName}_${lastName}_${company}.pdf`;
      };

      const personalInfo = {
        prenom: 'Jean-Pierre',
        nom: 'Dupont-Martin'
      };

      const companyInfo = {
        entreprise: 'Tech Corp & Co.'
      };

      const result = generateFileName(personalInfo, companyInfo);

      expect(result).toBe('lettre_motivation_jean_pierre_dupont_martin_tech_corp_co.pdf');
    });

    test('gère les caractères spéciaux', () => {
      const sanitizeString = (str: string) => {
        return str.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      };

      expect(sanitizeString('Jean & Marie')).toBe('jean_marie');
      expect(sanitizeString('Tech@Corp')).toBe('tech_corp');
      expect(sanitizeString('Développeur')).toBe('d_veloppeur');
    });
  });

  describe('formatage du contenu complet', () => {
    test('assemble correctement tous les éléments de la lettre', () => {
      const assembleLetter = (personalInfo: any, companyInfo: any, content: string) => {
        const currentDate = new Date().toLocaleDateString('fr-FR');
        
        const header = `${personalInfo.prenom} ${personalInfo.nom}
${personalInfo.adresse}
${personalInfo.telephone}
${personalInfo.email}`;

        const dateSection = currentDate;

        const companySection = companyInfo.destinataire 
          ? `À l'attention de ${companyInfo.destinataire}
${companyInfo.entreprise}`
          : companyInfo.entreprise;

        return `${header}

${dateSection}

${companySection}

${content}`;
      };

      const personalInfo = {
        prenom: 'Jean',
        nom: 'Dupont',
        adresse: '123 Rue de Paris',
        telephone: '01 23 45 67 89',
        email: 'jean@test.com'
      };

      const companyInfo = {
        entreprise: 'TechCorp',
        destinataire: 'M. Martin'
      };

      const content = 'Madame, Monsieur,\n\nC\'est avec un vif intérêt...';

      const result = assembleLetter(personalInfo, companyInfo, content);

      expect(result).toContain('Jean Dupont');
      expect(result).toContain('123 Rue de Paris');
      expect(result).toContain('01 23 45 67 89');
      expect(result).toContain('jean@test.com');
      expect(result).toContain('À l\'attention de M. Martin');
      expect(result).toContain('TechCorp');
      expect(result).toContain('Madame, Monsieur');
    });

    test('gère l\'absence de destinataire', () => {
      const assembleLetter = (personalInfo: any, companyInfo: any, content: string) => {
        const currentDate = new Date().toLocaleDateString('fr-FR');
        
        const header = `${personalInfo.prenom} ${personalInfo.nom}
${personalInfo.adresse}
${personalInfo.telephone}
${personalInfo.email}`;

        const dateSection = currentDate;

        const companySection = companyInfo.destinataire 
          ? `À l'attention de ${companyInfo.destinataire}
${companyInfo.entreprise}`
          : companyInfo.entreprise;

        return `${header}

${dateSection}

${companySection}

${content}`;
      };

      const personalInfo = {
        prenom: 'Jean',
        nom: 'Dupont',
        adresse: '123 Rue de Paris',
        telephone: '01 23 45 67 89',
        email: 'jean@test.com'
      };

      const companyInfo = {
        entreprise: 'TechCorp'
      };

      const content = 'Madame, Monsieur,\n\nC\'est avec un vif intérêt...';

      const result = assembleLetter(personalInfo, companyInfo, content);

      expect(result).toContain('TechCorp');
      expect(result).not.toContain('À l\'attention de');
    });
  });

  describe('gestion des erreurs PDF', () => {
    test('gère les erreurs de génération PDF', () => {
      const handlePdfError = (error: Error) => {
        const errorMessages = {
          'CANVAS_ERROR': 'Erreur lors de la génération de l\'aperçu',
          'PDF_GENERATION_ERROR': 'Erreur lors de la génération du PDF',
          'DOWNLOAD_ERROR': 'Erreur lors du téléchargement',
          'CONTENT_ERROR': 'Erreur: aucun contenu à générer',
          'DEFAULT': 'Une erreur inattendue s\'est produite'
        };
        
        return errorMessages[error.message as keyof typeof errorMessages] || errorMessages.DEFAULT;
      };

      expect(handlePdfError(new Error('CANVAS_ERROR'))).toBe('Erreur lors de la génération de l\'aperçu');
      expect(handlePdfError(new Error('PDF_GENERATION_ERROR'))).toBe('Erreur lors de la génération du PDF');
      expect(handlePdfError(new Error('DOWNLOAD_ERROR'))).toBe('Erreur lors du téléchargement');
      expect(handlePdfError(new Error('CONTENT_ERROR'))).toBe('Erreur: aucun contenu à générer');
      expect(handlePdfError(new Error('UNKNOWN_ERROR'))).toBe('Une erreur inattendue s\'est produite');
    });

    test('valide la présence de contenu avant génération', () => {
      const validateContent = (content: string) => {
        if (!content || !content.trim()) {
          throw new Error('CONTENT_ERROR');
        }
        return true;
      };

      expect(() => validateContent('')).toThrow('CONTENT_ERROR');
      expect(() => validateContent('   ')).toThrow('CONTENT_ERROR');
      expect(validateContent('Contenu valide')).toBe(true);
    });
  });
});
