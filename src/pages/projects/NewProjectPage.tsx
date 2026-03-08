import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons } from '../../components/ui/Icons';

interface ProjectFormData {
  name: string;
  description: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  postcode: string;
  area_sqm: string;
  estimated_start_date: string;
  estimated_end_date: string;
  country_code: string;
}

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    address: '',
    postcode: '',
    area_sqm: '',
    estimated_start_date: '',
    estimated_end_date: '',
    country_code: 'GBR',
  });

  const updateField = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }
    if (formData.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.client_email)) {
      newErrors.client_email = 'Invalid email format';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.area_sqm || parseFloat(formData.area_sqm) <= 0) {
      newErrors.area_sqm = 'Valid area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // API call would go here
      // await api.createProject(formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to projects list on success
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/projects"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icons.ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
          <p className="text-gray-500 mt-1">Add a new landscaping project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Details */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`input ${errors.name ? 'border-red-300' : ''}`}
                placeholder="e.g., Smith Garden Renovation"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="input min-h-[100px]"
                placeholder="Brief description of the project scope..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (sqm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.area_sqm}
                  onChange={(e) => updateField('area_sqm', e.target.value)}
                  className={`input ${errors.area_sqm ? 'border-red-300' : ''}`}
                  placeholder="0"
                  min="1"
                  step="0.1"
                />
                {errors.area_sqm && <p className="text-sm text-red-600 mt-1">{errors.area_sqm}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={formData.country_code}
                  onChange={(e) => updateField('country_code', e.target.value)}
                  className="input"
                >
                  <option value="GBR">United Kingdom</option>
                  <option value="USA">United States</option>
                  <option value="AUS">Australia</option>
                  <option value="CAN">Canada</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => updateField('client_name', e.target.value)}
                  className={`input pl-10 ${errors.client_name ? 'border-red-300' : ''}`}
                  placeholder="Full name"
                />
                <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.client_name && <p className="text-sm text-red-600 mt-1">{errors.client_name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => updateField('client_email', e.target.value)}
                    className={`input pl-10 ${errors.client_email ? 'border-red-300' : ''}`}
                    placeholder="client@email.com"
                  />
                  <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.client_email && <p className="text-sm text-red-600 mt-1">{errors.client_email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => updateField('client_phone', e.target.value)}
                    className="input pl-10"
                    placeholder="+44 7700 900000"
                  />
                  <Icons.Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Location */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Location</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className={`input pl-10 ${errors.address ? 'border-red-300' : ''}`}
                  placeholder="Full street address"
                />
                <Icons.MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => updateField('postcode', e.target.value.toUpperCase())}
                className="input"
                placeholder="SW1A 1AA"
              />
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimated Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.estimated_start_date}
                  onChange={(e) => updateField('estimated_start_date', e.target.value)}
                  className="input pl-10"
                />
                <Icons.Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.estimated_end_date}
                  onChange={(e) => updateField('estimated_end_date', e.target.value)}
                  className="input pl-10"
                  min={formData.estimated_start_date}
                />
                <Icons.Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to="/projects"
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
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPage;
