import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons, SearchInput, Avatar, EmptyState, Modal } from '../../components/ui/Icons';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

interface Task {
  id: string;
  title: string;
  description?: string;
  project_id: string;
  project_name: string;
  stage_name: string;
  assigned_to?: string;
  assigned_to_name?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Lay remaining patio slabs',
    description: 'Complete the remaining 15 sqm of patio slabs in the back garden area',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    stage_name: 'Patio Installation',
    assigned_to: 'worker1',
    assigned_to_name: 'John Smith',
    status: 'in_progress',
    priority: 'high',
    due_date: '2025-01-05',
    estimated_hours: 8,
    actual_hours: 4,
    created_at: '2025-01-02',
  },
  {
    id: '2',
    title: 'Install edging stones',
    description: 'Install granite edging stones around the patio perimeter',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    stage_name: 'Patio Installation',
    assigned_to: 'worker1',
    assigned_to_name: 'John Smith',
    status: 'pending',
    priority: 'normal',
    due_date: '2025-01-06',
    estimated_hours: 4,
    created_at: '2025-01-02',
  },
  {
    id: '3',
    title: 'Point patio joints',
    description: 'Apply jointing compound to all patio slab joints',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    stage_name: 'Patio Installation',
    assigned_to: 'worker2',
    assigned_to_name: 'Tom Brown',
    status: 'pending',
    priority: 'normal',
    due_date: '2025-01-07',
    estimated_hours: 6,
    created_at: '2025-01-02',
  },
  {
    id: '4',
    title: 'Material delivery - Brown Patio',
    description: 'Receive and check materials delivery for Brown project',
    project_id: '6',
    project_name: 'Brown Patio Extension',
    stage_name: 'Preparation',
    status: 'pending',
    priority: 'high',
    due_date: '2025-01-04',
    created_at: '2025-01-02',
  },
  {
    id: '5',
    title: 'Complete site survey measurements',
    description: 'Take final measurements for the Henderson project',
    project_id: '4',
    project_name: 'Henderson Complete Garden Design',
    stage_name: 'Site Survey',
    assigned_to: 'qs1',
    assigned_to_name: 'Sarah Johnson',
    status: 'completed',
    priority: 'normal',
    due_date: '2025-01-03',
    estimated_hours: 3,
    actual_hours: 3.5,
    created_at: '2024-12-28',
  },
  {
    id: '6',
    title: 'Upload design revision v3',
    description: 'Upload revised design based on client feedback',
    project_id: '4',
    project_name: 'Henderson Complete Garden Design',
    stage_name: 'Design',
    assigned_to: 'designer1',
    assigned_to_name: 'Emma Wilson',
    status: 'in_progress',
    priority: 'high',
    due_date: '2025-01-05',
    estimated_hours: 8,
    actual_hours: 5,
    created_at: '2025-01-02',
  },
  {
    id: '7',
    title: 'Order additional topsoil',
    description: 'Order 5 cubic metres of premium topsoil for lawn area',
    project_id: '1',
    project_name: 'Thompson Garden Renovation',
    stage_name: 'Lawn & Planting',
    assigned_to: 'pm1',
    assigned_to_name: 'Mike Johnson',
    status: 'blocked',
    priority: 'urgent',
    due_date: '2025-01-04',
    created_at: '2025-01-03',
  },
];

const statusConfig: Record<TaskStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  in_progress: { label: 'In Progress', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  completed: { label: 'Completed', color: 'text-sage-700', bgColor: 'bg-sage-100' },
  blocked: { label: 'Blocked', color: 'text-red-700', bgColor: 'bg-red-100' },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-gray-500', bgColor: 'bg-gray-100' },
  normal: { label: 'Normal', color: 'text-sage-600', bgColor: 'bg-sage-50' },
  high: { label: 'High', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-50' },
};

const TasksPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assigned_to_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    blocked: filteredTasks.filter(t => t.status === 'blocked'),
  };

  const stats = {
    total: mockTasks.length,
    pending: mockTasks.filter(t => t.status === 'pending').length,
    inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    overdue: mockTasks.filter(t => new Date(t.due_date) < new Date() && t.status !== 'completed').length,
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const formatDueDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track all project tasks</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
        >
          <Icons.Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-sage-600 to-sage-700 rounded-2xl p-5 text-white shadow-lg shadow-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100 text-sm font-medium">Total Tasks</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icons.ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
              <Icons.Clock className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold text-sage-600 mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl flex items-center justify-center">
              <Icons.Play className="w-6 h-6 text-sage-600" />
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
              <Icons.Check className="w-6 h-6 text-sage-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
              <Icons.AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks, projects, assignees..."
            />
          </div>
          <div className="flex flex-wrap gap-3">
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
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
            >
              <option value="all">All Priorities</option>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Icons.List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-2.5 transition-colors ${viewMode === 'board' ? 'bg-sage-100 text-sage-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Icons.Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12">
          <EmptyState
            icon={<Icons.ClipboardList className="w-12 h-12 text-gray-300" />}
            title="No tasks found"
            description="Try adjusting your search or filter criteria"
            action={
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium mt-4"
              >
                <Icons.Plus className="w-4 h-4" />
                Create a new task
              </button>
            }
          />
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10"></th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due</th>
                  <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTasks.map((task) => {
                  const status = statusConfig[task.status];
                  const priority = priorityConfig[task.priority];
                  const overdue = isOverdue(task.due_date, task.status);
                  
                  return (
                    <tr key={task.id} className="hover:bg-sage-50/30 transition-colors">
                      <td className="py-4 px-5">
                        <button className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          task.status === 'completed' 
                            ? 'bg-sage-500 border-sage-500' 
                            : 'border-gray-300 hover:border-sage-500'
                        }`}>
                          {task.status === 'completed' && <Icons.Check className="w-3 h-3 text-white" />}
                        </button>
                      </td>
                      <td className="py-4 px-5">
                        <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{task.stage_name}</p>
                      </td>
                      <td className="py-4 px-5">
                        <Link 
                          to={`/projects/${task.project_id}`}
                          className="text-gray-700 hover:text-sage-600 transition-colors"
                        >
                          {task.project_name}
                        </Link>
                      </td>
                      <td className="py-4 px-5">
                        {task.assigned_to_name ? (
                          <div className="flex items-center gap-2">
                            <Avatar name={task.assigned_to_name} size="sm" />
                            <span className="text-gray-700">{task.assigned_to_name}</span>
                          </div>
                        ) : (
                          <span className="text-amber-600 text-sm font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatDueDate(task.due_date)}
                          {overdue && <span className="ml-1 text-xs">(Overdue)</span>}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <button className="p-2 hover:bg-sage-100 rounded-lg transition-colors">
                          <Icons.MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(tasksByStatus).map(([status, tasks]) => {
            const config = statusConfig[status as TaskStatus];
            return (
              <div key={status} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status === 'completed' || status === 'in_progress' ? 'bg-sage-500' : status === 'blocked' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                    <h3 className="font-semibold text-gray-700">{config.label}</h3>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">{tasks.length}</span>
                </div>
                <div className="space-y-3">
                  {tasks.map((task) => {
                    const priority = priorityConfig[task.priority];
                    const overdue = isOverdue(task.due_date, task.status);
                    
                    return (
                      <div 
                        key={task.id}
                        className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-sage-200 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                            {priority.label}
                          </span>
                          <button className="p-1 hover:bg-sage-100 rounded-lg transition-colors">
                            <Icons.MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{task.title}</h4>
                        <p className="text-sm text-gray-500 mb-4">{task.project_name}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          {task.assigned_to_name ? (
                            <Avatar name={task.assigned_to_name} size="sm" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <Icons.User className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <span className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {formatDueDate(task.due_date)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {tasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                      <Icons.ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No tasks</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task" size="lg">
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Title</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              placeholder="Enter task title" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              rows={3} 
              placeholder="Enter task description" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors">
                <option value="">Select project</option>
                <option value="1">Thompson Garden Renovation</option>
                <option value="4">Henderson Complete Garden Design</option>
                <option value="6">Brown Patio Extension</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors">
                <option value="">Select stage</option>
                <option value="1">Site Preparation</option>
                <option value="2">Patio Installation</option>
                <option value="3">Lawn & Planting</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assignee</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors">
                <option value="">Unassigned</option>
                <option value="worker1">John Smith</option>
                <option value="worker2">Tom Brown</option>
                <option value="pm1">Mike Johnson</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors">
                <option value="normal">Normal</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Hours</label>
              <input 
                type="number" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors" 
                placeholder="0" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksPage;
