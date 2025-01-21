import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Camera, Users, Heart, Coffee, Mountain } from 'lucide-react';

const travelStyles = [
  {
    id: 'adventure',
    name: 'Adventure',
    description: 'Thrilling experiences and outdoor activities',
    icon: Compass,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'cultural',
    name: 'Cultural',
    description: 'Immerse yourself in local traditions and history',
    icon: Camera,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'family',
    name: 'Family',
    description: 'Kid-friendly activities and accommodations',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Perfect for couples and honeymoons',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'relaxation',
    name: 'Relaxation',
    description: 'Peaceful getaways and wellness retreats',
    icon: Coffee,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Explore national parks and natural wonders',
    icon: Mountain,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  }
];

export default function TravelStyles() {
  const navigate = useNavigate();

  const handleStyleClick = (style) => {
    navigate('/create-itinerary', { state: { travelStyle: style.id } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {travelStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => handleStyleClick(style)}
          className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className={`p-4 rounded-lg ${style.bgColor} mr-4`}>
            <style.icon className={`w-6 h-6 ${style.color}`} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-1">{style.name}</h3>
            <p className="text-gray-600 text-sm">{style.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}