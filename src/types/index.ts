// ============================================================================
// TYPES - Updated for New Workflow System
// ============================================================================

// USER ROLES - Updated
export type UserRole = 
  | 'surveyor' 
  | 'designer' 
  | 'admin_sales' 
  | 'project_manager' 
  | 'owner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// PROJECT STATUS - Updated Workflow
export type ProjectStatus =
  | 'survey_pending'
  | 'survey_completed'
  | 'design_in_progress'
  | 'design_completed'
  | 'quote_pending'
  | 'quote_sent'
  | 'quote_accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  total_price?: number;
  created_by: string;
  surveyor_id?: string;
  designer_id?: string;
  project_manager_id?: string;
  created_at: string;
  updated_at: string;
}

// PHOTO
export interface Photo {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  related_to: 'project' | 'site_visit' | 'receipt' | 'design';
  related_id: string;
  description?: string;
  created_at: string;
}

// MEASUREMENT
export interface Measurement {
  id: string;
  project_id: string;
  site_visit_id?: string;
  surveyor_id: string;
  area_name: string;
  length?: number;
  width?: number;
  area: number;
  preferred_material?: string;
  notes?: string;
  created_at: string;
}

export interface CreateMeasurementRequest {
  project_id: string;
  site_visit_id?: string;
  area_name: string;
  length?: number;
  width?: number;
  area: number;
  preferred_material?: string;
  notes?: string;
}

// DESIGN AREA
export interface DesignArea {
  id: string;
  project_id: string;
  section_name: string;
  area_size: number;
  material_type: string;
  quantity_needed: number;
  unit: string;
  notes?: string;
}

export interface CreateDesignAreaRequest {
  project_id: string;
  section_name: string;
  area_size: number;
  material_type: string;
  quantity_needed: number;
  unit: string;
  notes?: string;
}

// EXPENSE
export interface Expense {
  id: string;
  project_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  amount_spent: number;
  receipt_photo_id?: string;
  notes?: string;
  purchased_by: string;
  purchased_at: string;
}

export interface ExpenseSummary {
  total_spent: number;
  expenses: Expense[];
}

export interface CreateExpenseRequest {
  project_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  amount_spent: number;
  receipt_photo_id?: string;
  notes?: string;
}

// AUTH
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// MATERIAL
export interface Material {
  id: string;
  name: string;
  unit: string;
  price_per_unit: number;
  stock_quantity?: number;
  supplier?: string;
  visible_to_roles: string[];
  created_at: string;
}

// QUOTE
export interface Quote {
  id: string;
  project_id: string;
  total_amount: number;
  status: string;
  valid_until?: string;
  notes?: string;
  is_manual: boolean;
  created_by?: string;
  created_at: string;
}

// INVOICE
export interface Invoice {
  id: string;
  project_id: string;
  invoice_number: string;
  amount: number;
  due_date?: string;
  payment_status: string;
  created_at: string;
}

// TASK
export interface Task {
  id: string;
  project_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  due_date?: string;
  created_at: string;
}

// SITE VISIT
export interface SiteVisit {
  id: string;
  project_id: string;
  surveyor_id?: string;
  visit_date: string;
  visit_time?: string;
  notes?: string;
  measurements?: any;
  material_preferences?: any;
  status: string;
  created_by: string;
  created_at: string;
}

// DASHBOARD STATS
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  pending_quotes: number;
  total_revenue: number;
}

// HELPER FUNCTIONS
export function canSeePricing(role: UserRole): boolean {
  return role === 'admin_sales' || role === 'owner';
}

export function canSeeTotalProjectCost(role: UserRole): boolean {
  return role === 'admin_sales' || role === 'owner';
}

export function canCreateQuotes(role: UserRole): boolean {
  return role === 'admin_sales' || role === 'owner';
}

export function canManageProjects(role: UserRole): boolean {
  return role === 'admin_sales' || role === 'owner' || role === 'project_manager';
}
