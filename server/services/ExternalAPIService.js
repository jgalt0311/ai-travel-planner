const axios = require('axios');

class ExternalAPIService {
  constructor() {
    // Initialize API clients
    this.googleMapsClient = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api',
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    this.amadeusClient = axios.create({
      baseURL: 'https://test.api.amadeus.com/v1',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    this.unsplashClient = axios.create({
      baseURL: 'https://api.unsplash.com',
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });
  }

  async initializeAmadeusToken() {
    try {
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
        `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      this.amadeusClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      return response.data.access_token;
    } catch (error) {
      console.error('Error initializing Amadeus token:', error);
      throw error;
    }
  }

  async searchPlaces(query, location) {
    try {
      const response = await this.googleMapsClient.get('/place/textsearch/json', {
        params: {
          query,
          location: `${location.latitude},${location.longitude}`,
          radius: 50000, // 50km radius
          type: 'tourist_attraction'
        }
      });

      return this.formatPlacesResponse(response.data.results);
    } catch (error) {
      console.error('Error searching places:', error);
      throw error;
    }
  }

  async getPlaceDetails(placeId) {
    try {
      const response = await this.googleMapsClient.get('/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_phone_number,formatted_address,opening_hours,website,price_level,reviews,photos'
        }
      });

      return this.formatPlaceDetails(response.data.result);
    } catch (error) {
      console.error('Error getting place details:', error);
      throw error;
    }
  }

  async searchHotels(location, checkInDate, checkOutDate, adults = 2) {
    try {
      await this.initializeAmadeusToken();
      
      const response = await this.amadeusClient.get('/hotel/search', {
        params: {
          cityCode: location.cityCode,
          checkInDate,
          checkOutDate,
          adults,
          radius: 50,
          radiusUnit: 'KM',
          ratings: '3,4,5'
        }
      });

      return this.formatHotelResponse(response.data);
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getDestinationImages(destination, count = 10) {
    try {
      const response = await this.unsplashClient.get('/search/photos', {
        params: {
          query: `${destination} travel`,
          per_page: count,
          orientation: 'landscape'
        }
      });

      return response.data.results.map(photo => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        credit: {
          name: photo.user.name,
          link: photo.user.links.html
        }
      }));
    } catch (error) {
      console.error('Error fetching destination images:', error);
      throw error;
    }
  }

  async getWeatherForecast(location, dates) {
    // Implement weather API integration
    // You could use OpenWeatherMap, WeatherAPI, or similar
    try {
      // Placeholder for weather API implementation
      return {
        daily: dates.map(date => ({
          date,
          temperature: {
            min: 20,
            max: 25
          },
          condition: 'sunny',
          precipitation: 0
        }))
      };
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  // Helper methods to format API responses
  formatPlacesResponse(results) {
    return results.map(place => ({
      id: place.place_id,
      name: place.name,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: place.formatted_address
      },
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      types: place.types,
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) || []
    }));
  }

  formatPlaceDetails(place) {
    return {
      id: place.place_id,
      name: place.name,
      location: {
        address: place.formatted_address,
        phone: place.formatted_phone_number
      },
      rating: place.rating,
      website: place.website,
      priceLevel: place.price_level,
      openingHours: place.opening_hours?.weekday_text || [],
      reviews: place.reviews?.map(review => ({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      })) || [],
      photos: place.photos?.map(photo => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) || []
    };
  }

  formatHotelResponse(data) {
    return data.data.map(hotel => ({
      id: hotel.hotel.hotelId,
      name: hotel.hotel.name,
      rating: hotel.hotel.rating,
      location: {
        latitude: hotel.hotel.latitude,
        longitude: hotel.hotel.longitude,
        address: hotel.hotel.address
      },
      amenities: hotel.hotel.amenities,
      price: {
        amount: hotel.offers[0].price.total,
        currency: hotel.offers[0].price.currency
      },
      roomType: hotel.offers[0].room.type,
      bookingLink: hotel.offers[0].self
    }));
  }
}

module.exports = new ExternalAPIService();