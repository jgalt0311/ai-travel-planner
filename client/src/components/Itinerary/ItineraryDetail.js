import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, Share2, Edit, Trash2 } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import ActivityCard from './ActivityCard';
import WeatherForecast from './WeatherForecast';

export default function ItineraryDetail() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch itinerary');
      
      const data = await response.json();
      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Alert variant="destructive">
          {error}
        </Alert>
      </div>
    );
  }

  if (!itinerary) return null;

  const currentDay = itinerary.days[selectedDay];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{itinerary.title}</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => {/* Implement share */}}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {/* Implement edit */}}
              className="p-2 text-gray-600 hover:text-blue-600"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => {/* Implement delete */}}
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            {itinerary.destination.name}
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {new Date(itinerary.dateRange.startDate).toLocaleDateString()} - 
            {new Date(itinerary.dateRange.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            {itinerary.preferences.budget}
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {itinerary.preferences.pace} pace
          </div>
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="mb-8">
        <WeatherForecast days={itinerary.days} />
      </div>

      {/* Day Selection */}
      <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
        {itinerary.days.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition ${
              selectedDay === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      {/* Activities */}
      <div className="space-y-6">
        {currentDay.activities.map((activity, index) => (
          <ActivityCard
            key={activity._id || index}
            activity={activity}
            onUpdate={() => fetchItinerary()}
          />
        ))}
      </div>

      {/* Add Activity Button */}
      <button
        onClick={() => {/* Implement add activity */}}
        className="mt-8 w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        + Add Activity
      </button>
    </div>
  );
}