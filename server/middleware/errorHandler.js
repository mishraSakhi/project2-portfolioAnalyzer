const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // GitHub API "Not Found" errors
  if (err.status === 404 || message.includes('Not Found')) {
    return res.status(404).json({
      error: 'GitHub user not found',
      message: 'The username you entered does not exist on GitHub.',
    });
  }

  // GitHub rate limit errors
  if (err.status === 403 || message.includes('rate limit')) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'GitHub API rate limit reached. Please try again later.',
    });
  }

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
