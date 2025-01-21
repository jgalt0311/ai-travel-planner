const express = require('express');
const {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  addActivity,
  removeActivity,
  moveActivity,
  shareItinerary,
  cloneItinerary
} = require('../controllers/itineraryController');

const router = express.Router();

// Itinerary routes
router.post('/', createItinerary);
router.get('/', getItineraries);
router.get('/:id', getItinerary);
router.put('/:id', updateItinerary);
router.delete('/:id', deleteItinerary);

// Activity routes
router.post('/:id/activities', addActivity);
router.delete('/:id/activities', removeActivity);
router.put('/:id/activities/move', moveActivity);

// Sharing routes
router.post('/:id/share', shareItinerary);
router.post('/:id/clone', cloneItinerary);

module.exports = router;