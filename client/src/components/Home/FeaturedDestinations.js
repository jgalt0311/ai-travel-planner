import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Star } from 'lucide-react';

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In real app, fetch from API
    setDestinations([
      {
        id: 1,
        name: 'Paris',
        country: 'France',
        description: 'The City of Light awaits with its iconic landmarks and charming streets',
        rating: 4.8,
        activities: 150,
        thumbnail: '/api/placeholder/400/300'
      },
      {
        id: 2,
        name: 'Tokyo',
        country: 'Japan',
        description: 'Experience the perfect blend of tradition and modern innovation',
        rating: 4.9,
        activities: 200,
        thumbnail: '/api/placeholder/400/300'
      },
      {
        id: 3,
        name: 'New York',
        country: 'United States',
        description: 'The city that never sleeps offers endless entertainment and culture',
        rating: 4.7,
        activities: 180,
        thumbnail: '/api/placeholder/400/300'
      }
    ]);
    setLoading(false);
  }, []);

  const handleDestinationClick = (destination) => {
    navigate(`/create-itinerary?destination=${encodeURIComponent(destination.name)}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-lg bg-gray-200 h-48 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {destinations.map((destination) => (
        <button
          key={destination.id}
          onClick={() => handleDestinationClick(destination)}
          className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="relative h-48">
            <img
              src={destination.thumbnail}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" />
              <span className="text-sm font-medium">{destination.rating}</span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              {destination.name}
            </h3>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{destination.country}</span>
            </div>

            <p className="text-gray-600 mb-4">{destination.description}</p>

            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">{destination.activities} activities</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}