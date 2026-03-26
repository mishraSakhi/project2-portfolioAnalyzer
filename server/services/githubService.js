const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Fetch basic user profile
 */
const fetchUserProfile = async (username) => {
  const { data } = await octokit.users.getByUsername({ username });
  return data;
};

/**
 * Fetch all public repositories (up to 100)
 */
const fetchUserRepos = async (username) => {
  const { data } = await octokit.repos.listForUser({
    username,
    per_page: 100,
    sort: 'updated',
    type: 'owner',
  });
  return data;
};

/**
 * Fetch public events (used for activity/streak calculation)
 */
const fetchUserEvents = async (username) => {
  try {
    const { data } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });
    return data;
  } catch {
    return [];
  }
};

/**
 * Check if a repo has a tests folder in the root
 */
const fetchRepoContents = async (owner, repo) => {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: '' });
    return data;
  } catch {
    return [];
  }
};

/**
 * Aggregate all data needed for scoring
 */
const fetchAllProfileData = async (username) => {
  const [profile, repos, events] = await Promise.all([
    fetchUserProfile(username),
    fetchUserRepos(username),
    fetchUserEvents(username),
  ]);

  // Check a sample of top repos for test folders (limit to avoid rate limits)
  const topReposSample = repos.slice(0, 10);
  const repoContents = await Promise.allSettled(
    topReposSample.map((r) => fetchRepoContents(username, r.name))
  );

  const repoContentMap = {};
  topReposSample.forEach((repo, i) => {
    const result = repoContents[i];
    repoContentMap[repo.name] =
      result.status === 'fulfilled' ? result.value : [];
  });

  return { profile, repos, events, repoContentMap };
};

module.exports = {
  fetchUserProfile,
  fetchUserRepos,
  fetchUserEvents,
  fetchRepoContents,
  fetchAllProfileData,
};
