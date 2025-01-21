import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

export default function SearchBar({ onSearch }) {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (value) => {
    setDestination(value);
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/destinations/search?q=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError('Error fetching suggestions');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Where do you want to go?"
            className="w-full px-6 py-4 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none pr-12"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            <Search size={24} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => {
                  setDestination(suggestion.name);
                  setSuggestions([]);
                  onSearch(suggestion.name);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center">
                  <img
                    src={suggestion.thumbnail || '/api/placeholder/40/40'}
                    alt={suggestion.name}
                    className="w-10 h-10 rounded object-cover mr-3"
                  />
                  <div>
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-gray-500">{suggestion.country}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
}