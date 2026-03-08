import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Badge, Icons, Avatar, Modal } from '../../components/ui/Icons';
import { ProjectStatus } from '../../types';

// Mock project data
const mockProject = {
  id: '1',
  name: 'Thompson Garden Renovation',
  description: 'Complete garden renovation including new patio, lawn area, planting beds, and outdoor lighting. Client wants a modern, low-maintenance design with space for entertaining.',
  client_name: 'James Thompson',
  client_email: 'james.thompson@email.com',
  client_phone: '07700 900123',
  address: '42 Oak Lane, Richmond, Surrey',
  postcode: 'TW9 2AB',
  area_sqm: 245,
  status: 'in_progress' as ProjectStatus,
  progress_percentage: 65,
  estimated_start_date: '2025-01-02',
  estimated_end_date: '2025-02-15',
  actual_start_date: '2025-01-03',
  created_at: '2024-12-15',
  assigned_qs: 'Sarah Johnson',
  assigned_designer: 'Emma Wilson',
  assigned_pm: 'Mike Johnson',
  quote_total: 28500,
  deposit_paid: 8550,
  amount_invoiced: 14250,
  amount_paid: 14250,
};

const mockStages = [
  { id: '1', name: 'Site Preparation', order_index: 1, status: 'completed' as const, estimated_hours: 16, actual_hours: 18 },
  { id: '2', name: 'Groundwork & Drainage', order_index: 2, status: 'completed' as const, estimated_hours: 24, actual_hours: 22 },
  { id: '3', name: 'Patio Installation', order_index: 3, status: 'in_progress' as const, estimated_hours: 32, actual_hours: 20 },
  { id: '4', name: 'Lawn & Planting', order_index: 4, status: 'pending' as const, estimated_hours: 20, actual_hours: 0 },
  { id: '5', name: 'Lighting & Finishing', order_index: 5, status: 'pending' as const, estimated_hours: 12, actual_hours: 0 },
];

const mockTasks = [
  { id: '1', title: 'Lay remaining patio slabs', stage: 'Patio Installation', assigned_to: 'John Smith', due_date: '2025-01-05', status: 'in_progress', priority: 'high' },
  { id: '2', title: 'Install edging stones', stage: 'Patio Installation', assigned_to: 'John Smith', due_date: '2025-01-06', status: 'pending', priority: 'medium' },
  { id: '3', title: 'Point patio joints', stage: 'Patio Installation', assigned_to: 'Tom Brown', due_date: '2025-01-07', status: 'pending', priority: 'medium' },
  { id: '4', title: 'Prepare lawn area', stage: 'Lawn & Planting', assigned_to: null, due_date: '2025-01-10', status: 'pending', priority: 'normal' },
];

const mockDocuments = [
  { id: '1', name: 'Site Survey Photos', type: 'site_photo_before', uploaded_at: '2024-12-16', uploaded_by: 'Sarah Johnson' },
  { id: '2', name: 'Design Concept v2', type: 'design_file', uploaded_at: '2024-12-20', uploaded_by: 'Emma Wilson' },
  { id: '3', name: 'Signed Quote', type: 'contract', uploaded_at: '2024-12-22', uploaded_by: 'Sarah Johnson' },
  { id: '4', name: 'Progress Photos Week 1', type: 'site_photo_during', uploaded_at: '2025-01-03', uploaded_by: 'Mike Johnson' },
];

const mockActivity = [
  { id: '1', type: 'task_completed', description: 'Drainage system installed', user: 'John Smith', time: '2 hours ago' },
  { id: '2', type: 'payment', description: 'Stage payment of £5,700 received', user: 'System', time: '1 day ago' },
  { id: '3', type: 'photo', description: 'Added 4 progress photos', user: 'Mike Johnson', time: '1 day ago' },
  { id: '4', type: 'note', description: 'Client requested slight change to patio pattern', user: 'Mike Johnson', time: '2 days ago' },
];

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  site_visit: { label: 'Site Visit', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  measuring: { label: 'Measuring', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  designing: { label: 'Designing', color: 'text-pink-700', bgColor: 'bg-pink-100' },
  design_review: { label: 'Design Review', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  quoted: { label: 'Quoted', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  approved: { label: 'Approved', color: 'text-lime-700', bgColor: 'bg-lime-100' },
  deposit_paid: { label: 'Deposit Paid', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  in_progress: { label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  snagging: { label: 'Snagging', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  completed: { label: 'Completed', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  signed_off: { label: 'Signed Off', color: 'text-green-700', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'stages' | 'tasks' | 'documents' | 'financials'>('overview');

  const canViewFinancials = user?.role === 'system_owner' || user?.role === 'quantity_surveyor' || user?.role === 'project_manager';
  const canViewProfit = user?.role === 'system_owner';
  const status = statusConfig[mockProject.status];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Icons.Eye },
    { id: 'stages', label: 'Stages', icon: Icons.Layers },
    { id: 'tasks', label: 'Tasks', icon: Icons.ClipboardList },
    { id: 'documents', label: 'Documents', icon: Icons.FileText },
    ...(canViewFinancials ? [{ id: 'financials', label: 'Financials', icon: Icons.Pound }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/projects" className="text-gray-500 hover:text-sage-600">Projects</Link>
        <Icons.ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">{mockProject.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">{mockProject.name}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-gray-500">{mockProject.address}, {mockProject.postcode}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Icons.Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors">
            <Icons.Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-sage-600 to-sage-700 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-sage-100 text-sm mb-1">Overall Progress</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold">{mockProject.progress_percentage}%</span>
              <span className="text-sage-200 text-sm mb-1">complete</span>
            </div>
            <div className="mt-3 h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${mockProject.progress_percentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center">
              <p className="text-sage-200 text-sm">Area</p>
              <p className="text-2xl font-bold">{mockProject.area_sqm}m²</p>
            </div>
            <div className="text-center">
              <p className="text-sage-200 text-sm">Started</p>
              <p className="text-2xl font-bold">{new Date(mockProject.actual_start_date!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
            </div>
            <div className="text-center">
              <p className="text-sage-200 text-sm">Due</p>
              <p className="text-2xl font-bold">{new Date(mockProject.estimated_end_date!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-sage-600 text-sage-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Project Description</h3>
              <p className="text-gray-600 leading-relaxed">{mockProject.description}</p>
            </Card>

            {/* Stages Overview */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Project Stages</h3>
                <button 
                  onClick={() => setActiveTab('stages')}
                  className="text-sm text-sage-600 hover:text-sage-700 font-medium"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {mockStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stage.status === 'completed' ? 'bg-sage-100 text-sage-700' :
                      stage.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {stage.status === 'completed' ? (
                        <Icons.Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${stage.status === 'completed' ? 'text-gray-500' : 'text-gray-900'}`}>
                        {stage.name}
                      </p>
                    </div>
                    <span className={`text-sm ${
                      stage.status === 'completed' ? 'text-sage-600' :
                      stage.status === 'in_progress' ? 'text-blue-600' :
                      'text-gray-400'
                    }`}>
                      {stage.status === 'completed' ? 'Completed' :
                       stage.status === 'in_progress' ? 'In Progress' :
                       'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'task_completed' ? 'bg-sage-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      activity.type === 'photo' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'task_completed' && <Icons.Check className="w-4 h-4 text-sage-600" />}
                      {activity.type === 'payment' && <Icons.Pound className="w-4 h-4 text-green-600" />}
                      {activity.type === 'photo' && <Icons.Camera className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'note' && <Icons.FileText className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name={mockProject.client_name} size="lg" />
                  <div>
                    <p className="font-medium text-gray-900">{mockProject.client_name}</p>
                    <p className="text-sm text-gray-500">Client</p>
                  </div>
                </div>
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <a href={`tel:${mockProject.client_phone}`} className="flex items-center gap-3 text-gray-600 hover:text-sage-600">
                    <Icons.Phone className="w-4 h-4" />
                    {mockProject.client_phone}
                  </a>
                  <a href={`mailto:${mockProject.client_email}`} className="flex items-center gap-3 text-gray-600 hover:text-sage-600">
                    <Icons.Mail className="w-4 h-4" />
                    {mockProject.client_email}
                  </a>
                  <div className="flex items-start gap-3 text-gray-600">
                    <Icons.MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{mockProject.address}, {mockProject.postcode}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Project Team</h3>
              <div className="space-y-3">
                {mockProject.assigned_pm && (
                  <div className="flex items-center gap-3">
                    <Avatar name={mockProject.assigned_pm} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{mockProject.assigned_pm}</p>
                      <p className="text-xs text-gray-500">Project Manager</p>
                    </div>
                  </div>
                )}
                {mockProject.assigned_qs && (
                  <div className="flex items-center gap-3">
                    <Avatar name={mockProject.assigned_qs} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{mockProject.assigned_qs}</p>
                      <p className="text-xs text-gray-500">Quantity Surveyor</p>
                    </div>
                  </div>
                )}
                {mockProject.assigned_designer && (
                  <div className="flex items-center gap-3">
                    <Avatar name={mockProject.assigned_designer} size="sm" />
                    <div>
                      <p className="font-medium text-gray-900">{mockProject.assigned_designer}</p>
                      <p className="text-xs text-gray-500">Designer</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            {canViewFinancials && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quote Total</span>
                    <span className="font-medium text-gray-900">£{mockProject.quote_total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deposit Paid</span>
                    <span className="font-medium text-green-600">£{mockProject.deposit_paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Invoiced</span>
                    <span className="font-medium text-gray-900">£{mockProject.amount_invoiced.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Received</span>
                    <span className="font-medium text-green-600">£{mockProject.amount_paid.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="text-gray-700 font-medium">Outstanding</span>
                    <span className="font-semibold text-amber-600">
                      £{(mockProject.quote_total - mockProject.amount_paid).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stages' && (
        <div className="space-y-4">
          {mockStages.map((stage, index) => (
            <Card key={stage.id}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                  stage.status === 'completed' ? 'bg-sage-100 text-sage-700' :
                  stage.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {stage.status === 'completed' ? (
                    <Icons.Check className="w-6 h-6" />
                  ) : (
                    stage.order_index
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      stage.status === 'completed' ? 'bg-sage-100 text-sage-700' :
                      stage.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {stage.status === 'completed' ? 'Completed' :
                       stage.status === 'in_progress' ? 'In Progress' :
                       'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Est: {stage.estimated_hours}h</span>
                    <span>Actual: {stage.actual_hours}h</span>
                    {stage.status === 'in_progress' && (
                      <span className="text-blue-600">
                        {Math.round((stage.actual_hours / stage.estimated_hours) * 100)}% time used
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg text-sm font-medium">All</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Pending</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">In Progress</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Completed</button>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium hover:bg-sage-700">
              <Icons.Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
          
          {mockTasks.map((task) => (
            <Card key={task.id}>
              <div className="flex items-start gap-4">
                <button className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 ${
                  task.status === 'completed' ? 'bg-sage-500 border-sage-500' : 'border-gray-300 hover:border-sage-500'
                }`}>
                  {task.status === 'completed' && <Icons.Check className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{task.stage}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    {task.assigned_to ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assigned_to} size="sm" />
                        <span>{task.assigned_to}</span>
                      </div>
                    ) : (
                      <span className="text-amber-600">Unassigned</span>
                    )}
                    <span>Due: {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sage-100 text-sage-700 rounded-lg text-sm font-medium">All</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Photos</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Designs</button>
              <button className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium">Contracts</button>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-sage-600 text-white rounded-lg text-sm font-medium hover:bg-sage-700">
              <Icons.Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          <Card>
            <div className="divide-y divide-gray-100">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.type.includes('photo') ? 'bg-blue-100' :
                    doc.type === 'design_file' ? 'bg-pink-100' :
                    'bg-gray-100'
                  }`}>
                    {doc.type.includes('photo') ? <Icons.Image className="w-5 h-5 text-blue-600" /> :
                     doc.type === 'design_file' ? <Icons.Layers className="w-5 h-5 text-pink-600" /> :
                     <Icons.FileText className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {doc.uploaded_by} • {new Date(doc.uploaded_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Icons.Download className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'financials' && canViewFinancials && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Quote Total</span>
                <span className="text-xl font-semibold text-gray-900">£{mockProject.quote_total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Deposit (30%)</span>
                <span className="font-medium text-green-600">£{mockProject.deposit_paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Stage Payment 1</span>
                <span className="font-medium text-green-600">£5,700</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Stage Payment 2</span>
                <span className="font-medium text-gray-400">£5,700 (pending)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Final Payment</span>
                <span className="font-medium text-gray-400">£8,550 (pending)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-gray-100">
                <span className="font-medium text-gray-700">Outstanding Balance</span>
                <span className="text-xl font-semibold text-amber-600">
                  £{(mockProject.quote_total - mockProject.amount_paid).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {canViewProfit && (
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Cost Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Estimated Costs</span>
                  <span className="text-xl font-semibold text-gray-900">£18,200</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Materials</span>
                  <span className="font-medium text-gray-700">£9,800</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Labour</span>
                  <span className="font-medium text-gray-700">£7,200</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Plant & Equipment</span>
                  <span className="font-medium text-gray-700">£1,200</span>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Projected Profit</span>
                  <span className="text-xl font-semibold text-green-600">£10,300</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Profit Margin</span>
                  <span className="font-medium text-green-600">36.1%</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;