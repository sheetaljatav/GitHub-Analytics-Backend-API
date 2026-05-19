// Import axios for making HTTP requests
const axios = require('axios');

// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Fetch GitHub user analytics data
 * GET /api/github/:username
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getGitHubUserAnalytics = async (req, res) => {
  try {
    // Extract username from request parameters
    const { username } = req.params;

    // Validate username
    if (!username || username.trim() === '') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Username is required and cannot be empty'
      });
    }

    console.log(`📡 Fetching data for user: ${username}`);

    // Fetch user profile data from GitHub API
    const userResponse = await axios.get(`${GITHUB_API_URL}/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = userResponse.data;

    console.log(`✅ User data fetched for ${username}`);

    // Fetch user's repositories
    const reposResponse = await axios.get(`${GITHUB_API_URL}/users/${username}/repos`, {
      params: {
        per_page: 100, // Fetch up to 100 repos
        sort: 'stars', // Sort by stars
        order: 'desc'  // Descending order
      },
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const repositories = reposResponse.data;

    console.log(`✅ Repositories fetched: ${repositories.length} repos found`);

    // Process repository data
    let totalStars = 0;
    const languages = new Set();
    const repositoriesList = [];
    const topRepositories = [];

    // Iterate through repositories to gather analytics
    repositories.forEach((repo, index) => {
      // Add stars to total
      totalStars += repo.stargazers_count;

      // Collect unique languages
      if (repo.language) {
        languages.add(repo.language);
      }

      // Add repository to list
      repositoriesList.push(repo.name);

      // Collect top 5 repositories based on stars
      if (index < 5) {
        topRepositories.push({
          name: repo.name,
          stars: repo.stargazers_count,
          url: repo.html_url,
          description: repo.description || 'No description available'
        });
      }
    });

    console.log(`📊 Analytics: ${totalStars} total stars, ${languages.size} languages`);

    // Build response object with all required data
    const analyticsData = {
      name: userData.name || 'N/A',
      bio: userData.bio || 'No bio available',
      followers: userData.followers,
      following: userData.following,
      publicRepos: userData.public_repos,
      totalStars: totalStars,
      languages: Array.from(languages).sort(), // Convert Set to sorted array
      repositories: repositoriesList,
      topRepositories: topRepositories,
      profileUrl: userData.html_url,
      avatarUrl: userData.avatar_url,
      company: userData.company || 'N/A',
      location: userData.location || 'N/A',
      email: userData.email || 'N/A',
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    };

    console.log(`✨ Successfully compiled analytics for ${username}`);

    // Send successful response with all data
    return res.status(200).json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // GitHub API returned an error response
      if (error.response.status === 404) {
        console.log(`❌ User not found: ${req.params.username}`);
        return res.status(404).json({
          error: 'Not Found',
          message: `GitHub user "${req.params.username}" does not exist`
        });
      }

      if (error.response.status === 403) {
        console.log(`⚠️ Rate limit exceeded`);
        return res.status(403).json({
          error: 'Rate Limit Exceeded',
          message: 'GitHub API rate limit has been exceeded. Please try again later.'
        });
      }

      return res.status(error.response.status).json({
        error: 'GitHub API Error',
        message: error.response.data.message || 'An error occurred while fetching data'
      });
    }

    // Handle network or other errors
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing your request',
      details: error.message
    });
  }
};

// Export the controller function
module.exports = {
  getGitHubUserAnalytics
};
