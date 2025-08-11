import React from 'react';
import { Application } from '../types';

interface ApplicationDetailProps {
  application: Application;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
  application,
  onEdit,
  onDelete,
  onClose
}) => {
  // Format date to localized string
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non spécifiée';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR');
  };

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case 'interview':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Entretien
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Refusé
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Accepté
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-cyan-400">
          {application.company} - {application.position}
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-400">Statut</p>
          <div className="mt-1">{getStatusBadge(application.status)}</div>
        </div>
        
        <div>
          <p className="text-sm text-gray-400">Date de candidature</p>
          <p className="text-white">{formatDate(application.applicationDate)}</p>
        </div>
        
        {application.location && (
          <div>
            <p className="text-sm text-gray-400">Lieu</p>
            <p className="text-white">{application.location}</p>
          </div>
        )}
        
        {application.salary && (
          <div>
            <p className="text-sm text-gray-400">Salaire proposé</p>
            <p className="text-white">{application.salary}</p>
          </div>
        )}
        
        {application.contactPerson && (
          <div>
            <p className="text-sm text-gray-400">Personne de contact</p>
            <p className="text-white">{application.contactPerson}</p>
          </div>
        )}
        
        {application.contactEmail && (
          <div>
            <p className="text-sm text-gray-400">Email de contact</p>
            <p className="text-white">
              <a 
                href={`mailto:${application.contactEmail}`}
                className="text-cyan-400 hover:underline"
              >
                {application.contactEmail}
              </a>
            </p>
          </div>
        )}
        
        {application.contactPhone && (
          <div>
            <p className="text-sm text-gray-400">Téléphone de contact</p>
            <p className="text-white">{application.contactPhone}</p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-400">Dernière mise à jour</p>
          <p className="text-white">{formatDate(application.updatedAt)}</p>
        </div>
      </div>

      {application.jobDescription && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Description du poste</p>
          <div className="bg-gray-700 p-3 rounded-md text-white">
            {application.jobDescription}
          </div>
        </div>
      )}
      
      {application.notes && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Notes</p>
          <div className="bg-gray-700 p-3 rounded-md text-white">
            {application.notes}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Supprimer
        </button>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
        >
          Modifier
        </button>
      </div>
    </div>
  );
};

export default ApplicationDetail; 