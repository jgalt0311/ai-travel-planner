import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';

const travelStyles = [
  { id: 'adventure', label: 'Adventure' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'relaxation', label: 'Relaxation' },
  { id: 'family', label: 'Family' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'budget', label: 'Budget' }
];

export default function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    preferences: {
      travelStyles: [],
      interests: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTravelStyle = (style) => {
    setFormData(prev => {
      const styles = prev.preferences.travelStyles;
      const newStyles = styles.includes(style)
        ? styles.filter(s => s !== style)
        : [...styles, style];
      
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          travelStyles: newStyles
        }
      };
    });
  };

  if (step === 1) {
    return (
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Your Travel Preferences</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Styles
          </label>
          <div className="grid grid-cols-2 gap-3">
            {travelStyles.map(style => (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleTravelStyle(style.id)}
                className={`p-3 border rounded-lg text-left transition ${
                  formData.preferences.travelStyles.includes(style.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
      </form>
    </div>
  );
}