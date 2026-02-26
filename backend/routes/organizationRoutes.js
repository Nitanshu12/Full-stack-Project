const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const orgProfile = require('../controllers/Organization/orgProfile');
const orgProjects = require('../controllers/Organization/orgProjects');
const orgDashboardStats = require('../controllers/Organization/orgDashboardStats');

// All routes require organization (or admin) role
router.use(authToken, authorizeRole('ORGANIZATION', 'ADMIN'));

// Profile
router.get('/profile', orgProfile);
router.put('/profile', orgProfile);

// Projects
router.get('/projects', orgProjects);
router.post('/projects/create', orgProjects);

// Dashboard stats
router.get('/dashboard-stats', orgDashboardStats);

module.exports = router;
