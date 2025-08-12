import React from 'react';
import { Application } from '../types';

interface ApplicationsTableProps {
  applications: Application[];
  onView: (application: Application) => void;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non spécifiée';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR');
  };

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

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Aucune candidature trouvée. Ajoutez votre première candidature !
      </div>
    );
  }

  return (
    <div>
      {/* Version mobile - Cartes */}
      <div className="block md:hidden space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-gray-750 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{application.company}</h3>
                <p className="text-gray-300 text-sm mb-2">{application.position}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    Candidature: {formatDate(application.applicationDate)}
                  </span>
                  {getStatusBadge(application.status)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-3 border-t border-gray-700">
              <button 
                onClick={() => onView(application)} 
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Voir les détails"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button 
                onClick={() => onEdit(application)} 
                className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-gray-700 rounded-md transition-colors"
                title="Modifier"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(application.id)} 
                className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors"
                title="Supprimer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Version desktop - Tableau */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Entreprise
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Poste
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date de candidature
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-750">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{application.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{application.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{formatDate(application.applicationDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(application.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => onView(application)} 
                    className="text-gray-300 hover:text-white mr-3"
                    title="Voir les détails"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onEdit(application)} 
                    className="text-cyan-400 hover:text-cyan-300 mr-3"
                    title="Modifier"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onDelete(application.id)} 
                    className="text-red-400 hover:text-red-300"
                    title="Supprimer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsTable; 