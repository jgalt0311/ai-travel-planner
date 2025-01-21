const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

exports.authorizeItineraryAccess = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    if (itinerary.user.toString() !== req.user.id && !itinerary.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.itinerary = itinerary;
    next();
  } catch (error) {
    next(error);
  }
};