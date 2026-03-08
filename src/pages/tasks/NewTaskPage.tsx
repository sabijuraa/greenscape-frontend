import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Icons } from '../../components/ui/Icons';

interface TaskFormData {
  title: string;
  description: string;
  instructions: string;
  project_id: string;
  stage_id: string;
  assigned_to: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  due_date: string;
  estimated_hours: string;
}

const mockProjects = [
  { id: '1', name: 'Thompson Garden Renovation', stages: [
    { id: 's1', name: 'Ground Preparation' },
    { id: 's2', name: 'Patio Installation' },
    { id: 's3', name: 'Planting' },
  ]},
  { id: '2', name: 'Mitchell Patio Installation', stages: [
    { id: 's4', name: 'Excavation' },
    { id: 's5', name: 'Base Layer' },
  ]},
];

const mockWorkers = [
  { id: 'w1', name: 'John Smith', role: 'worker' },
  { id: 'w2', name: 'Mike Johnson', role: 'worker' },
  { id: 'w3', name: 'Sarah Williams', role: 'project_manager' },
];

const NewTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    instructions: '',
    project_id: '',
    stage_id: '',
    assigned_to: '',
    priority: 'normal',
    due_date: '',
    estimated_hours: '',
  });

  const selectedProject = mockProjects.find(p => p.id === formData.project_id);

  const updateField = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Reset stage when project changes
    if (field === 'project_id') {
      setFormData(prev => ({ ...prev, stage_id: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/tasks');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-700' },
    { value: 'high', label: 'High', color: 'bg-amber-100 text-amber-700' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/tasks"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-500 mt-1">Add a task to a project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`input ${errors.title ? 'border-red-300' : ''}`}
                placeholder="e.g., Lay patio slabs in back garden"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="input min-h-[80px]"
                placeholder="Brief description of what needs to be done..."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions for Worker
              </label>
              <textarea
                value={formData.instructions}
                onChange={(e) => updateField('instructions', e.target.value)}
                className="input min-h-[100px]"
                placeholder="Step-by-step instructions..."
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">These instructions will be visible to the assigned worker</p>
            </div>
          </div>
        </Card>

        {/* Project & Stage */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project & Stage</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.project_id}
                onChange={(e) => updateField('project_id', e.target.value)}
                className={`input ${errors.project_id ? 'border-red-300' : ''}`}
              >
                <option value="">Select a project</option>
                {mockProjects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              {errors.project_id && <p className="text-sm text-red-600 mt-1">{errors.project_id}</p>}
            </div>

            {selectedProject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={formData.stage_id}
                  onChange={(e) => updateField('stage_id', e.target.value)}
                  className="input"
                >
                  <option value="">No specific stage</option>
                  {selectedProject.stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* Assignment & Priority */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment & Priority</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To
              </label>
              <select
                value={formData.assigned_to}
                onChange={(e) => updateField('assigned_to', e.target.value)}
                className="input"
              >
                <option value="">Unassigned</option>
                {mockWorkers.map(worker => (
                  <option key={worker.id} value={worker.id}>{worker.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                {priorityOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('priority', option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.priority === option.value
                        ? `${option.color} ring-2 ring-offset-2 ring-gray-400`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => updateField('due_date', e.target.value)}
                    className="input pl-10"
                  />
                  <Icons.Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Hours
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.estimated_hours}
                    onChange={(e) => updateField('estimated_hours', e.target.value)}
                    className="input pl-10"
                    placeholder="0"
                    min="0"
                    step="0.5"
                  />
                  <Icons.Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to="/tasks"
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors disabled:bg-sage-300 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <Icons.Plus className="w-5 h-5" />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskPage;
