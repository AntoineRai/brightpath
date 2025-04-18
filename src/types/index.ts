export type ApplicationStatus = 'pending' | 'interview' | 'rejected' | 'accepted';

export interface Application {
  id: string;
  company: string;
  position: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  salary?: string;
  jobDescription?: string;
  lastUpdated: string;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  interview: number;
  rejected: number;
  accepted: number;
} 