const express = require('express');
const router = express.Router();
const { getProfile, getCachedProfile, compareProfiles } = require('../controllers/profileController');
const { checkCache } = require('../middleware/cache');

// GET /api/profile/:username — fetch & score (with cache check)
router.get('/:username', checkCache, getProfile);

// GET /api/profile/:username/cached — return cached only
router.get('/:username/cached', getCachedProfile);

// GET /api/compare?u1=&u2= — compare two profiles
router.get('/compare/two', compareProfiles);

module.exports = router;
