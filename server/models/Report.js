const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    avatarUrl: String,
    name: String,
    bio: String,
    followers: Number,
    following: Number,
    publicRepos: Number,
    location: String,
    company: String,
    blog: String,
    email: String,
    twitterUsername: String,
    joinedAt: Date,
    scores: {
      activity: Number,      // 0-100
      codeQuality: Number,   // 0-100
      diversity: Number,     // 0-100
      community: Number,     // 0-100
      hiringReady: Number,   // 0-100
      overall: Number,       // weighted total 0-100
    },
    topRepos: [
      {
        name: String,
        stars: Number,
        forks: Number,
        language: String,
        description: String,
        url: String,
        topics: [String],
      },
    ],
    languages: [{ name: String, count: Number, percent: Number }],
    heatmapData: mongoose.Schema.Types.Mixed, // contributions per week
    recentActivity: mongoose.Schema.Types.Mixed,
    shareUrl: String,
    cachedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: { expires: 0 } }, // TTL index — auto-deletes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', ReportSchema);
