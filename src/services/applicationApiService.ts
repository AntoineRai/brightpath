import { Application, ApplicationStats } from '../types';
import { getApiUrl, isDevelopment, shouldUseMock } from '../config/environment';

// Configuration de l'API
const API_BASE_URL = getApiUrl();

// Types pour les paramètres de requête
export interface ApplicationFilters {
  status?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

// Classe pour gérer les appels API
class ApplicationApiService {
  // Récupérer le token d'authentification
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Gérer les erreurs de réponse
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Convertir les données de l'API (snake_case) vers le format frontend (camelCase)
  private convertApiDataToFrontend(apiData: any): Application {
    return {
      id: apiData.id,
      company: apiData.company,
      position: apiData.position,
      applicationDate: apiData.application_date || apiData.applicationDate,
      status: apiData.status,
      location: apiData.location,
      salary: apiData.salary,
      contactPerson: apiData.contact_person || apiData.contactPerson,
      contactEmail: apiData.contact_email || apiData.contactEmail,
      contactPhone: apiData.contact_phone || apiData.contactPhone,
      jobDescription: apiData.job_description || apiData.jobDescription,
      notes: apiData.notes,
      createdAt: apiData.created_at || apiData.createdAt,
      updatedAt: apiData.updated_at || apiData.updatedAt
    };
  }

  // Récupérer toutes les candidatures avec filtres
  async getApplications(filters: ApplicationFilters = {}): Promise<ApplicationsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDirection) params.append('orderDirection', filters.orderDirection);

      const url = `${API_BASE_URL}/applications${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const apiResponse = await this.handleResponse<ApplicationsResponse>(response);
      
      // Convertir les données de l'API vers le format frontend
      const convertedApplications = apiResponse.applications.map(app => this.convertApiDataToFrontend(app));
      
      return {
        ...apiResponse,
        applications: convertedApplications
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      
      // Mode développement : fallback avec données mock si l'API n'est pas disponible
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock pour les candidatures');
        return this.mockGetApplications(filters);
      }
      
      throw error;
    }
  }

  // Récupérer une candidature spécifique
  async getApplicationById(id: string): Promise<Application> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const responseData = await this.handleResponse<Application>(response);
      return this.convertApiDataToFrontend(responseData);
    } catch (error) {
      console.error('Erreur lors de la récupération de la candidature:', error);
      
      // Mode développement : fallback avec données mock
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock');
        return this.mockGetApplicationById(id);
      }
      
      throw error;
    }
  }

  // Créer une nouvelle candidature
  async createApplication(applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    try {
      // Nettoyer les données : supprimer les champs vides et formater la date
      const cleanedData = Object.fromEntries(
        Object.entries(applicationData).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      // S'assurer que la date est au bon format
      if (cleanedData.applicationDate) {
        const date = new Date(cleanedData.applicationDate);
        if (isNaN(date.getTime())) {
          throw new Error('Date de candidature invalide');
        }
        cleanedData.applicationDate = date.toISOString().split('T')[0];
      }
      
      // Convertir les noms de champs en snake_case pour l'API backend
      const apiData: Record<string, any> = {
        company: cleanedData.company,
        position: cleanedData.position,
        application_date: cleanedData.applicationDate,
        status: cleanedData.status,
        location: cleanedData.location,
        salary: cleanedData.salary,
        contact_person: cleanedData.contactPerson,
        contact_email: cleanedData.contactEmail,
        contact_phone: cleanedData.contactPhone,
        job_description: cleanedData.jobDescription,
        notes: cleanedData.notes
      };
      
      // Supprimer les champs undefined
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === undefined) {
          delete apiData[key];
        }
      });
      
      // Log des données envoyées pour debug
      console.log('Données envoyées à l\'API:', apiData);
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur API:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const responseData = await this.handleResponse<Application>(response);
      return this.convertApiDataToFrontend(responseData);
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      
      // Mode développement : fallback avec données mock
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock');
        return this.mockCreateApplication(applicationData);
      }
      
      throw error;
    }
  }

  // Mettre à jour une candidature
  async updateApplication(id: string, applicationData: Partial<Application>): Promise<Application> {
    try {
      // Convertir les noms de champs en snake_case pour l'API backend
      const apiData: Record<string, any> = {};
      
      if (applicationData.company !== undefined) apiData.company = applicationData.company;
      if (applicationData.position !== undefined) apiData.position = applicationData.position;
      if (applicationData.applicationDate !== undefined) apiData.application_date = applicationData.applicationDate;
      if (applicationData.status !== undefined) apiData.status = applicationData.status;
      if (applicationData.location !== undefined) apiData.location = applicationData.location;
      if (applicationData.salary !== undefined) apiData.salary = applicationData.salary;
      if (applicationData.contactPerson !== undefined) apiData.contact_person = applicationData.contactPerson;
      if (applicationData.contactEmail !== undefined) apiData.contact_email = applicationData.contactEmail;
      if (applicationData.contactPhone !== undefined) apiData.contact_phone = applicationData.contactPhone;
      if (applicationData.jobDescription !== undefined) apiData.job_description = applicationData.jobDescription;
      if (applicationData.notes !== undefined) apiData.notes = applicationData.notes;
      
      // Log des données envoyées pour debug
      console.log('Données de mise à jour envoyées à l\'API:', apiData);
      
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur API mise à jour:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const responseData = await this.handleResponse<Application>(response);
      return this.convertApiDataToFrontend(responseData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la candidature:', error);
      
      // Mode développement : fallback avec données mock
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock');
        return this.mockUpdateApplication(id, applicationData);
      }
      
      throw error;
    }
  }

  // Supprimer une candidature
  async deleteApplication(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature:', error);
      
      // Mode développement : fallback avec données mock
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock');
        return this.mockDeleteApplication(id);
      }
      
      throw error;
    }
  }

  // Récupérer les statistiques
  async getApplicationStats(): Promise<ApplicationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse<ApplicationStats>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      
      // Mode développement : fallback avec données mock
      if (isDevelopment() && error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('API backend non disponible, utilisation du mode mock');
        return this.mockGetApplicationStats();
      }
      
      throw error;
    }
  }

  // ===== MODE MOCK POUR LE DÉVELOPPEMENT =====

  private async mockGetApplications(filters: ApplicationFilters = {}): Promise<ApplicationsResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockApplications: Application[] = [
      {
        id: '1',
        company: 'TechCorp',
        position: 'Développeur Full Stack',
        applicationDate: '2024-01-15',
        status: 'pending',
        location: 'Paris',
        salary: '45k-55k€',
        contactPerson: 'Marie Dupont',
        contactEmail: 'marie.dupont@techcorp.com',
        contactPhone: '01 23 45 67 89',
        jobDescription: 'Développement d\'applications web modernes',
        notes: 'Entretien prévu la semaine prochaine',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Lead Developer',
        applicationDate: '2024-01-10',
        status: 'interview',
        location: 'Lyon',
        salary: '60k-80k€',
        contactPerson: 'Jean Martin',
        contactEmail: 'jean.martin@startupxyz.com',
        contactPhone: '04 78 90 12 34',
        jobDescription: 'Encadrement d\'une équipe de développeurs',
        notes: 'Deuxième entretien programmé',
        createdAt: '2024-01-10T14:30:00Z',
        updatedAt: '2024-01-12T16:45:00Z'
      }
    ];

    // Appliquer les filtres
    let filteredApplications = mockApplications;
    if (filters.status) {
      filteredApplications = filteredApplications.filter(app => app.status === filters.status);
    }

    // Appliquer le tri
    if (filters.orderBy) {
      filteredApplications.sort((a, b) => {
        const aValue = a[filters.orderBy as keyof Application];
        const bValue = b[filters.orderBy as keyof Application];
        
        if (filters.orderDirection === 'desc') {
          return (bValue || '') > (aValue || '') ? 1 : -1;
        }
        return (aValue || '') > (bValue || '') ? 1 : -1;
      });
    }

    // Appliquer la pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 10;
    const paginatedApplications = filteredApplications.slice(offset, offset + limit);

    return {
      applications: paginatedApplications,
      total: filteredApplications.length,
      page: Math.floor(offset / limit) + 1,
      limit
    };
  }

  private async mockGetApplicationById(id: string): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockApplication: Application = {
      id,
      company: 'TechCorp',
      position: 'Développeur Full Stack',
      applicationDate: '2024-01-15',
      status: 'pending',
      location: 'Paris',
      salary: '45k-55k€',
      contactPerson: 'Marie Dupont',
      contactEmail: 'marie.dupont@techcorp.com',
      contactPhone: '01 23 45 67 89',
      jobDescription: 'Développement d\'applications web modernes',
      notes: 'Entretien prévu la semaine prochaine',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };

    return mockApplication;
  }

  private async mockCreateApplication(applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newApplication: Application = {
      ...applicationData,
      id: `mock-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newApplication;
  }

  private async mockUpdateApplication(id: string, applicationData: Partial<Application>): Promise<Application> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedApplication: Application = {
      id,
      company: 'TechCorp',
      position: 'Développeur Full Stack',
      applicationDate: '2024-01-15',
      status: 'pending',
      location: 'Paris',
      salary: '45k-55k€',
      contactPerson: 'Marie Dupont',
      contactEmail: 'marie.dupont@techcorp.com',
      contactPhone: '01 23 45 67 89',
      jobDescription: 'Développement d\'applications web modernes',
      notes: 'Entretien prévu la semaine prochaine',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString(),
      ...applicationData
    };

    return updatedApplication;
  }

  private async mockDeleteApplication(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }

  private async mockGetApplicationStats(): Promise<ApplicationStats> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      total: 5,
      pending: 2,
      interview: 1,
      rejected: 1,
      accepted: 1
    };
  }
}

// Instance singleton
const applicationApiService = new ApplicationApiService();
export default applicationApiService; 