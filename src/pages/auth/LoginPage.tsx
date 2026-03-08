import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Icons } from '../../components/ui/Icons';
import type { UserRole } from '../../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get the appropriate dashboard route based on user role
  const getDashboardRoute = (role: UserRole): string => {
    // Workers get their own simplified dashboard
    if (role === 'worker') {
      return '/worker-dashboard';
    }
    // All other roles go to the main dashboard
    return '/dashboard';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      // Login returns the user directly - no need to get from store
      const user = await login(email, password);
      
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // Navigate to role-specific dashboard using the returned user
      const dashboardRoute = getDashboardRoute(user.role as UserRole);
      navigate(dashboardRoute, { replace: true });
      
    } catch (err: any) {
      // Error handled by store - don't navigate
      console.error('Login failed:', err);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

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

      {/* Main Content */}
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
                    <Icons.AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="you@company.com"
                      required
                    />
                    <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-sage-600 hover:text-sage-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-10 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <Icons.Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icons.Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-sage-600 text-white py-3 rounded-xl font-semibold hover:bg-sage-700 transition-colors disabled:bg-sage-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Demo credentials hint */}
              <div className="mt-6 p-4 bg-sage-50 rounded-xl">
                <p className="text-sm text-sage-700 font-medium mb-2">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-sage-600">
                  <p><span className="font-medium">System Owner:</span> test1@example.com / password123</p>
                  <p><span className="font-medium">Worker:</span> worker@test.com / pass123456</p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-sage-600 hover:text-sage-700 font-semibold">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image/Info (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 bg-sage-600 items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Icons.Leaf className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Manage Your Landscaping Business</h2>
            <p className="text-sage-100 text-lg mb-8">
              Streamline projects, track tasks, manage your team, and grow your business with GreenScape.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-sage-100">Projects</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">98%</p>
                <p className="text-sm text-sage-100">Satisfaction</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-sage-100">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
