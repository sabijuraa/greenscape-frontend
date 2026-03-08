import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icons } from '../../components/ui/Icons';
import { useAuthStore } from '../../context/authStore';
import type { UserRole } from '../../types';

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  fullName: string;
  phone: string;
  companyName: string;
  bio: string;
  agreedToTerms: boolean;
}

const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
  {
    value: 'system_owner',
    label: 'Business Owner',
    description: 'Full access to manage your landscaping business, team, finances, and all operations',
    icon: '👑',
  },
  {
    value: 'quantity_surveyor',
    label: 'Quantity Surveyor',
    description: 'Conduct site visits, take measurements, create quotes and manage project costs',
    icon: '📐',
  },
  {
    value: 'designer',
    label: 'Designer',
    description: 'Create garden designs, select materials and plants, visualize projects',
    icon: '🎨',
  },
  {
    value: 'project_manager',
    label: 'Project Manager',
    description: 'Manage project stages, assign tasks, coordinate teams and ensure quality',
    icon: '📋',
  },
  {
    value: 'sales_admin',
    label: 'Sales & Admin',
    description: 'Handle enquiries, manage leads, customer communication and scheduling',
    icon: '💼',
  },
  {
    value: 'worker',
    label: 'Worker / Contractor',
    description: 'View assigned tasks, update progress, request materials and log work',
    icon: '🔨',
  },
];

// Get the appropriate dashboard route based on user role
const getDashboardRoute = (role: UserRole): string => {
  // Workers get their own simplified dashboard
  if (role === 'worker') {
    return '/worker-dashboard';
  }
  // All other roles go to the main dashboard
  return '/dashboard';
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    fullName: '',
    phone: '',
    companyName: '',
    bio: '',
    agreedToTerms: false,
  });

  const updateField = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    clearError();
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    if (!formData.role) {
      setErrors({ role: 'Please select a role' });
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    try {
      // Register returns the user directly
      const user = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        role: formData.role as UserRole,
        phone: formData.phone || undefined,
        company_name: formData.companyName || undefined,
        bio: formData.bio || undefined,
      });
      
      
      // Navigate to role-specific dashboard using the returned user
      const dashboardRoute = getDashboardRoute(user.role as UserRole);
      navigate(dashboardRoute, { replace: true });
    } catch (err: any) {
      // Error is handled by the store
      console.error('Registration failed:', err);
    }
  };

  const getPasswordStrength = (): { strength: number; label: string; color: string } => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 2, label: 'Medium', color: 'bg-amber-500' };
    return { strength: 3, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

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
        <div className="w-full max-w-lg">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? 'bg-sage-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s ? <Icons.Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 rounded-full transition-all ${
                        step > s ? 'bg-sage-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-gray-600">
              Step {step} of 3:{' '}
              {step === 1 && 'Create Account'}
              {step === 2 && 'Select Your Role'}
              {step === 3 && 'Complete Profile'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Show API error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
                <Icons.AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                    <p className="text-gray-500 mt-1">Join GreenScape to manage your landscaping business</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={`input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="you@company.com"
                      />
                      <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className={`input pl-10 ${errors.password ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="Create a password (min 6 characters)"
                      />
                      <Icons.Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full ${
                                passwordStrength.strength >= level
                                  ? passwordStrength.color
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          passwordStrength.strength === 1 ? 'text-red-600' :
                          passwordStrength.strength === 2 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.label} password
                        </p>
                      </div>
                    )}
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className={`input pl-10 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <Icons.Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
                  >
                    Continue
                  </button>

                  <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-sage-600 hover:text-sage-700 font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              )}

              {/* Step 2: Role Selection */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">What's Your Role?</h1>
                    <p className="text-gray-500 mt-1">Select the role that best describes what you do</p>
                  </div>

                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.role === role.value
                            ? 'border-sage-600 bg-sage-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={(e) => updateField('role', e.target.value)}
                            className="mt-1 w-4 h-4 text-sage-600 border-gray-300 focus:ring-sage-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{role.icon}</span>
                              <span className="font-semibold text-gray-900">{role.label}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {errors.role && (
                    <p className="text-sm text-red-600 text-center">{errors.role}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Profile Details */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-1">Tell us a bit about yourself</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className={`input pl-10 ${errors.fullName ? 'border-red-300 focus:ring-red-500' : ''}`}
                        placeholder="John Smith"
                      />
                      <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="input pl-10"
                        placeholder="+44 7700 900000"
                      />
                      <Icons.Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {(formData.role === 'system_owner' || formData.role === 'sales_admin') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => updateField('companyName', e.target.value)}
                          className="input pl-10"
                          placeholder="Your Company Ltd"
                        />
                        <Icons.Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Short Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      className="input min-h-[100px] resize-none"
                      placeholder="Tell us about your experience and expertise..."
                      rows={3}
                    />
                  </div>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => updateField('agreedToTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-sage-600 hover:text-sage-700">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-sage-600 hover:text-sage-700">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className="text-sm text-red-600">{errors.agreedToTerms}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
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
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            © 2025 GreenScape. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
