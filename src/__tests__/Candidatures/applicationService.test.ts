import {
  addApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationStats
} from '../../services/applicationService';
import { Application } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock data pour les tests
const mockApplicationData = {
  company: 'TechCorp',
  position: 'Développeur Frontend',
  applicationDate: '2024-01-15',
  status: 'pending' as const,
  notes: 'Candidature envoyée via LinkedIn',
  contactPerson: 'Jean Dupont',
  contactEmail: 'jean.dupont@techcorp.com',
  contactPhone: '01 23 45 67 89',
  location: 'Paris',
  salary: '45000€',
  jobDescription: 'Développement d\'applications React/TypeScript'
};

const mockApplications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Développeur Frontend',
    applicationDate: '2024-01-15',
    status: 'pending',
    notes: 'Candidature envoyée via LinkedIn',
    contactPerson: 'Jean Dupont',
    contactEmail: 'jean.dupont@techcorp.com',
    contactPhone: '01 23 45 67 89',
    location: 'Paris',
    salary: '45000€',
    jobDescription: 'Développement d\'applications React/TypeScript',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Développeur Full Stack',
    applicationDate: '2024-01-20',
    status: 'interview',
    notes: 'Entretien prévu la semaine prochaine',
    contactPerson: 'Marie Martin',
    contactEmail: 'marie.martin@startupxyz.com',
    contactPhone: '01 98 76 54 32',
    location: 'Lyon',
    salary: '50000€',
    jobDescription: 'Développement full stack avec React et Node.js',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

describe('applicationService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('addApplication', () => {
    test('ajoute une nouvelle candidature avec un ID unique et des timestamps', () => {
      const result = addApplication(mockApplicationData);

      expect(result).toMatchObject({
        ...mockApplicationData,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      expect(result.id).toMatch(/^\d+[a-z0-9]+-[a-z0-9]+$/);
      expect(new Date(result.createdAt).getTime()).toBeGreaterThan(0);
      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(0);
    });

    test('sauvegarde la candidature dans localStorage', () => {
      addApplication(mockApplicationData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'brightpath_applications',
        expect.any(String)
      );

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toMatchObject(mockApplicationData);
    });

    test('génère des IDs uniques pour chaque candidature', () => {
      const result1 = addApplication(mockApplicationData);
      const result2 = addApplication({ ...mockApplicationData, company: 'Autre Entreprise' });

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('getAllApplications', () => {
    test('retourne un tableau vide quand localStorage est vide', () => {
      const result = getAllApplications();

      expect(result).toEqual([]);
    });

    test('retourne toutes les candidatures depuis localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = getAllApplications();

      expect(result).toEqual(mockApplications);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('brightpath_applications');
    });

    test('retourne un tableau vide si localStorage contient des données invalides', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const result = getAllApplications();

      expect(result).toEqual([]);
    });
  });

  describe('getApplicationById', () => {
    test('retourne la candidature avec l\'ID spécifié', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = getApplicationById('1');

      expect(result).toEqual(mockApplications[0]);
    });

    test('retourne undefined si l\'ID n\'existe pas', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = getApplicationById('999');

      expect(result).toBeUndefined();
    });

    test('retourne undefined si localStorage est vide', () => {
      const result = getApplicationById('1');

      expect(result).toBeUndefined();
    });
  });

  describe('updateApplication', () => {
    test('met à jour une candidature existante', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const updateData = {
        status: 'interview' as const,
        notes: 'Nouvelles notes'
      };

      const result = updateApplication('1', updateData);

      expect(result).toMatchObject({
        ...mockApplications[0],
        ...updateData,
        updatedAt: expect.any(String)
      });

      expect(new Date(result!.updatedAt).getTime()).toBeGreaterThan(
        new Date(mockApplications[0].updatedAt).getTime()
      );
    });

    test('sauvegarde les modifications dans localStorage', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      updateApplication('1', { status: 'interview' });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'brightpath_applications',
        expect.any(String)
      );

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData[0].status).toBe('interview');
    });

    test('retourne null si l\'ID n\'existe pas', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = updateApplication('999', { status: 'interview' });

      expect(result).toBeNull();
    });

    test('retourne null si localStorage est vide', () => {
      const result = updateApplication('1', { status: 'interview' });

      expect(result).toBeNull();
    });
  });

  describe('deleteApplication', () => {
    test('supprime une candidature existante', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = deleteApplication('1');

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'brightpath_applications',
        JSON.stringify([mockApplications[1]])
      );
    });

    test('retourne false si l\'ID n\'existe pas', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = deleteApplication('999');

      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('retourne false si localStorage est vide', () => {
      const result = deleteApplication('1');

      expect(result).toBe(false);
    });
  });

  describe('getApplicationStats', () => {
    test('calcule correctement les statistiques', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockApplications));

      const result = getApplicationStats();

      expect(result).toEqual({
        total: 2,
        pending: 1,
        interview: 1,
        rejected: 0,
        accepted: 0
      });
    });

    test('retourne des statistiques vides quand il n\'y a pas de candidatures', () => {
      const result = getApplicationStats();

      expect(result).toEqual({
        total: 0,
        pending: 0,
        interview: 0,
        rejected: 0,
        accepted: 0
      });
    });

    test('calcule correctement les statistiques avec tous les statuts', () => {
      const allStatusApplications: Application[] = [
        { ...mockApplications[0], status: 'pending' },
        { ...mockApplications[1], status: 'interview' },
        { ...mockApplications[0], id: '3', status: 'rejected' },
        { ...mockApplications[1], id: '4', status: 'accepted' }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(allStatusApplications));

      const result = getApplicationStats();

      expect(result).toEqual({
        total: 4,
        pending: 1,
        interview: 1,
        rejected: 1,
        accepted: 1
      });
    });
  });

  describe('Intégration', () => {
    test('peut ajouter, récupérer, modifier et supprimer une candidature', () => {
      // Ajouter une candidature
      const added = addApplication(mockApplicationData);
      expect(added).toMatchObject(mockApplicationData);

      // Récupérer toutes les candidatures
      const all = getAllApplications();
      expect(all).toHaveLength(1);
      expect(all[0]).toEqual(added);

      // Récupérer par ID
      const byId = getApplicationById(added.id);
      expect(byId).toEqual(added);

      // Modifier la candidature
      const updated = updateApplication(added.id, { status: 'interview' });
      expect(updated!.status).toBe('interview');

      // Vérifier que la modification est persistée
      const allAfterUpdate = getAllApplications();
      expect(allAfterUpdate[0].status).toBe('interview');

      // Supprimer la candidature
      const deleted = deleteApplication(added.id);
      expect(deleted).toBe(true);

      // Vérifier que la suppression est persistée
      const allAfterDelete = getAllApplications();
      expect(allAfterDelete).toHaveLength(0);
    });

    test('génère des statistiques correctes après plusieurs opérations', () => {
      // Ajouter plusieurs candidatures
      addApplication({ ...mockApplicationData, status: 'pending' });
      addApplication({ ...mockApplicationData, company: 'StartupXYZ', status: 'interview' });
      addApplication({ ...mockApplicationData, company: 'BigCorp', status: 'rejected' });

      const stats = getApplicationStats();

      expect(stats).toEqual({
        total: 3,
        pending: 1,
        interview: 1,
        rejected: 1,
        accepted: 0
      });
    });
  });
});
