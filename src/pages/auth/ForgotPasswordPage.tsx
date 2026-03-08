import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/ui/Icons';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <>
              {/* Back Link */}
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icons.Mail className="w-8 h-8 text-sage-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                  <p className="text-gray-500 mt-2">
                    No worries! Enter your email and we'll send you reset instructions.
                  </p>
                </div>

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
                      />
                      <Icons.Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.CheckCircle className="w-10 h-10 text-sage-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
              <p className="text-gray-500 mb-6">
                We've sent password reset instructions to:
              </p>
              <p className="font-semibold text-gray-900 bg-gray-100 rounded-lg py-3 px-4 mb-6">
                {email}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-sage-600 hover:text-sage-700 font-medium"
                >
                  try again
                </button>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icons.ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-sage-600 hover:text-sage-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;