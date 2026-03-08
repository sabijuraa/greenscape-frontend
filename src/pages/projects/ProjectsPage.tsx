import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons, SearchInput, Avatar, EmptyState } from '../../components/ui/Icons';
import { ProjectStatus } from '../../types';

const mockProjects = [
  {
    id: '1',
    name: 'Thompson Garden Renovation',
    client_name: 'James Thompson',
    client_phone: '07700 900123',
    address: '42 Oak Lane, Richmond, Surrey',
    postcode: 'TW9 2AB',
    area_sqm: 245,
    status: 'in_progress' as ProjectStatus,
    progress_percentage: 65,
    estimated_start_date: '2025-01-02',
    estimated_end_date: '2025-02-15',
    created_at: '2024-12-15',
    assigned_pm: 'Mike Johnson',
    value: 28500,
  },
  {
    id: '2',
    name: 'Mitchell Patio Installation',
    client_name: 'Sarah Mitchell',
    client_phone: '07700 900456',
    address: '15 Willow Street, Kingston',
    postcode: 'KT1 3BH',
    area_sqm: 85,
    status: 'quoted' as ProjectStatus,
    progress_percentage: 0,
    estimated_start_date: '2025-01-20',
    estimated_end_date: '2025-02-05',
    created_at: '2024-12-28',
    assigned_pm: null,
    value: 12800,
  },
  {
    id: '3',
    name: 'Parker Driveway & Landscaping',
    client_name: 'Robert Parker',
    client_phone: '07700 900789',
    address: '8 Cedar Close, Twickenham',
    postcode: 'TW2 5PQ',
    area_sqm: 180,
    status: 'completed' as ProjectStatus,
    progress_percentage: 100,
    estimated_start_date: '2024-11-01',
    estimated_end_date: '2024-12-20',
    created_at: '2024-10-15',
    assigned_pm: 'Mike Johnson',
    value: 42000,
  },
  {
    id: '4',
    name: 'Henderson Complete Garden Design',
    client_name: 'Emily Henderson',
    client_phone: '07700 900321',
    address: '23 Maple Avenue, Hampton',
    postcode: 'TW12 2LR',
    area_sqm: 320,
    status: 'designing' as ProjectStatus,
    progress_percentage: 25,
    estimated_start_date: '2025-02-01',
    estimated_end_date: '2025-04-15',
    created_at: '2024-12-20',
    assigned_pm: null,
    value: 65000,
  },
  {
    id: '5',
    name: 'Wilson Lawn Renovation',
    client_name: 'David Wilson',
    client_phone: '07700 900654',
    address: '56 Birch Road, Surbiton',
    postcode: 'KT6 4NE',
    area_sqm: 150,
    status: 'site_visit' as ProjectStatus,
    progress_percentage: 0,
    estimated_start_date: null,
    estimated_end_date: null,
    created_at: '2025-01-02',
    assigned_pm: null,
    value: null,
  },
  {
    id: '6',
    name: 'Brown Patio Extension',
    client_name: 'Lisa Brown',
    client_phone: '07700 900987',
    address: '12 Elm Drive, Esher',
    postcode: 'KT10 8JN',
    area_sqm: 65,
    status: 'deposit_paid' as ProjectStatus,
    progress_percentage: 0,
    estimated_start_date: '2025-01-15',
    estimated_end_date: '2025-01-30',
    created_at: '2024-12-22',
    assigned_pm: 'Mike Johnson',
    value: 8900,
  },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  site_visit: { label: 'Site Visit', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  measuring: { label: 'Measuring', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  designing: { label: 'Designing', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  design_review: { label: 'Design Review', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  pending_quote: { label: 'Pending Quote', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  quoted: { label: 'Quoted', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  approved: { label: 'Approved', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  deposit_paid: { label: 'Deposit Paid', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  in_progress: { label: 'In Progress', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  on_hold: { label: 'On Hold', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  snagging: { label: 'Snagging', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  completed: { label: 'Completed', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  signed_off: { label: 'Signed Off', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const ProjectsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const canViewFinancials = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'project_manager';

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockProjects.length,
    active: mockProjects.filter(p => ['in_progress', 'deposit_paid', 'snagging'].includes(p.status)).length,
    quoted: mockProjects.filter(p => p.status === 'quoted').length,
    completed: mockProjects.filter(p => ['completed', 'signed_off'].includes(p.status)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage all your landscaping projects</p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Total Projects</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.Folder className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.Tool className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Awaiting Approval</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.quoted}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
              <Icons.FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.CheckCircle className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search projects, clients, addresses..."
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Icons.Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Icons.List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <EmptyState
            icon={<Icons.Folder className="w-12 h-12 text-gray-300" />}
            title="No projects found"
            description="Try adjusting your search or filter criteria"
            action={
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium mt-4"
              >
                <Icons.Plus className="w-4 h-4" />
                Create a new project
              </Link>
            }
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const status = statusConfig[project.status];
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg hover:border-sage-200 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                    {status.label}
                  </span>
                  <button className="p-1.5 hover:bg-sage-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Project Info */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sage-700 transition-colors">
                  {project.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Icons.User className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{project.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{project.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Layers className="w-4 h-4 flex-shrink-0" />
                    <span>{project.area_sqm} m²</span>
                  </div>
                </div>

                {/* Progress Bar (if applicable) */}
                {project.status === 'in_progress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress_percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sage-500 to-sage-600 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  {canViewFinancials && project.value ? (
                    <span className="font-semibold text-sage-700 bg-sage-50 px-3 py-1 rounded-lg">£{project.value.toLocaleString()}</span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                  {project.assigned_pm && (
                    <div className="flex items-center gap-2">
                      <Avatar name={project.assigned_pm} size="sm" />
                      <span className="text-sm text-gray-500">{project.assigned_pm}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</th>
                  {canViewFinancials && (
                    <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                  )}
                  <th className="py-4 px-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((project) => {
                  const status = statusConfig[project.status];
                  return (
                    <tr key={project.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="py-4 px-5">
                        <Link to={`/projects/${project.id}`} className="font-medium text-gray-900 hover:text-sage-600 transition-colors">
                          {project.name}
                        </Link>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{project.address}</p>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <Avatar name={project.client_name} size="sm" />
                          <span className="text-gray-700">{project.client_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-500">{project.progress_percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-sage-500 rounded-full"
                              style={{ width: `${project.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-700">{project.area_sqm} m²</td>
                      {canViewFinancials && (
                        <td className="py-4 px-5 text-right font-medium text-gray-900">
                          {project.value ? `£${project.value.toLocaleString()}` : '-'}
                        </td>
                      )}
                      <td className="py-4 px-5">
                        <Link 
                          to={`/projects/${project.id}`}
                          className="p-2 hover:bg-sage-100 rounded-lg inline-flex transition-colors"
                        >
                          <Icons.ArrowRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
