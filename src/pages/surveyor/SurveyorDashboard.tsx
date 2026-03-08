import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI, siteVisitAPI } from '../../services/api';
import type { Project, SiteVisit } from '../../types';

const SurveyorDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, visitsRes] = await Promise.all([
        projectAPI.list(),
        siteVisitAPI.list(),
      ]);
      setProjects(projectsRes.data.filter(p => 
        p.status === 'survey_pending' || p.status === 'survey_completed'
      ));
      setSiteVisits(visitsRes.data);
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
        <h1 className="text-3xl font-bold text-gray-900">Surveyor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage site visits and measurements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Surveys</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {projects.filter(p => p.status === 'survey_pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed Surveys</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {projects.filter(p => p.status === 'survey_completed').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Site Visits</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{siteVisits.length}</p>
        </div>
      </div>

      {/* Pending Projects */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Projects Needing Survey</h2>
        </div>
        <div className="p-6">
          {projects.filter(p => p.status === 'survey_pending').length === 0 ? (
            <p className="text-gray-500">No pending surveys</p>
          ) : (
            <div className="space-y-4">
              {projects
                .filter(p => p.status === 'survey_pending')
                .map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.client_name}</p>
                        {project.client_phone && (
                          <p className="text-sm text-gray-500">📞 {project.client_phone}</p>
                        )}
                      </div>
                      <Link
                        to={`/surveyor/measure/${project.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Start Survey
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Site Visits */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Site Visits</h2>
        </div>
        <div className="p-6">
          {siteVisits.length === 0 ? (
            <p className="text-gray-500">No site visits yet</p>
          ) : (
            <div className="space-y-4">
              {siteVisits.slice(0, 5).map((visit) => (
                <div
                  key={visit.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(visit.visit_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{visit.notes || 'No notes'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      visit.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {visit.status}
                    </span>
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

export default SurveyorDashboard;
