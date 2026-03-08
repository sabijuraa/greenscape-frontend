import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Public Pages
import HomePage from './pages/HomePage';

// Auth Pages
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ProfileSetupPage from './pages/auth/ProfileSetupPage';

// Shared Pages
import LoginPage from './pages/shared/LoginPage';
import DashboardPage from './pages/shared/DashboardPage';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';

// NEW ROLE-SPECIFIC PAGES
// Surveyor Pages
import SurveyorDashboard from './pages/surveyor/SurveyorDashboard';
import MeasurementPage from './pages/surveyor/MeasurementPage';

// Designer Pages
import DesignerDashboard from './pages/designer/DesignerDashboard';

// Project Manager Pages
import ProjectManagerDashboard from './pages/project-manager/ProjectManagerDashboard';

// Profile Pages
import EditProfilePage from './pages/profile/EditProfilePage';

// Project Pages
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
import NewProjectPage from './pages/projects/NewProjectPage';

// Task Pages
import TasksPage from './pages/tasks/TasksPage';
import NewTaskPage from './pages/tasks/NewTaskPage';

// Quote Pages
import QuotesPage from './pages/qoutes/QuotesPage';
import NewQuotePage from './pages/qoutes/NewQuotePage';

// Invoice Pages
import InvoicesPage from './pages/invoices/InvoicesPage';
import NewInvoicePage from './pages/invoices/NewInvoicePage';

// Other Pages
import SchedulePage from './pages/schedule/SchedulePage';
import MaterialsPage from './pages/materials/MaterialsPage';
import MaterialCalculatorPage from './pages/calculator/MaterialCalculatorPage';
import SettingsPage from './pages/settings/SettingsPage';
import TeamPage from './pages/team/TeamPage';
import ReportsPage from './pages/reports/ReportsPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  if (token === null || user === null) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Guest Route Component
const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  if (token !== null && user !== null) {
    // Redirect based on role
    switch (user.role) {
      case 'surveyor':
        return <Navigate to="/surveyor" replace />;
      case 'designer':
        return <Navigate to="/designer" replace />;
      case 'admin_sales':
      case 'owner':
        return <Navigate to="/dashboard" replace />;
      case 'project_manager':
        return <Navigate to="/project-manager" replace />;
      case 'worker':
        return <Navigate to="/worker-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

// Role-based Route
const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<HomePage />} />
      
      {/* GUEST ONLY */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/profile-setup" element={<GuestRoute><ProfileSetupPage /></GuestRoute>} />
      
      {/* PROTECTED */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        
        {/* NEW ROLE-SPECIFIC ROUTES */}
        {/* Surveyor Routes */}
        <Route path="/surveyor" element={<RoleRoute allowedRoles={['surveyor', 'owner']}><SurveyorDashboard /></RoleRoute>} />
        <Route path="/surveyor/measure/:projectId" element={<RoleRoute allowedRoles={['surveyor', 'owner']}><MeasurementPage /></RoleRoute>} />
        
        {/* Designer Routes */}
        <Route path="/designer" element={<RoleRoute allowedRoles={['designer', 'owner']}><DesignerDashboard /></RoleRoute>} />
        
        {/* Project Manager Routes */}
        <Route path="/project-manager" element={<RoleRoute allowedRoles={['project_manager', 'owner']}><ProjectManagerDashboard /></RoleRoute>} />
        
        {/* Profile */}
        <Route path="/profile/edit" element={<EditProfilePage />} />
        
        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        
        {/* Tasks */}
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<NewTaskPage />} />
        
        {/* Quotes */}
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/quotes/new" element={<NewQuotePage />} />
        
        {/* Invoices */}
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/new" element={<NewInvoicePage />} />
        
        {/* Schedule */}
        <Route path="/schedule" element={<SchedulePage />} />
        
        {/* Materials */}
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/calculator" element={<MaterialCalculatorPage />} />
        
        {/* Team - Owner only */}
        <Route path="/users" element={<RoleRoute allowedRoles={['system_owner']}><TeamPage /></RoleRoute>} />
        
        {/* Reports */}
        <Route path="/reports" element={<ReportsPage />} />
        
        {/* Settings - Owner only */}
        <Route path="/settings" element={<RoleRoute allowedRoles={['system_owner']}><SettingsPage /></RoleRoute>} />
      </Route>
      
      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
