const AIService = require('./AIService');
const ExternalAPIService = require('./ExternalAPIService');
const Itinerary = require('../models/Itinerary');

class ItineraryGeneratorService {
  constructor() {
    this.aiService = AIService;
    this.externalAPI = ExternalAPIService;
  }

  async generateItinerary(params) {
    const {
      destination,
      startDate,
      endDate,
      preferences,
      userId
    } = params;

    try {
      // 1. Get destination details and available activities
      const places = await this.externalAPI.searchPlaces(
        destination,
        this.getDestinationCoordinates(destination)
      );

      // 2. Get destination images
      const images = await this.externalAPI.getDestinationImages(destination);

      // 3. Get weather forecast
      const weatherForecast = await this.externalAPI.getWeatherForecast(
        this.getDestinationCoordinates(destination),
        this.getDates(startDate, endDate)
      );

      // 4. Generate AI recommendations
      const recommendations = await this.aiService.generateActivityRecommendations(
        preferences,
        destination
      );

      // 5. Create daily plans
      const days = await this.generateDailyPlans(
        startDate,
        endDate,
        recommendations,
        weatherForecast,
        preferences
      );

      // 6. Create itinerary
      const itinerary = new Itinerary({
        user: userId,
        title: `Trip to ${destination}`,
        destination: {
          name: destination,
          coordinates: this.getDestinationCoordinates(destination)
        },
        dateRange: {
          startDate,
          endDate
        },
        preferences,
        days,
        summary: await this.generateSummary(days, destination, preferences),
        aiGenerated: true
      });

      // 7. Optimize and save
      const optimizedItinerary = await this.aiService.optimizeItinerary(itinerary);
      await optimizedItinerary.save();
      return optimizedItinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }

  getDates(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  getDestinationCoordinates(destination) {
    // Placeholder - would typically use geocoding service
    return {
      latitude: 0,
      longitude: 0
    };
  }
}

module.exports = new ItineraryGeneratorService();