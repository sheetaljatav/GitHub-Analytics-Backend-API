// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import routes
const githubRoutes = require('./routes/githubRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Enable CORS to allow requests from different origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// API Routes
// Use GitHub routes for API endpoints
app.use('/api/github', githubRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to GitHub Analytics API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      github_user: '/api/github/:username'
    }
  });
});

// 404 - Not Found middleware
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested URL ${req.originalUrl} does not exist`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}`);
  console.log(`🔍 GitHub Analytics Endpoint: http://localhost:${PORT}/api/github/:username`);
});
