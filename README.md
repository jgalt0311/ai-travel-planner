# AI Travel Planner

An AI-powered travel planning application that creates personalized itineraries using advanced NLP and recommendation systems.

## Key Features

- Intelligent itinerary generation
- Sentiment analysis for reviews
- Personalized recommendations
- Dynamic trip planning
- Visual-rich interface

## Tech Stack

### Frontend
- React (with Create React App)
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for database
- NLP.js for natural language processing
- JWT for authentication

### AI/ML Components
- Natural for sentiment analysis
- TensorFlow.js for recommendations
- Google Places API for location data
- Amadeus API for travel data

## Initial Setup

Based on our research, we're integrating the following key components:

1. **NLP Processing**: Using NLP.js (7K+ stars on GitHub) for sentiment analysis and natural language understanding
2. **Maps & Location**: Using a combination of OpenStreetMap (free) and optional Google Places API
3. **Travel Data**: Amadeus API for flight and hotel information
4. **Image Processing**: Unsplash API for high-quality travel images

## Project Structure

```
/client          # React frontend
/server          # Node.js backend
  /controllers   # Route controllers
  /models        # Database models
  /routes        # API routes
  /services      # Business logic
  /config        # Configuration files
  /middleware    # Custom middleware
```

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

## Next Steps

1. Set up the basic React application with Tailwind CSS
2. Initialize the Node.js backend with Express
3. Implement the first AI features using NLP.js
4. Set up the database schema
5. Begin integrating travel APIs

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT