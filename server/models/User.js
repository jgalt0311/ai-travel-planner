const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    travelStyles: [{
      type: String,
      enum: ['adventure', 'relaxation', 'culture', 'food', 'nature', 'luxury', 'budget']
    }],
    interests: [{
      type: String
    }],
    preferredBudget: {
      type: String,
      enum: ['budget', 'moderate', 'luxury']
    }
  },
  savedItineraries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  }],
  profilePicture: {
    type: String,
    default: '' // URL to default profile picture
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;