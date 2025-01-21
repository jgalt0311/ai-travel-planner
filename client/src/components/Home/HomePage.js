import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import FeaturedDestinations from './FeaturedDestinations';
import TravelStyles from './TravelStyles';

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (destination) => {
    navigate(`/create-itinerary?destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/api/placeholder/1920/1080"
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Plan Your Dream Trip with AI
          </h1>
          <p className="text-xl text-white mb-8">
            Create personalized travel itineraries powered by artificial intelligence
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Popular Destinations
        </h2>
        <FeaturedDestinations />
      </div>

      {/* Travel Styles */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Choose Your Travel Style
          </h2>
          <TravelStyles />
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="rounded-lg bg-blue-50 p-6 mb-4">
              <i className="text-4xl text-blue-600">🤖</i>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Planning</h3>
            <p className="text-gray-600">
              Smart recommendations based on your preferences
            </p>
          </div>
          <div className="text-center">
            <div className="rounded-lg bg-blue-50 p-6 mb-4">
              <i className="text-4xl text-blue-600">🎯</i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Itineraries</h3>
            <p className="text-gray-600">
              Customized plans that match your travel style
            </p>
          </div>
          <div className="text-center">
            <div className="rounded-lg bg-blue-50 p-6 mb-4">
              <i className="text-4xl text-blue-600">📱</i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Simple interface for planning and organizing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}