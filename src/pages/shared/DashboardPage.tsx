import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons, Avatar } from '../../components/ui/Icons';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const stats = {
    projects: { total: 24, active: 8 },
    quotes: { pending: 5, total: 42 },
    invoices: { pending: 3, overdue: 1 },
    revenue: 485600,
    tasks: { completed: 45, pending: 12 },
    siteVisits: { scheduled: 3, completed: 28 },
  };

  const recentProjects = [
    { id: '1', name: 'Thompson Garden Renovation', client: 'James Thompson', status: 'in_progress', value: 15200, progress: 65 },
    { id: '2', name: 'Mitchell Patio Installation', client: 'Sarah Mitchell', status: 'pending_quote', value: 8500, progress: 0 },
    { id: '3', name: 'Parker Driveway', client: 'Robert Parker', status: 'completed', value: 12800, progress: 100 },
    { id: '4', name: 'Wilson Garden Design', client: 'Emma Wilson', status: 'in_progress', value: 22000, progress: 30 },
  ];

  const upcomingTasks = [
    { id: '1', title: 'Complete foundation work', project: 'Thompson Garden', due: 'Today', priority: 'high' },
    { id: '2', title: 'Material delivery coordination', project: 'Mitchell Patio', due: 'Tomorrow', priority: 'normal' },
    { id: '3', title: 'Site inspection', project: 'Parker Driveway', due: 'Jan 6', priority: 'low' },
    { id: '4', title: 'Client meeting', project: 'Wilson Garden', due: 'Jan 7', priority: 'high' },
  ];

  const recentActivity = [
    { id: '1', type: 'task', message: 'Task "Lay patio slabs" completed', time: '2 hours ago', icon: Icons.Check },
    { id: '2', type: 'quote', message: 'Quote sent to Sarah Mitchell', time: '4 hours ago', icon: Icons.FileText },
    { id: '3', type: 'payment', message: 'Payment received from James Thompson', time: 'Yesterday', icon: Icons.Pound },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    pending_quote: { label: 'Quote Pending', color: 'text-amber-700', bgColor: 'bg-amber-50 border border-amber-200' },
    in_progress: { label: 'In Progress', color: 'text-sage-700', bgColor: 'bg-sage-50 border border-sage-200' },
    completed: { label: 'Completed', color: 'text-sage-700', bgColor: 'bg-sage-100 border border-sage-200' },
    draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-50 border border-gray-200' },
  };

  const priorityConfig: Record<string, { dotColor: string }> = {
    high: { dotColor: 'bg-red-500' },
    normal: { dotColor: 'bg-sage-500' },
    low: { dotColor: 'bg-gray-400' },
  };

  const canViewFinancials = user?.role === 'system_owner' || user?.role === 'quantity_surveyor';
  const canViewProfit = user?.role === 'system_owner';
  const canManageTeam = user?.role === 'system_owner';
  const canViewQuotes = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'sales_admin';
  const canViewSchedule = user?.role === 'system_owner' || user?.role === 'project_manager' || user?.role === 'quantity_surveyor';
  const canViewReports = user?.role === 'system_owner' || user?.role === 'project_manager' || user?.role === 'quantity_surveyor';
  const isDesigner = user?.role === 'designer';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-sage-200 border-t-sage-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-2">Here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 text-white rounded-xl font-semibold hover:bg-sage-700 transition-all shadow-lg shadow-sage-200"
          >
            <Icons.Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold mt-2">{stats.projects.active}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.Folder className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold mt-2">{stats.tasks.pending}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.ClipboardList className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {canViewQuotes && (
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sage-100 text-sm font-medium">Pending Quotes</p>
                <p className="text-3xl font-bold mt-2">{stats.quotes.pending}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {canViewProfit && (
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sage-100 text-sm font-medium">Revenue</p>
                <p className="text-3xl font-bold mt-2">£{stats.revenue.toLocaleString()}</p>
                <p className="text-sage-200 text-sm mt-1 flex items-center gap-1">
                  <Icons.TrendingUp className="w-4 h-4" /> +12% this month
                </p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.Pound className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {isDesigner && (
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sage-100 text-sm font-medium">Designs in Progress</p>
                <p className="text-3xl font-bold mt-2">3</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.Folder className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}

        {canViewSchedule && !canViewProfit && (
          <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sage-100 text-sm font-medium">Site Visits</p>
                <p className="text-3xl font-bold mt-2">{stats.siteVisits.scheduled}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link to="/projects" className="text-sm text-sage-600 hover:text-sage-700 font-semibold flex items-center gap-1">
                View all
                <Icons.ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => {
                const status = statusConfig[project.status];
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block p-5 bg-sage-50 rounded-xl hover:bg-sage-100 transition-all group border border-sage-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-sage-700 transition-colors truncate text-lg">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{project.client}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2.5 bg-sage-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-sage-500 to-sage-600 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">{project.progress}%</span>
                      {canViewFinancials && (
                        <span className="text-sm font-bold text-sage-700 bg-sage-100 px-3 py-1 rounded-lg">
                          £{project.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Tasks</h2>
              <Link to="/tasks" className="text-sm text-sage-600 hover:text-sage-700 font-semibold">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 4).map((task) => {
                const priority = priorityConfig[task.priority];
                return (
                  <Link
                    key={task.id}
                    to="/tasks"
                    className="flex items-start gap-3 p-4 bg-sage-50 rounded-xl hover:bg-sage-100 transition-colors group border border-sage-100"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${priority.dotColor}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm group-hover:text-sage-700 transition-colors truncate">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{task.project}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      task.due === 'Today' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.due}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-5 h-5 text-sage-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            to="/projects/new"
            className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
          >
            <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
              <Icons.Plus className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-sage-800 text-sm">New Project</span>
          </Link>
          
          <Link
            to="/tasks"
            className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
          >
            <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
              <Icons.ClipboardList className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-sage-800 text-sm">Add Task</span>
          </Link>

          {canViewQuotes && (
            <Link
              to="/quotes/new"
              className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
            >
              <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
                <Icons.FileText className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-sage-800 text-sm">Create Quote</span>
            </Link>
          )}

          {canViewSchedule && (
            <Link
              to="/schedule"
              className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
            >
              <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
                <Icons.Calendar className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-sage-800 text-sm">Schedule</span>
            </Link>
          )}

          {canManageTeam && (
            <Link
              to="/users"
              className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
            >
              <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
                <Icons.Users className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-sage-800 text-sm">Team</span>
            </Link>
          )}

          {canViewReports && (
            <Link
              to="/reports"
              className="flex flex-col items-center gap-3 p-5 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl hover:from-sage-100 hover:to-sage-200 transition-all group border border-sage-200"
            >
              <div className="w-14 h-14 bg-sage-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-sage-200">
                <Icons.BarChart className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-sage-800 text-sm">Reports</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
