// Import Express
const express = require('express');

// Import GitHub controller
const { getGitHubUserAnalytics } = require('../controllers/githubController');

// Create router instance
const router = express.Router();

/**
 * Route: GET /api/github/:username
 * Description: Fetch GitHub user analytics and profile information
 * Parameters:
 *   - username: GitHub username (required)
 * Returns: User profile data, repositories, and analytics
 */
router.get('/:username', getGitHubUserAnalytics);

// Export router
module.exports = router;
