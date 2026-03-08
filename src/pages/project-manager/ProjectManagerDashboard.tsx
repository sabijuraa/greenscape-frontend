import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, expenseAPI } from '../../services/api';
import type { Project } from '../../types';

const ProjectManagerDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await projectAPI.list();
      const activeProjects = response.data.filter(p => 
        p.status === 'in_progress' || p.status === 'quote_accepted'
      );
      setProjects(activeProjects);

      // Calculate total spent across all projects
      let total = 0;
      for (const project of activeProjects) {
        try {
          const expenseRes = await expenseAPI.listByProject(project.id);
          total += expenseRes.data.total_spent;
        } catch (err) {
          console.error(`Failed to load expenses for project ${project.id}`);
        }
      }
      setTotalSpent(total);
    } catch (err) {
      console.error('Failed to load data:', err);
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
        <h1 className="text-3xl font-bold text-gray-900">Project Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Track materials and expenses</p>
      </div>

      {/* Stats - Note: NO total project budget shown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Spent (Your Expenses)</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            £{totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Across all your projects</p>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
        </div>
        <div className="p-6">
          {projects.length === 0 ? (
            <p className="text-gray-500">No active projects</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.client_name}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {project.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Link
                      to={`/project-manager/expenses/${project.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Track Expenses
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> You can see material quantities needed and track your expenses. 
          Project budget information is managed by Admin/Sales.
        </p>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
