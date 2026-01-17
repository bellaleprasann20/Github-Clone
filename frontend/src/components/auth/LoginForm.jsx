import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <svg height="48" viewBox="0 0 16 16" width="48" className="fill-white mx-auto mb-4">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        <h1 className="text-2xl font-light text-white mb-2">Sign in to GitHub Clone</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#161b22] border border-gray-700 rounded-lg p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="block text-gray-300 text-sm font-medium">
              Password
            </label>
            <Link to="/forgot-password" className="text-blue-400 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#0d1117] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-6 text-center border border-gray-700 rounded-lg p-4">
        <p className="text-gray-300">
          New to GitHub Clone?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;