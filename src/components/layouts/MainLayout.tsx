import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons, Avatar } from '../ui/Icons';

// Navigation items by role
const getNavItems = (role: string) => {
  const items = [
    { 
      path: role === 'worker' ? '/worker-dashboard' : '/dashboard', 
      label: 'Dashboard', 
      icon: Icons.Home, 
      roles: ['system_owner', 'sales_admin', 'quantity_surveyor', 'designer', 'project_manager', 'worker'] 
    },
    { path: '/projects', label: 'Projects', icon: Icons.Folder, roles: ['system_owner', 'sales_admin', 'quantity_surveyor', 'designer', 'project_manager'] },
    { path: '/tasks', label: 'Tasks', icon: Icons.ClipboardList, roles: ['system_owner', 'project_manager', 'worker'] },
    { path: '/quotes', label: 'Quotes', icon: Icons.FileText, roles: ['system_owner', 'quantity_surveyor', 'sales_admin'] },
    { path: '/invoices', label: 'Invoices', icon: Icons.Receipt, roles: ['system_owner', 'quantity_surveyor'] },
    { path: '/schedule', label: 'Schedule', icon: Icons.Calendar, roles: ['system_owner', 'project_manager', 'quantity_surveyor'] },
    { path: '/materials', label: 'Materials', icon: Icons.Package, roles: ['system_owner', 'project_manager', 'quantity_surveyor'] },
    { path: '/calculator', label: 'Calculator', icon: Icons.Calculator, roles: ['system_owner', 'project_manager', 'quantity_surveyor'] },
    { path: '/users', label: 'Team', icon: Icons.Users, roles: ['system_owner'] },
    { path: '/reports', label: 'Reports', icon: Icons.BarChart, roles: ['system_owner', 'project_manager', 'quantity_surveyor'] },
    { path: '/settings', label: 'Settings', icon: Icons.Settings, roles: ['system_owner'] },
  ];

  return items.filter(item => item.roles.includes(role));
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = user ? getNavItems(user.role) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabels: Record<string, string> = {
    system_owner: 'Business Owner',
    sales_admin: 'Sales Admin',
    quantity_surveyor: 'Quantity Surveyor',
    designer: 'Designer',
    project_manager: 'Project Manager',
    worker: 'Worker',
  };

  const roleBadgeColors: Record<string, string> = {
    system_owner: 'bg-sage-100 text-sage-700 border-sage-200',
    sales_admin: 'bg-sage-50 text-sage-600 border-sage-200',
    quantity_surveyor: 'bg-sage-100 text-sage-700 border-sage-200',
    designer: 'bg-sage-50 text-sage-600 border-sage-200',
    project_manager: 'bg-sage-100 text-sage-700 border-sage-200',
    worker: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/worker-dashboard' && location.pathname === '/worker-dashboard') return true;
    if (path !== '/dashboard' && path !== '/worker-dashboard') {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Icons.Menu className="w-6 h-6 text-gray-600" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center shadow-md">
              <Icons.Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">GreenScape</span>
          </Link>
          <div className="w-8 h-8">
            <Avatar name={user?.full_name || ''} size="sm" />
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl">
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-sage-50 to-white">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Icons.Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">GreenScape</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Icons.X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Mobile User Info */}
            {user && (
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-4">
                  <Avatar name={user.full_name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{user.full_name}</p>
                    <span className={`inline-block mt-1.5 text-xs px-2.5 py-1 rounded-full border ${roleBadgeColors[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                      {roleLabels[user.role] || user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <nav className="p-4 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl mb-1.5 transition-all ${
                      active
                        ? 'bg-gradient-to-r from-sage-600 to-sage-700 text-white shadow-lg shadow-sage-200'
                        : 'text-gray-600 hover:bg-sage-50 hover:text-sage-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
              >
                <Icons.LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center shadow-lg shadow-sage-200">
              <Icons.Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GreenScape</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-r from-sage-600 to-sage-700 text-white shadow-lg shadow-sage-200'
                      : 'text-gray-600 hover:bg-sage-50 hover:text-sage-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        {user && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
              <Avatar name={user.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm">{user.full_name}</p>
                <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full border ${roleBadgeColors[user.role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {roleLabels[user.role] || user.role}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                to="/settings"
                className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-sage-50 hover:text-sage-700 rounded-xl transition-colors text-sm font-medium"
              >
                <Icons.Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
              >
                <Icons.LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
