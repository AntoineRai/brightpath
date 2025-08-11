import { Application, ApplicationStats } from '../types';

const STORAGE_KEY = 'brightpath_applications';

// Generate a unique ID without external dependencies
const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
};

// Helper function to get all applications from localStorage
const getApplications = (): Application[] => {
  const storedApplications = localStorage.getItem(STORAGE_KEY);
  return storedApplications ? JSON.parse(storedApplications) : [];
};

// Helper function to save applications to localStorage
const saveApplications = (applications: Application[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};

// Add a new application
export const addApplication = (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Application => {
  const applications = getApplications();
  
  const newApplication: Application = {
    ...application,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  saveApplications(applications);
  
  return newApplication;
};

// Get all applications
export const getAllApplications = (): Application[] => {
  return getApplications();
};

// Get application by id
export const getApplicationById = (id: string): Application | undefined => {
  const applications = getApplications();
  return applications.find(app => app.id === id);
};

// Update an application
export const updateApplication = (id: string, updatedData: Partial<Application>): Application | null => {
  const applications = getApplications();
  const index = applications.findIndex(app => app.id === id);
  
  if (index === -1) return null;
  
  applications[index] = {
    ...applications[index],
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  saveApplications(applications);
  return applications[index];
};

// Delete an application
export const deleteApplication = (id: string): boolean => {
  const applications = getApplications();
  const filteredApplications = applications.filter(app => app.id !== id);
  
  if (filteredApplications.length === applications.length) {
    return false;
  }
  
  saveApplications(filteredApplications);
  return true;
};

// Get application statistics
export const getApplicationStats = (): ApplicationStats => {
  const applications = getApplications();
  
  return {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    interview: applications.filter(app => app.status === 'interview').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    accepted: applications.filter(app => app.status === 'accepted').length
  };
}; 