import React from 'react';
import { ApplicationStats as ApplicationStatsType } from '../types';

interface ApplicationStatsProps {
  stats: ApplicationStatsType;
}

const ApplicationStats: React.FC<ApplicationStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
        <div className="text-gray-300">Candidatures totales</div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
        <div className="text-gray-300">En attente</div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="text-2xl font-bold text-green-400">{stats.interview}</div>
        <div className="text-gray-300">Entretiens</div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="text-2xl font-bold text-blue-400">{stats.accepted}</div>
        <div className="text-gray-300">Acceptés</div>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
        <div className="text-gray-300">Refusés</div>
      </div>
    </div>
  );
};

export default ApplicationStats; 