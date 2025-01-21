import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

const budgetOptions = [
  { id: 'budget', label: 'Budget', description: 'Economical options and hostels' },
  { id: 'moderate', label: 'Moderate', description: 'Mid-range hotels and restaurants' },
  { id: 'luxury', label: 'Luxury', description: 'High-end accommodations and experiences' }
];

const paceOptions = [
  { id: 'relaxed', label: 'Relaxed', description: '2-3 activities per day' },
  { id: 'moderate', label: 'Moderate', description: '3-4 activities per day' },
  { id: 'intense', label: 'Intense', description: '5+ activities per day' }
];

export default function ItineraryForm({ destination }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 'moderate',
    pace: 'moderate',
    interests: [],
    preferences: {
      morningPerson: false,
      foodie: false,
      culturalActivities: true,
      outdoorActivities: true
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          destination,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create itinerary');
      }

      const data = await response.json();
      navigate(`/itinerary/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceToggle = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const isDateValid = () => {
    if (!formData.startDate || !formData.endDate) return true;
    return new Date(formData.endDate) >= new Date(formData.startDate);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Plan Your Trip to {destination}</h2>

      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Travelers */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Travelers
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            value={formData.travelers}
            onChange={(e) => handleInputChange('travelers', parseInt(e.target.value))}
            min="1"
            max="10"
            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgetOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleInputChange('budget', option.id)}
              className={`p-4 border rounded-lg text-left transition ${
                formData.budget === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <DollarSign className={`w-5 h-5 mb-2 ${
                formData.budget === option.id ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <div className="font-medium mb-1">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Travel Pace
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paceOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleInputChange('pace', option.id)}
              className={`p-4 border rounded-lg text-left transition ${
                formData.pace === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <Clock className={`w-5 h-5 mb-2 ${
                formData.pace === option.id ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <div className="font-medium mb-1">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferences
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.preferences).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePreferenceToggle(key)}
              className={`p-4 border rounded-lg text-left transition ${
                value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="font-medium">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !isDateValid()}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Itinerary...' : 'Create Itinerary'}
      </button>
    </form>
  );
}