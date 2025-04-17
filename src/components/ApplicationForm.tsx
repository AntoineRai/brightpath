import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (applicationData: Omit<Application, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<Application, 'id' | 'lastUpdated'>>({
    company: '',
    position: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'pending' as ApplicationStatus,
    notes: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
    salary: '',
    jobDescription: ''
  });

  useEffect(() => {
    if (application) {
      const { id, lastUpdated, ...rest } = application;
      setFormData(rest);
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-cyan-400 mb-4">
        {application ? 'Modifier la candidature' : 'Ajouter une candidature'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
              Entreprise *
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
              Poste *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-300 mb-1">
              Date de candidature *
            </label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="pending">En attente</option>
              <option value="interview">Entretien</option>
              <option value="rejected">Refusé</option>
              <option value="accepted">Accepté</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Lieu
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">
              Salaire proposé
            </label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary || ''}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300 mb-1">
              Personne de contact
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson || ''}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-300 mb-1">
              Email de contact
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail || ''}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300 mb-1">
              Téléphone de contact
            </label>
            <input
              type="text"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone || ''}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-300 mb-1">
            Description du poste
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription || ''}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
          >
            {application ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm; 