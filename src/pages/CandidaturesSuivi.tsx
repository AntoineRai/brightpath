import React, { useState, useEffect } from 'react';
import { Application } from '../types';
import ApplicationsTable from '../components/ApplicationsTable';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationDetail from '../components/ApplicationDetail';
import ApplicationStats from '../components/ApplicationStats';

import applicationApiService from '../services/applicationApiService';

function CandidaturesSuivi() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculer les statistiques à partir des candidatures
  const calculateStats = (apps: Application[]) => {
    return {
      total: apps.length,
      pending: apps.filter(app => app.status === 'pending').length,
      interview: apps.filter(app => app.status === 'interview').length,
      rejected: apps.filter(app => app.status === 'rejected').length,
      accepted: apps.filter(app => app.status === 'accepted').length
    };
  };


  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  // Load applications from API
  const loadApplications = async () => {
    setLoading(true);
    setError('');
    
    try {
      const applicationsResponse = await applicationApiService.getApplications();
      setApplications(applicationsResponse.applications);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors du chargement des candidatures');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new application
  const handleAddApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError('');
    
    try {
      await applicationApiService.createApplication(applicationData);
      await loadApplications();
      setIsFormOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erreur lors de la création de la candidature');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update an existing application
  const handleUpdateApplication = async (applicationData: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedApplication) {
      setLoading(true);
      setError('');
      
      try {
        await applicationApiService.updateApplication(selectedApplication.id, applicationData);
        await loadApplications();
        setIsFormOpen(false);
        setIsEditMode(false);
        setSelectedApplication(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur lors de la mise à jour de la candidature');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // Delete an application
  const handleDeleteApplication = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      setLoading(true);
      setError('');
      
      try {
        await applicationApiService.deleteApplication(id);
        await loadApplications();
        
        if (selectedApplication && selectedApplication.id === id) {
          setSelectedApplication(null);
          setIsViewOpen(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur lors de la suppression de la candidature');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  // View application details
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsViewOpen(true);
  };

  // Open edit form
  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsEditMode(true);
    setIsFormOpen(true);
    setIsViewOpen(false);
  };

  // Close all modals and reset selection
  const handleCloseAll = () => {
    setIsFormOpen(false);
    setIsViewOpen(false);
    setIsEditMode(false);
    setSelectedApplication(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-8">Suivi des candidatures</h1>
        
        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {/* Main content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
          <div className="mb-8">
            <p className="text-gray-300 mb-4">
              Suivez vos candidatures en temps réel et ne manquez plus aucune opportunité. 
              Organisez votre recherche d'emploi de manière efficace.
            </p>
            
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => {
                  setIsFormOpen(true);
                  setIsEditMode(false);
                  setSelectedApplication(null);
                }}
                disabled={loading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  'Ajouter une candidature'
                )}
              </button>
            </div>
          </div>
          
          {/* Conditional rendering based on state */}
          {isFormOpen ? (
            <ApplicationForm 
              application={isEditMode ? selectedApplication || undefined : undefined}
              onSubmit={isEditMode ? handleUpdateApplication : handleAddApplication}
              onCancel={handleCloseAll}
            />
          ) : isViewOpen && selectedApplication ? (
            <ApplicationDetail 
              application={selectedApplication}
              onEdit={() => handleEditApplication(selectedApplication)}
              onDelete={() => handleDeleteApplication(selectedApplication.id)}
              onClose={handleCloseAll}
            />
          ) : (
            <>
              <ApplicationsTable 
                applications={applications}
                onView={handleViewApplication}
                onEdit={handleEditApplication}
                onDelete={handleDeleteApplication}
              />
              
              {/* Statistiques calculées côté frontend */}
              <div className="mt-8">
                <ApplicationStats stats={calculateStats(applications)} />
              </div>
            </>
          )}
        </div>
        

      </div>
    </div>
  );
}

export default CandidaturesSuivi; 