import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons, Avatar } from '../../components/ui/Icons';
import { useAuthStore } from '../../context/authStore';

interface ProfileSetupData {
  avatar: string | null;
  avatarFile: File | null;
  skills: string[];
  experience: string;
  location: string;
  website: string;
  linkedIn: string;
  availability: 'full_time' | 'part_time' | 'contract' | 'unavailable';
}

const skillOptions = [
  'Garden Design', 'Paving & Patios', 'Fencing', 'Decking', 'Turfing',
  'Planting', 'Irrigation', 'Drainage', 'Lighting', 'Water Features',
  'Retaining Walls', 'Driveways', 'Tree Surgery', 'Lawn Care', 'Hard Landscaping',
  'Soft Landscaping', 'Project Management', 'CAD Design', '3D Visualization',
  'Cost Estimation', 'Site Surveying', 'Client Relations'
];

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading: authLoading, error: authError } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProfileSetupData>({
    avatar: null,
    avatarFile: null,
    skills: [],
    experience: '',
    location: '',
    website: '',
    linkedIn: '',
    availability: 'full_time',
  });

  useEffect(() => {
    const pending = localStorage.getItem('pendingRegistration');
    if (pending) {
      setPendingUser(JSON.parse(pending));
    } else {
      // No pending registration, redirect to register
      navigate('/register');
    }
  }, [navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: event.target?.result as string,
          avatarFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSkip = async () => {
    await completeRegistration();
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    await completeRegistration();
  };

  const completeRegistration = async () => {
    if (!pendingUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the register API with all user data
      await register({
        email: pendingUser.email,
        password: pendingUser.password,
        full_name: pendingUser.fullName,
        role: pendingUser.role,
        phone: pendingUser.phone,
        company_name: pendingUser.companyName,
        bio: pendingUser.bio,
        avatar_url: formData.avatar || undefined,
        skills: formData.skills,
        experience: formData.experience,
        location: formData.location,
        website: formData.website,
        linkedin: formData.linkedIn,
        availability: formData.availability,
      });
      
      // Clear pending registration
      localStorage.removeItem('pendingRegistration');
      
      // Navigate to dashboard - DashboardSelector will show role-appropriate dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      // If backend is not available, use demo mode for testing
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        
        // Create demo user directly in localStorage for testing
        const demoUser = {
          id: crypto.randomUUID(),
          email: pendingUser.email,
          full_name: pendingUser.fullName,
          role: pendingUser.role,
          phone: pendingUser.phone,
          company_name: pendingUser.companyName,
          bio: pendingUser.bio,
          avatar_url: formData.avatar,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        
        const demoToken = 'demo-token-' + Date.now();
        
        // Store in localStorage (zustand persist will pick this up)
        localStorage.setItem('greenscape-token', demoToken);
        localStorage.setItem('greenscape-auth', JSON.stringify({
          state: { user: demoUser, token: demoToken },
          version: 0
        }));
        
        // Clear pending registration
        localStorage.removeItem('pendingRegistration');
        
        // Force page reload to pick up new auth state
        window.location.href = '/dashboard';
        return;
      }
      
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (!pendingUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
              <Icons.Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GreenScape</span>
          </Link>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          {/* Success Banner */}
          <div className="bg-sage-100 border border-sage-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Icons.Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sage-900">Account Created Successfully!</p>
              <p className="text-sm text-sage-700">Complete your profile to get the most out of GreenScape</p>
            </div>
          </div>

          {/* Error Display */}
          {(error || authError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icons.X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-900">Registration Failed</p>
                <p className="text-sm text-red-700">{error || authError}</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleComplete}>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Set Up Your Profile</h1>
                <p className="text-gray-500 mt-1">Add a photo and more details to personalize your account</p>
              </div>

              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-8">
                <div 
                  onClick={handleAvatarClick}
                  className="relative cursor-pointer group"
                >
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-sage-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-sage-100 flex items-center justify-center border-4 border-sage-50">
                      <Avatar name={pendingUser.fullName} size="lg" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icons.Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center border-4 border-white">
                    <Icons.Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-sm text-gray-500 mt-3">Click to upload profile photo</p>
                <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
              </div>

              {/* User Info Display */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{pendingUser.fullName}</p>
                    <p className="text-sm text-gray-500">{pendingUser.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-sage-100 text-sage-700 text-sm font-medium rounded-full capitalize">
                    {pendingUser.role.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Skills Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Skills & Expertise
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
              </div>

              {/* Experience */}
              <div className="mb-6">
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

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="input pl-10"
                    placeholder="e.g., London, UK"
                  />
                  <Icons.MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Availability
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'full_time', label: 'Full Time', icon: '⏰' },
                    { value: 'part_time', label: 'Part Time', icon: '🕐' },
                    { value: 'contract', label: 'Contract', icon: '📝' },
                    { value: 'unavailable', label: 'Not Available', icon: '🚫' },
                  ].map(option => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
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
                          availability: e.target.value as ProfileSetupData['availability']
                        }))}
                        className="hidden"
                      />
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="input"
                    placeholder="https://yoursite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                    className="input"
                    placeholder="linkedin.com/in/yourname"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors disabled:bg-sage-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Completing...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <Icons.ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            You can always update your profile later in Settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;