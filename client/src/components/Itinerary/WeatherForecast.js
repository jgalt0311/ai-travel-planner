import React from 'react';
import { Cloud, CloudRain, Sun, CloudLightning } from 'lucide-react';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  storm: CloudLightning
};

export default function WeatherForecast({ days }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Weather Forecast</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((day, index) => {
          const date = new Date(day.date);
          const WeatherIcon = weatherIcons[day.weatherForecast?.condition] || Cloud;
          
          return (
            <div 
              key={index}
              className="text-center p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="text-sm font-medium mb-2">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              
              <WeatherIcon 
                className={`w-8 h-8 mx-auto mb-2 ${
                  day.weatherForecast?.condition === 'sunny' 
                    ? 'text-yellow-500' 
                    : 'text-gray-600'
                }`}
              />
              
              {day.weatherForecast && (
                <>
                  <div className="text-lg font-semibold">
                    {day.weatherForecast.temperature}°
                  </div>
                  
                  {day.weatherForecast.precipitation > 0 && (
                    <div className="text-sm text-gray-500">
                      {day.weatherForecast.precipitation}% rain
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}