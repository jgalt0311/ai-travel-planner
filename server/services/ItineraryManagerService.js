const AIService = require('./AIService');
const Itinerary = require('../models/Itinerary');

class ItineraryManagerService {
  constructor() {
    this.aiService = AIService;
  }

  async updateItinerary(itineraryId, updates) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) throw new Error('Itinerary not found');

      Object.assign(itinerary, updates);

      if (updates.days || updates.preferences) {
        await this.aiService.optimizeItinerary(itinerary);
      }

      await itinerary.save();
      return itinerary;
    } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error;
    }
  }

  async addActivityToDay(itineraryId, dayIndex, activity) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) throw new Error('Itinerary not found');

      if (!itinerary.days[dayIndex]) {
        throw new Error('Invalid day index');
      }

      itinerary.days[dayIndex].activities.push(activity);
      await this.aiService.optimizeItinerary(itinerary);
      await itinerary.save();

      return itinerary;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }

  async removeActivity(itineraryId, dayIndex, activityId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) throw new Error('Itinerary not found');

      const day = itinerary.days[dayIndex];
      if (!day) throw new Error('Invalid day index');

      day.activities = day.activities.filter(
        activity => activity._id.toString() !== activityId
      );

      await this.aiService.optimizeItinerary(itinerary);
      await itinerary.save();

      return itinerary;
    } catch (error) {
      console.error('Error removing activity:', error);
      throw error;
    }
  }

  async moveActivity(itineraryId, fromDay, toDay, activityId) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) throw new Error('Itinerary not found');

      const activity = itinerary.days[fromDay].activities.find(
        a => a._id.toString() === activityId
      );
      if (!activity) throw new Error('Activity not found');

      // Remove from original day
      itinerary.days[fromDay].activities = itinerary.days[fromDay].activities.filter(
        a => a._id.toString() !== activityId
      );

      // Add to new day
      itinerary.days[toDay].activities.push(activity);

      await this.aiService.optimizeItinerary(itinerary);
      await itinerary.save();

      return itinerary;
    } catch (error) {
      console.error('Error moving activity:', error);
      throw error;
    }
  }

  async generateSummary(days, destination, preferences) {
    const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0);
    const highlights = this.getTopActivities(days, 3);
    
    return `A ${days.length}-day ${preferences.travelStyle} trip to ${destination} featuring ${totalActivities} activities. Highlights include ${highlights.join(', ')}.`;
  }

  getTopActivities(days, count) {
    const allActivities = days.flatMap(day => day.activities);
    return allActivities
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(activity => activity.name);
  }

  async shareItinerary(itineraryId, isPublic = true) {
    try {
      const itinerary = await Itinerary.findById(itineraryId);
      if (!itinerary) throw new Error('Itinerary not found');

      itinerary.isPublic = isPublic;
      await itinerary.save();

      return itinerary;
    } catch (error) {
      console.error('Error sharing itinerary:', error);
      throw error;
    }
  }

  async cloneItinerary(itineraryId, userId) {
    try {
      const originalItinerary = await Itinerary.findById(itineraryId);
      if (!originalItinerary) throw new Error('Itinerary not found');

      const clonedItinerary = new Itinerary({
        ...originalItinerary.toObject(),
        _id: undefined,
        user: userId,
        title: `Copy of ${originalItinerary.title}`,
        createdAt: undefined,
        updatedAt: undefined
      });

      await clonedItinerary.save();
      return clonedItinerary;
    } catch (error) {
      console.error('Error cloning itinerary:', error);
      throw error;
    }
  }
}

module.exports = new ItineraryManagerService();