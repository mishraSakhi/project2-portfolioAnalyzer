const Report = require('../models/Report');

/**
 * Check MongoDB for a fresh cached report (less than 24 hours old).
 * If found, respond immediately. Otherwise, continue to the controller.
 */
const checkCache = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cached = await Report.findOne({ username: username.toLowerCase() });

    if (!cached) return next();

    const ageMs = Date.now() - new Date(cached.cachedAt).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (ageMs < twentyFourHours) {
      return res.json({ ...cached.toObject(), fromCache: true });
    }

    // Cache expired — delete and refresh
    await Report.deleteOne({ username: username.toLowerCase() });
    next();
  } catch (err) {
    next(); // On cache error, just proceed to fresh fetch
  }
};

module.exports = { checkCache };
