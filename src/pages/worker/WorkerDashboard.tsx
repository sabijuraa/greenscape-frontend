import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, Modal } from '../../components/ui/Icons';
import type { Task } from '../../types';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Helper for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('greenscape-token');
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error('API call failed');
  return response.json();
};

interface WorkerStats {
  assigned: number;
  completed_today: number;
  pending: number;
  overdue: number;
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-gray-600', bgColor: 'bg-gray-100', dotColor: 'bg-gray-400' },
  normal: { label: 'Normal', color: 'text-blue-600', bgColor: 'bg-blue-100', dotColor: 'bg-blue-500' },
  high: { label: 'High', color: 'text-amber-600', bgColor: 'bg-amber-100', dotColor: 'bg-amber-500' },
  urgent: { label: 'Urgent', color: 'text-red-600', bgColor: 'bg-red-100', dotColor: 'bg-red-500' },
};

const WorkerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<WorkerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksRes, statsRes] = await Promise.allSettled([
          apiCall('/tasks/today'),
          apiCall('/dashboard/worker-stats'),
        ]);

        if (tasksRes.status === 'fulfilled') {
          setTasks(tasksRes.value.tasks || tasksRes.value || []);
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await apiCall(`/tasks/${taskId}/complete`, { method: 'POST' });
      // Refresh tasks
      const tasksRes = await apiCall('/tasks/today');
      setTasks(tasksRes.tasks || tasksRes || []);
      setShowTaskModal(false);
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.full_name?.split(' ')[0]}
        </h1>
        <p className="text-gray-500 mt-1">Here are your tasks for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-1">{inProgressTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Icons.Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Icons.ClipboardList className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{stats?.completed_today || completedTasks.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Icons.Check className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Task */}
      {inProgressTasks.length > 0 && inProgressTasks.map(task => {
        const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.normal;
        return (
          <div key={task.id} className="bg-white rounded-2xl border-l-4 border-l-gray-900 border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></span>
                    Currently Working On
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mt-3">{task.title}</h2>
                  <p className="text-gray-500 mt-1">{task.project_name}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${priority.bgColor} ${priority.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dotColor}`}></span>
                  {priority.label}
                </span>
              </div>
              
              {task.description && (
                <p className="text-gray-600 mb-4">{task.description}</p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {task.estimated_hours && (
                    <span className="flex items-center gap-1.5">
                      <Icons.Clock className="w-4 h-4" />
                      {task.estimated_hours}h estimated
                    </span>
                  )}
                  {task.due_date && (
                    <span className="flex items-center gap-1.5">
                      <Icons.Calendar className="w-4 h-4" />
                      Due {formatDate(task.due_date)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTaskClick(task)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleCompleteTask(task.id)}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* No current task */}
      {inProgressTasks.length === 0 && pendingTasks.length > 0 && (
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icons.ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No task in progress</h3>
          <p className="text-gray-500 text-sm">Start a task from the list below</p>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">All Tasks</h3>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icons.Check className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No tasks assigned</h3>
            <p className="text-gray-500 text-sm">You don't have any tasks for today</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map(task => {
              const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.normal;
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all ${
                    task.status === 'completed' ? 'bg-gray-50 opacity-60' :
                    task.status === 'in_progress' ? 'bg-gray-50 border-l-4 border-l-gray-900' :
                    'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                    task.status === 'in_progress' ? 'border-gray-900 bg-gray-900' :
                    'border-gray-300'
                  }`}>
                    {task.status === 'completed' && <Icons.Check className="w-4 h-4 text-white" />}
                    {task.status === 'in_progress' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.project_name}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${priority.dotColor}`} title={priority.label} />
                  {task.due_date && (
                    <span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(task.due_date)}</span>
                  )}
                  <Icons.ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 text-left"
          >
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
              <Icons.Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 block">Request Materials</span>
              <span className="text-sm text-gray-500">Need supplies for a task</span>
            </div>
          </button>
          <Link
            to="/tasks"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <Icons.ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900 block">View All Tasks</span>
              <span className="text-sm text-gray-500">See your full task list</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Task Details"
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  (priorityConfig[selectedTask.priority as keyof typeof priorityConfig] || priorityConfig.normal).bgColor
                } ${
                  (priorityConfig[selectedTask.priority as keyof typeof priorityConfig] || priorityConfig.normal).color
                }`}>
                  {(priorityConfig[selectedTask.priority as keyof typeof priorityConfig] || priorityConfig.normal).label} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedTask.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  selectedTask.status === 'in_progress' ? 'bg-gray-900 text-white' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedTask.status === 'in_progress' ? 'In Progress' : selectedTask.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{selectedTask.title}</h3>
              <p className="text-gray-500 mt-1">{selectedTask.project_name}</p>
            </div>

            {selectedTask.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
            )}

            {selectedTask.instructions && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                    {selectedTask.instructions}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
              {selectedTask.estimated_hours && (
                <span className="flex items-center gap-1.5">
                  <Icons.Clock className="w-4 h-4" />
                  {selectedTask.estimated_hours}h estimated
                </span>
              )}
              {selectedTask.due_date && (
                <span className="flex items-center gap-1.5">
                  <Icons.Calendar className="w-4 h-4" />
                  Due {formatDate(selectedTask.due_date)}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              {selectedTask.status === 'pending' && (
                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium transition-colors">
                  Start Task
                </button>
              )}
              {selectedTask.status === 'in_progress' && (
                <button 
                  onClick={() => handleCompleteTask(selectedTask.id)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Material Request Modal */}
      <Modal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="Request Materials"
        size="lg"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project</label>
            <select className="input">
              <option value="">Select project</option>
              {/* Would be populated from API */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Material Name</label>
            <input type="text" className="input" placeholder="e.g., Concrete bags" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <input type="number" className="input" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
              <select className="input">
                <option value="bags">Bags</option>
                <option value="pieces">Pieces</option>
                <option value="meters">Meters</option>
                <option value="sqm">Square Meters</option>
                <option value="tonnes">Tonnes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Urgency</label>
            <select className="input">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical - Work Blocked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
            <textarea className="input" rows={3} placeholder="Why do you need these materials?" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-medium"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkerDashboard;
