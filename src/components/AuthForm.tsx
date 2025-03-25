import React, { useState, useEffect } from 'react';

type AuthMode = 'login' | 'signup' | 'forgot-password';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [emailSent, setEmailSent] = useState(false);

  // Handle mode change with animation
  const changeMode = (newMode: AuthMode) => {
    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setIsAnimating(false);
      setErrors({});
      if (newMode === 'forgot-password') {
        setEmailSent(false);
      }
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (mode === 'signup' || mode === 'login') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (mode === 'signup') {
      if (!formData.username) newErrors.username = 'Username is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (mode === 'forgot-password' && emailSent) {
      if (!formData.verificationCode) newErrors.verificationCode = 'Verification code is required';
      if (!formData.password) newErrors.password = 'New password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (mode === 'forgot-password') {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (mode === 'login') {
        // Call login API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        if (!response.ok) throw new Error('Login failed');
        
        // Handle successful login
        const data = await response.json();
        console.log('Login successful', data);
        // Redirect or update state as needed
      } 
      else if (mode === 'signup') {
        // Check if email exists
        const checkEmailResponse = await fetch(`/api/auth/check-email?email=${encodeURIComponent(formData.email)}`);
        if (!checkEmailResponse.ok) throw new Error('Failed to check email');
        
        const { exists } = await checkEmailResponse.json();
        if (exists) {
          setErrors({ email: 'Email already registered' });
          return;
        }
        
        // Call signup API
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });
        
        if (!response.ok) throw new Error('Signup failed');
        
        // Handle successful signup
        const data = await response.json();
        console.log('Signup successful', data);
        // Redirect to verification or login page
      }
      else if (mode === 'forgot-password') {
        if (!emailSent) {
          // Request password reset
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          });
          
          if (!response.ok) throw new Error('Failed to send verification code');
          
          setEmailSent(true);
        } else {
          // Reset password with verification code
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              verificationCode: formData.verificationCode,
              newPassword: formData.password
            })
          });
          
          if (!response.ok) throw new Error('Failed to reset password');
          
          // Redirect to login
          changeMode('login');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Handle errors appropriately
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 
             mode === 'signup' ? 'Create your account' : 
             'Reset your password'}
          </h2>
        </div>
        
        {/* Form with animation */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              
              {/* Username field - only for signup */}
              {mode === 'signup' && (
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              )}
              
              {/* Email field - for all modes initially */}
              {(mode === 'login' || mode === 'signup' || (mode === 'forgot-password' && !emailSent)) && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              )}
              
              {/* Verification code - for password reset */}
              {(mode === 'forgot-password' && emailSent) && (
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.verificationCode ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  />
                  {errors.verificationCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>
                  )}
                </div>
              )}
              
              {/* Password field - for login and signup */}
              {(mode === 'login' || mode === 'signup' || (mode === 'forgot-password' && emailSent)) && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {mode === 'forgot-password' ? 'New Password' : 'Password'}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={mode === 'forgot-password' ? 'new-password' : 'current-password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              )}
              
              {/* Confirm password - for signup and password reset */}
              {(mode === 'signup' || (mode === 'forgot-password' && emailSent)) && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Forgot password link - only for login */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => changeMode('forgot-password')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {mode === 'login' ? 'Sign in' : 
                 mode === 'signup' ? 'Sign up' : 
                 emailSent ? 'Reset Password' : 'Send Verification Code'}
              </button>
            </div>
            
            {/* Switch between login and signup */}
            <div className="flex justify-center text-sm">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => changeMode('signup')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => changeMode('login')}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;