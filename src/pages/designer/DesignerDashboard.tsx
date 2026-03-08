import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, measurementAPI } from '../../services/api';
import type { Project } from '../../types';

const DesignerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.list();
      setProjects(response.data.filter(p => 
        p.status === 'survey_completed' || p.status === 'design_in_progress' || p.status === 'design_completed'
      ));
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Designer Dashboard</h1>
        <p className="text-gray-600 mt-2">Create garden designs based on measurements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Awaiting Design</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {projects.filter(p => p.status === 'survey_completed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {projects.filter(p => p.status === 'design_in_progress').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {projects.filter(p => p.status === 'design_completed').length}
          </p>
        </div>
      </div>

      {/* Projects Needing Design */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Projects Ready for Design</h2>
        </div>
        <div className="p-6">
          {projects.filter(p => p.status === 'survey_completed').length === 0 ? (
            <p className="text-gray-500">No projects waiting for design</p>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(p => p.status === 'survey_completed')
                .map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.client_name}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Survey completed - Ready for design
                        </p>
                      </div>
                      <Link
                        to={`/designer/design/${project.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Start Design
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
