const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const mentorProfile = require('../controllers/Mentor/mentorProfile');
const mentorMentees = require('../controllers/Mentor/mentorMentees');
const mentorDashboardStats = require('../controllers/Mentor/mentorDashboardStats');

// All routes require mentor (or admin) role
router.use(authToken, authorizeRole('MENTOR', 'ADMIN'));

// Profile
router.get('/profile', mentorProfile);
router.put('/profile', mentorProfile);

// Mentees
router.get('/mentees', mentorMentees);

// Dashboard stats
router.get('/dashboard-stats', mentorDashboardStats);

module.exports = router;
