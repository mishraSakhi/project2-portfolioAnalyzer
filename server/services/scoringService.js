/**
 * scoringService.js
 * All scoring logic lives here. Weights and formulas can be adjusted.
 *
 * Category Weights:
 *   Activity     25%
 *   Code Quality 20%
 *   Diversity    20%
 *   Community    20%
 *   Hiring Ready 15%
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val));

const daysBetween = (d1, d2) =>
  Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));

// ─── Activity Score (25 pts) ─────────────────────────────────────────────────

const calcActivityScore = (events) => {
  const now = new Date();
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

  // Count push events in last 90 days
  const recentPushes = events.filter(
    (e) => e.type === 'PushEvent' && new Date(e.created_at) >= ninetyDaysAgo
  );

  const commitCount = recentPushes.reduce(
    (sum, e) => sum + (e.payload?.commits?.length || 1),
    0
  );

  // Commits score: max 20 pts — 20 commits = full score
  const commitScore = clamp(Math.floor((commitCount / 20) * 20), 0, 20);

  // Streak: count consecutive days with push events
  const pushDates = [
    ...new Set(
      recentPushes.map((e) => new Date(e.created_at).toISOString().split('T')[0])
    ),
  ].sort();

  let streak = 0;
  let maxStreak = 0;
  for (let i = 0; i < pushDates.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = daysBetween(new Date(pushDates[i - 1]), new Date(pushDates[i]));
      streak = diff === 1 ? streak + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, streak);
  }

  // Streak score: max 5 pts — 7-day streak = full score
  const streakScore = clamp(Math.floor((maxStreak / 7) * 5), 0, 5);

  const raw = commitScore + streakScore;
  return {
    score: clamp(Math.round((raw / 25) * 100)),
    details: { commitCount, maxStreak, commitScore, streakScore },
  };
};

// ─── Code Quality Score (20 pts) ─────────────────────────────────────────────

const calcCodeQualityScore = (repos, repoContentMap) => {
  if (!repos.length) return { score: 0, details: {} };

  let totalPoints = 0;
  let maxPoints = 0;

  repos.slice(0, 20).forEach((repo) => {
    maxPoints += 5; // max 5 pts per repo
    if (repo.description) totalPoints += 1;         // has description
    if (repo.license) totalPoints += 1;             // has license
    if (repo.topics?.length > 0) totalPoints += 1;  // has topics/tags

    // README check via API contents
    const contents = repoContentMap[repo.name] || [];
    const hasReadme = Array.isArray(contents) &&
      contents.some((f) => f.name?.toLowerCase().startsWith('readme'));
    if (hasReadme) totalPoints += 1;

    // Tests folder check
    const hasTests = Array.isArray(contents) &&
      contents.some((f) =>
        ['test', 'tests', '__tests__', 'spec', 'specs'].includes(f.name?.toLowerCase())
      );
    if (hasTests) totalPoints += 1;
  });

  const raw = maxPoints > 0 ? totalPoints / maxPoints : 0;
  return {
    score: clamp(Math.round(raw * 100)),
    details: { totalPoints, maxPoints },
  };
};

// ─── Diversity Score (20 pts) ─────────────────────────────────────────────────

const calcDiversityScore = (repos) => {
  const languageSet = new Set();
  const topicSet = new Set();

  repos.forEach((repo) => {
    if (repo.language) languageSet.add(repo.language);
    repo.topics?.forEach((t) => topicSet.add(t));
  });

  // Category detection from topic/repo names
  const categoryKeywords = {
    web: ['react', 'vue', 'angular', 'html', 'css', 'frontend', 'web', 'next', 'gatsby'],
    backend: ['api', 'backend', 'server', 'express', 'django', 'flask', 'rails', 'rest'],
    cli: ['cli', 'terminal', 'command-line', 'shell', 'bash', 'tool'],
    library: ['library', 'lib', 'package', 'sdk', 'framework', 'npm', 'pypi'],
    ml: ['machine-learning', 'ml', 'ai', 'deep-learning', 'neural', 'tensorflow', 'pytorch'],
    mobile: ['android', 'ios', 'mobile', 'flutter', 'react-native', 'swift', 'kotlin'],
    devops: ['docker', 'kubernetes', 'ci', 'devops', 'deploy', 'terraform', 'ansible'],
    game: ['game', 'unity', 'godot', 'pygame', 'canvas'],
  };

  const detectedCategories = new Set();
  repos.forEach((repo) => {
    const text = [repo.name, ...(repo.topics || [])].join(' ').toLowerCase();
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some((kw) => text.includes(kw))) {
        detectedCategories.add(category);
      }
    });
  });

  // Language score: 1pt per unique language, max 10
  const langScore = clamp(languageSet.size, 0, 10);
  // Category score: 1pt per project category, max 10
  const catScore = clamp(detectedCategories.size, 0, 10);

  return {
    score: clamp(Math.round(((langScore + catScore) / 20) * 100)),
    details: {
      languages: languageSet.size,
      categories: detectedCategories.size,
      languageList: [...languageSet],
      categoryList: [...detectedCategories],
    },
  };
};

// ─── Community Score (20 pts) ─────────────────────────────────────────────────

const calcCommunityScore = (profile, repos) => {
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
  const followers = profile.followers || 0;

  // Log scale: ln(x+1) normalised
  const starScore = clamp(Math.floor((Math.log(totalStars + 1) / Math.log(501)) * 12), 0, 12);
  const forkScore = clamp(Math.floor((Math.log(totalForks + 1) / Math.log(101)) * 5), 0, 5);
  const followerBonus = followers > 50 ? 3 : followers > 10 ? 1 : 0;

  const raw = starScore + forkScore + followerBonus;
  return {
    score: clamp(Math.round((raw / 20) * 100)),
    details: { totalStars, totalForks, followers, starScore, forkScore, followerBonus },
  };
};

// ─── Hiring Readiness Score (15 pts) ─────────────────────────────────────────

const calcHiringReadyScore = (profile, repos) => {
  let points = 0;

  if (profile.bio && profile.bio.trim().length > 10) points += 4;  // bio filled
  if (profile.blog && profile.blog.trim().length > 0) points += 3; // website/portfolio
  if (profile.email) points += 3;                                   // public email
  if (profile.twitter_username) points += 1;                        // social link

  // Has at least one well-described repo (acts as "pinned")
  const goodRepos = repos.filter(
    (r) => r.description && r.stargazers_count >= 1
  );
  if (goodRepos.length >= 1) points += 2;
  if (goodRepos.length >= 3) points += 2; // bonus for multiple

  return {
    score: clamp(Math.round((points / 15) * 100)),
    details: {
      hasBio: !!(profile.bio?.trim().length > 10),
      hasWebsite: !!(profile.blog?.trim().length > 0),
      hasEmail: !!profile.email,
      hasTwitter: !!profile.twitter_username,
      goodRepoCount: goodRepos.length,
    },
  };
};

// ─── Language Distribution ───────────────────────────────────────────────────

const calcLanguageDistribution = (repos) => {
  const langCount = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(langCount).reduce((s, c) => s + c, 0);
  return Object.entries(langCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
};

// ─── Heatmap Data ─────────────────────────────────────────────────────────────

const buildHeatmapData = (events) => {
  const heatmap = {};
  events
    .filter((e) => e.type === 'PushEvent')
    .forEach((e) => {
      const date = new Date(e.created_at).toISOString().split('T')[0];
      heatmap[date] = (heatmap[date] || 0) + (e.payload?.commits?.length || 1);
    });
  return heatmap;
};

// ─── Main Scoring Function ───────────────────────────────────────────────────

const computeScores = (profile, repos, events, repoContentMap) => {
  const activity = calcActivityScore(events);
  const codeQuality = calcCodeQualityScore(repos, repoContentMap);
  const diversity = calcDiversityScore(repos);
  const community = calcCommunityScore(profile, repos);
  const hiringReady = calcHiringReadyScore(profile, repos);

  // Weighted overall score
  const overall = clamp(
    Math.round(
      activity.score * 0.25 +
      codeQuality.score * 0.20 +
      diversity.score * 0.20 +
      community.score * 0.20 +
      hiringReady.score * 0.15
    )
  );

  // Top 6 repos by stars
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      description: r.description,
      url: r.html_url,
      topics: r.topics || [],
    }));

  const languages = calcLanguageDistribution(repos);
  const heatmapData = buildHeatmapData(events);

  return {
    scores: {
      activity: activity.score,
      codeQuality: codeQuality.score,
      diversity: diversity.score,
      community: community.score,
      hiringReady: hiringReady.score,
      overall,
    },
    scoreDetails: {
      activity: activity.details,
      codeQuality: codeQuality.details,
      diversity: diversity.details,
      community: community.details,
      hiringReady: hiringReady.details,
    },
    topRepos,
    languages,
    heatmapData,
  };
};

module.exports = { computeScores };
