import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  // Computed getter - not stored
  readonly isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  register: (userData: RegisterData) => Promise<User>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  company_name?: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  availability?: string;
}

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Helper function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('greenscape-token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`);
  }
  
  return response.json();
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      // This will be computed via selector, but we keep it for backward compatibility
      get isAuthenticated(): boolean {
        return get().token !== null && get().user !== null;
      },

      login: async (email: string, password: string): Promise<User> => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          
          
          // Store token separately for API calls
          localStorage.setItem('greenscape-token', data.token);
          
          const user = data.user;
          
          set({
            user: user,
            token: data.token,
            isLoading: false,
            error: null,
          });
          
          // Return the user so caller can use it immediately
          return user;
        } catch (error: any) {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: error.message || 'Invalid email or password',
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('greenscape-token');
        localStorage.removeItem('greenscape-auth');
        set({
          user: null,
          token: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const data = await apiCall(`/users/${currentUser.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              full_name: userData.full_name,
              phone: userData.phone,
            }),
          });
          
          set({
            user: data || { ...currentUser, ...userData },
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update profile',
          });
          throw error;
        }
      },

      register: async (userData: RegisterData): Promise<User> => {
        set({ isLoading: true, error: null });
        
        try {
          const data = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
          });
          
          
          // Store token
          localStorage.setItem('greenscape-token', data.token);
          
          const user = data.user;
          
          set({
            user: user,
            token: data.token,
            isLoading: false,
            error: null,
          });
          
          // Return the user so caller can use it immediately
          return user;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed. Please try again.',
          });
          throw error;
        }
      },

      refreshUser: async () => {
        const token = get().token;
        if (!token) return;
        
        try {
          const data = await apiCall('/auth/me');
          set({ user: data.user || data });
        } catch (error) {
          // Token might be expired, logout
          get().logout();
        }
      },
    }),
    {
      name: 'greenscape-auth',
      // Only persist token and user - isAuthenticated is computed
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      // Validate on rehydration - clear invalid state
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If we have token but no user, or vice versa, clear both
          if ((state.token && !state.user) || (!state.token && state.user)) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('greenscape-token');
          }
        }
      },
    }
  )
);

// Computed selector for isAuthenticated - use this in components
export const useIsAuthenticated = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  return token !== null && user !== null;
};

// Permission helpers
const rolePermissions: Record<UserRole, string[]> = {
  system_owner: [
    'view_profit',
    'view_costs',
    'view_pricing',
    'create_projects',
    'manage_stages',
    'assign_tasks',
    'manage_users',
    'approve_pricing',
    'generate_quotes',
    'upload_documents',
    'edit_designs',
    'complete_tasks',
    'request_materials',
    'manage_payments',
    'view_reports',
    'override',
    'manage_settings',
  ],
  sales_admin: [
    'view_pricing',
    'upload_documents',
    'manage_enquiries',
    'manage_social_media',
    'create_projects',
  ],
  quantity_surveyor: [
    'view_costs',
    'view_pricing',
    'create_projects',
    'generate_quotes',
    'upload_documents',
    'manage_payments',
    'view_reports',
    'manage_site_visits',
  ],
  designer: [
    'view_pricing',
    'upload_documents',
    'edit_designs',
    'view_projects',
  ],
  project_manager: [
    'view_costs',
    'view_pricing',
    'manage_stages',
    'assign_tasks',
    'upload_documents',
    'complete_tasks',
    'request_materials',
    'approve_materials',
    'view_reports',
    'manage_schedule',
  ],
  worker: [
    'view_assigned_tasks',
    'complete_tasks',
    'request_materials',
  ],
};

// Permission check hooks
export const useHasPermission = (permission: string): boolean => {
  const { user } = useAuthStore();
  if (!user) return false;
  const userRole = user.role as UserRole;
  return rolePermissions[userRole]?.includes(permission) || false;
};

// Specific permission hooks
export const useCanViewProfit = () => useHasPermission('view_profit');
export const useCanViewCosts = () => useHasPermission('view_costs');
export const useCanManageUsers = () => useHasPermission('manage_users');
export const useCanCreateProjects = () => useHasPermission('create_projects');
export const useCanApproveDiscounts = () => useHasPermission('approve_pricing');
export const useCanManageStages = () => useHasPermission('manage_stages');
export const useCanAssignTasks = () => useHasPermission('assign_tasks');
export const useCanCreateQuotes = () => useHasPermission('generate_quotes');
export const useCanCreateDesigns = () => useHasPermission('edit_designs');
export const useCanApproveMaterials = () => useHasPermission('approve_materials');
export const useCanUploadDocuments = () => useHasPermission('upload_documents');
export const useCanViewReports = () => useHasPermission('view_reports');
export const useCanManageSettings = () => useHasPermission('manage_settings');

// Role check hooks
export const useIsSystemOwner = () => {
  const { user } = useAuthStore();
  return user?.role === 'system_owner';
};

export const useIsSalesAdmin = () => {
  const { user } = useAuthStore();
  return user?.role === 'sales_admin';
};

export const useIsQS = () => {
  const { user } = useAuthStore();
  return user?.role === 'quantity_surveyor';
};

export const useIsDesigner = () => {
  const { user } = useAuthStore();
  return user?.role === 'designer';
};

export const useIsPM = () => {
  const { user } = useAuthStore();
  return user?.role === 'project_manager';
};

export const useIsWorker = () => {
  const { user } = useAuthStore();
  return user?.role === 'worker';
};

// Get user hook
export const useUser = () => {
  const { user } = useAuthStore();
  return user;
};

// Get user display role
export const useRoleDisplayName = (): string => {
  const { user } = useAuthStore();
  if (!user) return '';
  
  const roleNames: Record<UserRole, string> = {
    system_owner: 'Business Owner',
    sales_admin: 'Sales Admin',
    quantity_surveyor: 'Quantity Surveyor',
    designer: 'Designer',
    project_manager: 'Project Manager',
    worker: 'Worker',
  };
  
  return roleNames[user.role as UserRole] || user.role;
};
