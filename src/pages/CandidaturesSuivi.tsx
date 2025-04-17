import React, { useState, useEffect } from 'react';
import { Application } from '../types';
import ApplicationsTable from '../components/ApplicationsTable';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationDetail from '../components/ApplicationDetail';
import ApplicationStats from '../components/ApplicationStats';
import { 
  addApplication, 
  getAllApplications, 
  updateApplication, 
  deleteApplication, 
  getApplicationStats 
} from '../services/applicationService';

function CandidaturesSuivi() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    rejected: 0,
    accepted: 0
  });

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  // Load applications from local storage
  const loadApplications = () => {
    const loadedApplications = getAllApplications();
    setApplications(loadedApplications);
    setStats(getApplicationStats());
  };

  // Add a new application
  const handleAddApplication = (applicationData: Omit<Application, 'id' | 'lastUpdated'>) => {
    addApplication(applicationData);
    loadApplications();
    setIsFormOpen(false);
  };

  // Update an existing application
  const handleUpdateApplication = (applicationData: Omit<Application, 'id' | 'lastUpdated'>) => {
    if (selectedApplication) {
      updateApplication(selectedApplication.id, applicationData);
      loadApplications();
      setIsFormOpen(false);
      setIsEditMode(false);
      setSelectedApplication(null);
    }
  };

  // Delete an application
  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      deleteApplication(id);
      loadApplications();
      
      if (selectedApplication && selectedApplication.id === id) {
        setSelectedApplication(null);
        setIsViewOpen(false);
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
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md font-medium transition duration-200"
              >
                Ajouter une candidature
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
            <ApplicationsTable 
              applications={applications}
              onView={handleViewApplication}
              onEdit={handleEditApplication}
              onDelete={handleDeleteApplication}
            />
          )}
        </div>
        
        {/* Statistics */}
        <div className="mt-8">
          <ApplicationStats stats={stats} />
        </div>
      </div>
    </div>
  );
}

export default CandidaturesSuivi; 