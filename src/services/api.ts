import axios from 'axios';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Project,
  Material,
  Task,
  Quote,
  Invoice,
  SiteVisit,
  Photo,
  Measurement,
  CreateMeasurementRequest,
  DesignArea,
  CreateDesignAreaRequest,
  Expense,
  ExpenseSummary,
  CreateExpenseRequest,
  DashboardStats,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTH API
// ============================================================================
export const authAPI = {
  login: (data: LoginRequest) => 
    api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => 
    api.post<AuthResponse>('/auth/register', data),
  me: () => 
    api.get<User>('/auth/me'),
};

// ============================================================================
// PROJECT API
// ============================================================================
export const projectAPI = {
  list: () => 
    api.get<Project[]>('/projects'),
  get: (id: string) => 
    api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => 
    api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => 
    api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => 
    api.delete(`/projects/${id}`),
};

// ============================================================================
// PHOTO API
// ============================================================================
export const photoAPI = {
  upload: (file: File, relatedTo: string, relatedId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Photo>(
      `/photos/upload?related_to=${relatedTo}&related_id=${relatedId}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
  list: (relatedTo: string, relatedId: string) => 
    api.get<Photo[]>(`/photos?related_to=${relatedTo}&related_id=${relatedId}`),
  delete: (id: string) => 
    api.delete(`/photos/${id}`),
};

// ============================================================================
// MEASUREMENT API
// ============================================================================
export const measurementAPI = {
  create: (data: CreateMeasurementRequest) => 
    api.post<Measurement>('/measurements', data),
  listByProject: (projectId: string) => 
    api.get<Measurement[]>(`/measurements/project/${projectId}`),
  delete: (id: string) => 
    api.delete(`/measurements/${id}`),
};

// ============================================================================
// DESIGN AREA API
// ============================================================================
export const designAreaAPI = {
  create: (data: CreateDesignAreaRequest) => 
    api.post<DesignArea>('/design-areas', data),
  listByProject: (projectId: string) => 
    api.get<DesignArea[]>(`/design-areas/project/${projectId}`),
  delete: (id: string) => 
    api.delete(`/design-areas/${id}`),
};

// ============================================================================
// EXPENSE API
// ============================================================================
export const expenseAPI = {
  create: (data: CreateExpenseRequest) => 
    api.post<Expense>('/expenses', data),
  listByProject: (projectId: string) => 
    api.get<ExpenseSummary>(`/expenses/project?project_id=${projectId}`),
  update: (id: string, data: CreateExpenseRequest) => 
    api.put<Expense>(`/expenses/${id}`, data),
  delete: (id: string) => 
    api.delete(`/expenses/${id}`),
};

// ============================================================================
// MATERIAL API
// ============================================================================
export const materialAPI = {
  list: () => 
    api.get<Material[]>('/materials'),
  get: (id: string) => 
    api.get<Material>(`/materials/${id}`),
  create: (data: Partial<Material>) => 
    api.post<Material>('/materials', data),
  update: (id: string, data: Partial<Material>) => 
    api.put<Material>(`/materials/${id}`, data),
  delete: (id: string) => 
    api.delete(`/materials/${id}`),
};

// ============================================================================
// TASK API
// ============================================================================
export const taskAPI = {
  list: () => 
    api.get<Task[]>('/tasks'),
  get: (id: string) => 
    api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => 
    api.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) => 
    api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => 
    api.delete(`/tasks/${id}`),
};

// ============================================================================
// QUOTE API
// ============================================================================
export const quoteAPI = {
  list: () => 
    api.get<Quote[]>('/quotes'),
  get: (id: string) => 
    api.get<Quote>(`/quotes/${id}`),
  create: (data: Partial<Quote>) => 
    api.post<Quote>('/quotes', data),
};

// ============================================================================
// INVOICE API
// ============================================================================
export const invoiceAPI = {
  list: () => 
    api.get<Invoice[]>('/invoices'),
  get: (id: string) => 
    api.get<Invoice>(`/invoices/${id}`),
  create: (data: Partial<Invoice>) => 
    api.post<Invoice>('/invoices', data),
};

// ============================================================================
// SITE VISIT API
// ============================================================================
export const siteVisitAPI = {
  list: () => 
    api.get<SiteVisit[]>('/site-visits'),
  get: (id: string) => 
    api.get<SiteVisit>(`/site-visits/${id}`),
  create: (data: Partial<SiteVisit>) => 
    api.post<SiteVisit>('/site-visits', data),
  update: (id: string, data: Partial<SiteVisit>) => 
    api.put<SiteVisit>(`/site-visits/${id}`, data),
};

// ============================================================================
// DASHBOARD API
// ============================================================================
export const dashboardAPI = {
  getStats: () => 
    api.get<DashboardStats>('/dashboard/stats'),
};

export default api;
