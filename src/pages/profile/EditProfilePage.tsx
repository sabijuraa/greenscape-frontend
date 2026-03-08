import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Card, Icons, Avatar, Modal } from '../../components/ui/Icons';

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  companyName: string;
  location: string;
  website: string;
  linkedIn: string;
  skills: string[];
  experience: string;
  availability: 'full_time' | 'part_time' | 'contract' | 'unavailable';
  avatar: string | null;
}

const skillOptions = [
  'Garden Design', 'Paving & Patios', 'Fencing', 'Decking', 'Turfing',
  'Planting', 'Irrigation', 'Drainage', 'Lighting', 'Water Features',
  'Retaining Walls', 'Driveways', 'Tree Surgery', 'Lawn Care', 'Hard Landscaping',
  'Soft Landscaping', 'Project Management', 'CAD Design', '3D Visualization',
  'Cost Estimation', 'Site Surveying', 'Client Relations'
];

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'professional' | 'social'>('personal');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    companyName: '',
    location: '',
    website: '',
    linkedIn: '',
    skills: [],
    experience: '',
    availability: 'full_time',
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        bio: (user as any).bio || '',
        companyName: (user as any).company_name || '',
        location: (user as any).location || '',
        website: (user as any).website || '',
        linkedIn: (user as any).linkedIn || '',
        skills: (user as any).skills || [],
        experience: (user as any).experience || '',
        availability: (user as any).availability || 'full_time',
        avatar: user.avatar_url || null,
      });
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile in store
      const updatedUser = {
        ...user,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        company_name: formData.companyName,
        location: formData.location,
        website: formData.website,
        linkedIn: formData.linkedIn,
        skills: formData.skills,
        experience: formData.experience,
        availability: formData.availability,
        avatar_url: formData.avatar || undefined,
      };
      
      updateProfile(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In production, this would call an API to delete the account
    localStorage.clear();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500 mt-1">Update your personal and professional information</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 disabled:bg-sage-300 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Icons.Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="bg-sage-100 border border-sage-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center">
            <Icons.Check className="w-4 h-4 text-white" />
          </div>
          <p className="text-sage-800 font-medium">Profile updated successfully!</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            {/* Profile Preview */}
            <div className="text-center mb-6 pb-6 border-b border-gray-100">
              <div 
                onClick={handleAvatarClick}
                className="relative w-24 h-24 mx-auto cursor-pointer group"
              >
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-sage-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-sage-100 flex items-center justify-center border-4 border-sage-50">
                    <Avatar name={formData.fullName || 'User'} size="lg" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Icons.Camera className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center border-2 border-white">
                  <Icons.Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {formData.avatar && (
                <button
                  onClick={removeAvatar}
                  className="text-sm text-red-600 hover:text-red-700 mt-2"
                >
                  Remove photo
                </button>
              )}
              <p className="font-semibold text-gray-900 mt-3">{formData.fullName || 'Your Name'}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
            </div>

            {/* Section Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSection('personal')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'personal' ? 'bg-sage-100 text-sage-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icons.User className="w-5 h-5" />
                Personal Info
              </button>
              <button
                onClick={() => setActiveSection('professional')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'professional' ? 'bg-sage-100 text-sage-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icons.Briefcase className="w-5 h-5" />
                Professional
              </button>
              <button
                onClick={() => setActiveSection('social')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'social' ? 'bg-sage-100 text-sage-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icons.Link className="w-5 h-5" />
                Social & Links
              </button>
            </nav>
          </Card>

          {/* Profile Completeness */}
          <Card className="mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Profile Strength</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completeness</span>
                <span className="font-medium text-sage-600">
                  {Math.round(
                    ([
                      formData.fullName,
                      formData.email,
                      formData.phone,
                      formData.bio,
                      formData.location,
                      formData.avatar,
                      formData.skills.length > 0,
                      formData.experience,
                    ].filter(Boolean).length / 8) * 100
                  )}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sage-500 rounded-full transition-all"
                  style={{
                    width: `${([
                      formData.fullName,
                      formData.email,
                      formData.phone,
                      formData.bio,
                      formData.location,
                      formData.avatar,
                      formData.skills.length > 0,
                      formData.experience,
                    ].filter(Boolean).length / 8) * 100}%`
                  }}
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {!formData.avatar && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Add a profile photo
                </p>
              )}
              {!formData.bio && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Write a short bio
                </p>
              )}
              {formData.skills.length === 0 && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Add your skills
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            {activeSection === 'personal' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="input"
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="input"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="input"
                        placeholder="+44 7700 900000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="input"
                        placeholder="London, UK"
                      />
                    </div>
                  </div>

                  {(user.role === 'system_owner' || user.role === 'sales_admin') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="input"
                        placeholder="Your Company Ltd"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="input min-h-[120px] resize-none"
                      placeholder="Tell others about yourself, your experience, and what you specialize in..."
                      rows={4}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Professional Information */}
            {activeSection === 'professional' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Professional Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Skills & Expertise
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            formData.skills.includes(skill)
                              ? 'bg-sage-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {formData.skills.length} skills
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Years of Experience
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="input"
                    >
                      <option value="">Select experience level</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Availability
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 'full_time', label: 'Full Time', icon: '⏰' },
                        { value: 'part_time', label: 'Part Time', icon: '🕐' },
                        { value: 'contract', label: 'Contract', icon: '📝' },
                        { value: 'unavailable', label: 'Not Available', icon: '🚫' },
                      ].map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.availability === option.value
                              ? 'border-sage-600 bg-sage-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="availability"
                            value={option.value}
                            checked={formData.availability === option.value}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              availability: e.target.value as ProfileData['availability']
                            }))}
                            className="hidden"
                          />
                          <span className="text-lg">{option.icon}</span>
                          <span className="font-medium text-gray-900 text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Social & Links */}
            {activeSection === 'social' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Social & Links</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                        className="input pl-10"
                        placeholder="https://yoursite.com"
                      />
                      <Icons.ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={formData.linkedIn}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                        className="input pl-10"
                        placeholder="linkedin.com/in/yourname"
                      />
                      <Icons.Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </Card>
            )}
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Icons.AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-center text-gray-600">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
          </p>
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Yes, Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditProfilePage;