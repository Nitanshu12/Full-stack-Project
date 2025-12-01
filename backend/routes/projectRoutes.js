const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createProjectController = require('../controllers/Project/createProject');
const getProjectStatsController = require('../controllers/Project/getProjectStats');

// Create a new project (protected route)
router.post('/create', authToken, createProjectController);

// Get project stats for the logged-in user (protected route)
router.get('/stats', authToken, getProjectStatsController);

module.exports = router;

