const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    name: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'activity', 'accommodation', 'transport']
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  cost: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  startTime: Date,
  endTime: Date,
  images: [{
    url: String,
    source: String,
    caption: String
  }],
  reviews: [{
    text: String,
    rating: Number,
    source: String,
    sentimentScore: Number, // AI-generated sentiment score
    date: Date
  }],
  bookingInfo: {
    url: String,
    provider: String,
    required: Boolean
  },
  aiMetadata: {
    recommendationScore: Number,
    tags: [String],
    similarActivities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    }]
  }
});

const dayPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  activities: [activitySchema],
  notes: String,
  weatherForecast: {
    temperature: Number,
    condition: String,
    precipitation: Number
  }
});

const itinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  destination: {
    name: {
      type: String,
      required: true
    },
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  preferences: {
    travelStyle: {
      type: String,
      enum: ['adventure', 'relaxation', 'culture', 'food', 'nature', 'luxury', 'budget'],
      required: true
    },
    budget: {
      type: String,
      enum: ['budget', 'moderate', 'luxury'],
      required: true
    },
    interests: [String],
    pace: {
      type: String,
      enum: ['relaxed', 'moderate', 'intense'],
      default: 'moderate'
    }
  },
  days: [dayPlanSchema],
  summary: {
    type: String,
    required: true
  },
  totalCost: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  status: {
    type: String,
    enum: ['draft', 'planning', 'confirmed', 'completed'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  aiGenerated: {
    type: Boolean,
    default: true
  },
  version: {
    type: Number,
    default: 1
  },
  lastOptimized: Date
}, {
  timestamps: true
});

// Add indexes for common queries
itinerarySchema.index({ user: 1, 'dateRange.startDate': 1 });
itinerarySchema.index({ destination: 1, isPublic: 1 });

// Method to calculate total cost
itinerarySchema.methods.calculateTotalCost = function() {
  let total = 0;
  this.days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.cost && activity.cost.amount) {
        total += activity.cost.amount;
      }
    });
  });
  this.totalCost.amount = total;
  return total;
};

// Method to check for scheduling conflicts
itinerarySchema.methods.hasSchedulingConflicts = function() {
  for (const day of this.days) {
    const sortedActivities = [...day.activities].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );
    
    for (let i = 0; i < sortedActivities.length - 1; i++) {
      if (sortedActivities[i].endTime > sortedActivities[i + 1].startTime) {
        return true;
      }
    }
  }
  return false;
};

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;