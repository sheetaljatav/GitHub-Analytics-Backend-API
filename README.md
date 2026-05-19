# 📊 GitHub Analytics API

A professional, production-ready backend API built with **Node.js** and **Express.js** to fetch and analyze GitHub user data. This API provides comprehensive analytics about GitHub users including profile information, repositories, languages, and star counts.

## ✨ Features

- 🔍 **Fetch GitHub User Profile** - Get detailed user information including bio, followers, and following
- 📈 **Repository Analytics** - Analyze all public repositories with star counts and language information
- ⭐ **Top Repositories** - Automatically rank and display top 5 repositories by stars
- 🗣️ **Language Detection** - Identify all programming languages used across repositories
- 📝 **Rich Profile Data** - Access comprehensive user metadata including location, company, and creation date
- ⚡ **Error Handling** - Robust error handling for invalid users and API rate limits
- 🛡️ **CORS Enabled** - Cross-Origin Resource Sharing for frontend integration
- 🔧 **Environment Variables** - Secure configuration management with dotenv

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **CORS**: CORS middleware
- **Environment**: dotenv
- **Development**: nodemon
- **API Source**: GitHub Public API (v3)

## 📋 Project Structure

```
github-analytics-api/
│
├── controllers/
│   └── githubController.js    # Business logic for GitHub operations
│
├── routes/
│   └── githubRoutes.js        # API route definitions
│
├── server.js                  # Express server configuration
├── package.json               # Project dependencies
├── .env                       # Environment variables
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. **Clone or download the repository**
   ```bash
   cd github-analytics-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create and configure .env file** (already provided)
   ```bash
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Or start the production server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
**Endpoint**: `GET /health`

**Description**: Verify that the API is running

**Response**:
```json
{
  "message": "API is running successfully",
  "timestamp": "2024-05-16T10:30:00.000Z"
}
```

---

### 2. Welcome/Documentation
**Endpoint**: `GET /`

**Description**: Get API information and available endpoints

**Response**:
```json
{
  "message": "Welcome to GitHub Analytics API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "github_user": "/api/github/:username"
  }
}
```

---

### 3. GitHub User Analytics ⭐ (Main Endpoint)
**Endpoint**: `GET /api/github/:username`

**Description**: Fetch comprehensive analytics for a GitHub user

**Parameters**:
- `username` (string, required): GitHub username

**Success Response** (Status: 200):
```json
{
  "success": true,
  "data": {
    "name": "Linus Torvalds",
    "bio": "Linux creator",
    "followers": 200000,
    "following": 0,
    "publicRepos": 50,
    "totalStars": 150000,
    "languages": [
      "C",
      "Python",
      "Perl"
    ],
    "repositories": [
      "linux",
      "subsurface-divelog"
    ],
    "topRepositories": [
      {
        "name": "linux",
        "stars": 145000,
        "url": "https://github.com/torvalds/linux",
        "description": "Linux kernel source code"
      },
      {
        "name": "subsurface-divelog",
        "stars": 5000,
        "url": "https://github.com/torvalds/subsurface-divelog",
        "description": "Subsurface dive log software"
      }
    ],
    "profileUrl": "https://github.com/torvalds",
    "avatarUrl": "https://avatars.githubusercontent.com/u/1?v=4",
    "company": "Open Source",
    "location": "Finland",
    "email": null,
    "createdAt": "2005-10-26T19:39:12Z",
    "updatedAt": "2024-05-16T10:30:00Z"
  },
  "timestamp": "2024-05-16T10:30:00.000Z"
}
```

**Error Response** (Status: 404 - User Not Found):
```json
{
  "error": "Not Found",
  "message": "GitHub user \"invaliduser123\" does not exist"
}
```

**Error Response** (Status: 403 - Rate Limited):
```json
{
  "error": "Rate Limit Exceeded",
  "message": "GitHub API rate limit has been exceeded. Please try again later."
}
```

## 💡 Usage Examples

### Using cURL
```bash
# Fetch GitHub user analytics
curl http://localhost:5000/api/github/torvalds

# Check API health
curl http://localhost:5000/health
```

### Using JavaScript/Fetch API
```javascript
// Fetch user analytics
fetch('http://localhost:5000/api/github/torvalds')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Using JavaScript/Axios
```javascript
import axios from 'axios';

async function getGitHubUser() {
  try {
    const response = await axios.get('http://localhost:5000/api/github/torvalds');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

getGitHubUser();
```

### Using React Frontend
```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

function GitHubAnalytics() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchUser = async (username) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/github/${username}`);
      setUser(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input onChange={(e) => searchUser(e.target.value)} />
      {loading && <p>Loading...</p>}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}
```

## 🔄 How It Works

1. **Client Request**: User sends a GET request with a GitHub username
2. **Input Validation**: Server validates the username parameter
3. **API Calls**: Server makes calls to GitHub API to fetch:
   - User profile information
   - User's public repositories
4. **Data Processing**: Server processes the data to:
   - Calculate total stars across all repositories
   - Extract unique programming languages
   - Identify top 5 repositories by stars
   - Compile comprehensive analytics
5. **Response**: Server returns formatted JSON response with all analytics

## 📊 Data Processing Logic

- **Total Stars**: Sum of `stargazers_count` from all repositories
- **Languages**: Unique programming languages extracted from repository data
- **Top Repositories**: Sorted by `stargazers_count` in descending order, top 5 selected
- **Repository Count**: Public repositories count from user profile

## 🛡️ Error Handling

The API implements comprehensive error handling:

| Status Code | Scenario | Message |
|------------|----------|---------|
| 200 | Success | User data returned |
| 400 | Bad Request | Invalid or missing username |
| 404 | Not Found | GitHub user does not exist |
| 403 | Rate Limited | GitHub API rate limit exceeded |
| 500 | Server Error | Internal server error |

## 🔐 Security Considerations

- ✅ CORS enabled for cross-origin requests
- ✅ Input validation on all parameters
- ✅ Error messages don't expose sensitive information
- ✅ Uses public GitHub API (no authentication required for basic requests)
- ✅ Environment variables for configuration
- ✅ Proper HTTP status codes

## 📈 Performance Tips

- API caches are handled by client-side caching (consider adding Redis for production)
- GitHub API allows up to 60 requests/hour for unauthenticated requests
- For higher limits, use GitHub Personal Access Token in production
- The endpoint fetches up to 100 repositories per user

## 🚀 Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-app-name

# Push to Heroku
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to Other Platforms
- **Vercel**: Add serverless function wrapper
- **AWS**: Use AWS Lambda with API Gateway
- **DigitalOcean**: Deploy Node.js app directly
- **Render**: Connect GitHub repository and deploy

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Environment
NODE_ENV=development

# Optional: GitHub API (public - no token needed)
GITHUB_API_URL=https://api.github.com

# Optional: For higher rate limits, add your GitHub token
# GITHUB_TOKEN=your_github_personal_access_token
```

## 🎯 API Limitations

- **Rate Limit**: 60 requests/hour for unauthenticated requests from one IP
- **Repository Limit**: Fetches maximum 100 repositories per user
- **User Search**: Only works with public GitHub users

## 📚 API Documentation

For detailed GitHub API documentation, visit:
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub API Users Endpoint](https://docs.github.com/en/rest/reference/users)
- [GitHub API Repositories Endpoint](https://docs.github.com/en/rest/reference/repos)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Data from [GitHub API](https://api.github.com)
- Inspired by modern REST API best practices

## 📧 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Happy Coding! 🚀**

Made with ❤️ for developers who love GitHub analytics.
