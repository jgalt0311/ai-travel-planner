const ItineraryGeneratorService = require('../services/ItineraryGeneratorService');
const ItineraryManagerService = require('../services/ItineraryManagerService');
const DayPlannerService = require('../services/DayPlannerService');

exports.createItinerary = async (req, res) => {
  try {
    const { destination, startDate, endDate, preferences } = req.body;
    const itinerary = await ItineraryGeneratorService.generateItinerary({
      destination,
      startDate,
      endDate,
      preferences,
      userId: req.user.id
    });
    res.status(201).json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user.id });
    res.json(itineraries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateItinerary = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.updateItinerary(
      req.params.id,
      req.body
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addActivity = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.addActivityToDay(
      req.params.id,
      req.body.dayIndex,
      req.body.activity
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.removeActivity = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.removeActivity(
      req.params.id,
      req.body.dayIndex,
      req.body.activityId
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.moveActivity = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.moveActivity(
      req.params.id,
      req.body.fromDay,
      req.body.toDay,
      req.body.activityId
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.shareItinerary = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.shareItinerary(
      req.params.id,
      req.body.isPublic
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cloneItinerary = async (req, res) => {
  try {
    const itinerary = await ItineraryManagerService.cloneItinerary(
      req.params.id,
      req.user.id
    );
    res.json(itinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};