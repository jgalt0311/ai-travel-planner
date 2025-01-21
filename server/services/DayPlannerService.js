const AIService = require('./AIService');

class DayPlannerService {
  constructor() {
    this.aiService = AIService;
  }

  async generateDailyPlans(startDate, endDate, recommendations, weatherForecast, preferences) {
    const dates = this.getDates(startDate, endDate);
    const dailyPlans = [];

    for (const date of dates) {
      const weatherSuitableActivities = this.filterActivitiesByWeather(
        recommendations,
        weatherForecast[date.toISOString()]
      );

      const dayActivities = await this.selectDailyActivities(
        weatherSuitableActivities,
        preferences,
        date
      );

      dailyPlans.push({
        date,
        activities: dayActivities,
        weatherForecast: weatherForecast[date.toISOString()],
        notes: await this.generateDayNotes(dayActivities, weatherForecast[date.toISOString()])
      });
    }

    return dailyPlans;
  }

  async selectDailyActivities(activities, preferences, date) {
    const { pace, budget } = preferences;
    const paceFactors = {
      relaxed: 3,
      moderate: 4,
      intense: 6
    };

    const maxActivities = paceFactors[pace] || 4;
    const selectedActivities = [];
    let totalDuration = 0;
    const MAX_DURATION = 12 * 60; // 12 hours in minutes

    const sortedActivities = [...activities].sort((a, b) => b.score - a.score);

    for (const activity of sortedActivities) {
      if (selectedActivities.length >= maxActivities) break;
      if (totalDuration + activity.duration > MAX_DURATION) continue;
      if (!this.isActivityWithinBudget(activity, budget)) continue;

      const startTime = this.calculateActivityStartTime(date, totalDuration);
      selectedActivities.push({
        ...activity,
        startTime,
        endTime: new Date(startTime.getTime() + activity.duration * 60000)
      });

      totalDuration += activity.duration;
    }

    return selectedActivities;
  }

  filterActivitiesByWeather(activities, weather) {
    return activities.filter(activity => {
      if (activity.category === 'outdoor' && weather.condition === 'rain') {
        return false;
      }
      return true;
    });
  }

  async generateDayNotes(activities, weather) {
    const weatherNote = weather.condition === 'rain' 
      ? 'Remember to bring an umbrella!' 
      : '';
    
    return `${weatherNote} ${activities.length} activities planned for today.`;
  }

  calculateActivityStartTime(date, totalDurationSoFar) {
    const startTime = new Date(date);
    startTime.setHours(9); // Start day at 9 AM
    startTime.setMinutes(0);
    startTime.setMinutes(startTime.getMinutes() + totalDurationSoFar);
    return startTime;
  }

  isActivityWithinBudget(activity, budget) {
    const budgetLevels = {
      budget: 1,
      moderate: 2,
      luxury: 3
    };
    
    return activity.priceLevel <= budgetLevels[budget];
  }
}

module.exports = new DayPlannerService();