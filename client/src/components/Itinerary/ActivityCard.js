import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Star, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

export default function ActivityCard({ activity, onUpdate }) {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">
              {activity.name}
            </h3>
            
            <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                <span className="ml-1 text-gray-400">
                  ({formatDuration(activity.duration)})
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.location.name}
              </div>
              
              {activity.cost && (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {typeof activity.cost.amount === 'number' 
                    ? `${activity.cost.amount} ${activity.cost.currency}`
                    : activity.cost.amount}
                </div>
              )}
              
              {activity.rating && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" />
                  {activity.rating}
                </div>
              )}
            </div>

            <div className={`text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
              {activity.description}
            </div>
          </div>

          <img
            src={activity.images?.[0]?.url || '/api/placeholder/120/120'}
            alt={activity.name}
            className="w-24 h-24 rounded-lg object-cover ml-4"
          />
        </div>

        {/* Expandable Content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {activity.reviews && activity.reviews.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Reviews</h4>
                <div className="space-y-2">
                  {activity.reviews.map((review, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center mb-1">
                        <Star 
                          className="w-4 h-4 mr-1 text-yellow-500" 
                          fill="currentColor" 
                        />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                      <p className="text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.bookingInfo && (
              <div>
                <h4 className="font-medium mb-2">Booking Information</h4>
                <a
                  href={activity.bookingInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  Book via {activity.bookingInfo.provider}
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            )}

            {activity.aiMetadata?.tags?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.aiMetadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center text-gray-500 hover:text-gray-700"
        >
          {expanded ? (
            <>
              Show less
              <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              Show more
              <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}