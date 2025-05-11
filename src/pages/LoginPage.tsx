import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login, register, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (isSignUp) {
        await register(name, email, password);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Logged in successfully!');
      }
      navigate('/');
    } catch (error: any) {
      console.error('Auth error:', error);
  
      // Check for empty response or non-JSON response
      let errorMessage = 'Authentication failed';
      if (error?.response?.data) {
        try {
          errorMessage = error.response.data.message || error?.message || errorMessage;
        } catch (e) {
          console.error("Error parsing response data:", e);
        }
      }
  
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGoogleError = (error: any) => {
    console.error('Google login error:', error);
    toast.error('Google login failed. Please try again later.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-600 text-white rounded-lg">
                <Database size={28} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">CRM Platform</h1>
            <p className="text-gray-500 mt-2">Manage customers, segments, and campaigns</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="#forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
          <GoogleLogin
  onSuccess={(credentialResponse) => {
    try {
      if (credentialResponse?.credential) {  
        googleLogin(credentialResponse.credential);
        navigate('/');
        toast.success('Logged in with Google successfully!');
      } else {
        throw new Error('No credential received');
      }
    } catch (error) {
      handleGoogleError(error);
    }
  }}
  onError={() => { 
    toast.error('Google login failed. Please try again later.');
  }}
  useOneTap
/>


          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;