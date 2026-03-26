const Report = require('../models/Report');
const { fetchAllProfileData } = require('../services/githubService');
const { computeScores } = require('../services/scoringService');

/**
 * GET /api/profile/:username
 * Fetch fresh data from GitHub, compute scores, cache in MongoDB, return report.
 */
const getProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    const { profile, repos, events, repoContentMap } = await fetchAllProfileData(username);

    const { scores, scoreDetails, topRepos, languages, heatmapData } =
      computeScores(profile, repos, events, repoContentMap);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const shareUrl = `/report/${username}`;

    const reportData = {
      username,
      avatarUrl: profile.avatar_url,
      name: profile.name,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      email: profile.email,
      twitterUsername: profile.twitter_username,
      joinedAt: profile.created_at,
      scores,
      scoreDetails,
      topRepos,
      languages,
      heatmapData,
      shareUrl,
      cachedAt: new Date(),
      expiresAt,
    };

    // Upsert into MongoDB cache
    await Report.findOneAndUpdate(
      { username },
      reportData,
      { upsert: true, new: true }
    );

    return res.json({ ...reportData, fromCache: false });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/profile/:username/cached
 * Return cached report only — 404 if not found or expired.
 */
const getCachedProfile = async (req, res, next) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const cached = await Report.findOne({ username });

    if (!cached) {
      return res.status(404).json({ error: 'No cached report found for this user.' });
    }

    const ageMs = Date.now() - new Date(cached.cachedAt).getTime();
    if (ageMs > 24 * 60 * 60 * 1000) {
      return res.status(404).json({ error: 'Cached report has expired.' });
    }

    return res.json({ ...cached.toObject(), fromCache: true });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/compare?u1=user1&u2=user2
 * Compare two GitHub profiles side by side.
 */
const compareProfiles = async (req, res, next) => {
  try {
    const { u1, u2 } = req.query;
    if (!u1 || !u2) {
      return res.status(400).json({ error: 'Both u1 and u2 query params are required.' });
    }

    const [data1, data2] = await Promise.all([
      fetchAllProfileData(u1.toLowerCase()),
      fetchAllProfileData(u2.toLowerCase()),
    ]);

    const report1 = computeScores(data1.profile, data1.repos, data1.events, data1.repoContentMap);
    const report2 = computeScores(data2.profile, data2.repos, data2.events, data2.repoContentMap);

    return res.json({
      user1: { username: u1.toLowerCase(), profile: data1.profile, ...report1 },
      user2: { username: u2.toLowerCase(), profile: data2.profile, ...report2 },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, getCachedProfile, compareProfiles };
