const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const adminListUsers = require('../controllers/Admin/adminListUsers');
const adminGetUser = require('../controllers/Admin/adminGetUser');
const adminUpdateUserStatus = require('../controllers/Admin/adminUpdateUserStatus');
const adminUpdateUserRole = require('../controllers/Admin/adminUpdateUserRole');
const adminDeleteUser = require('../controllers/Admin/adminDeleteUser');
const adminAnalytics = require('../controllers/Admin/adminAnalytics');

// All routes require admin role
router.use(authToken, authorizeRole('ADMIN'));

// Users management
router.get('/users', adminListUsers);
router.get('/users/:id', adminGetUser);
router.put('/users/:id/status', adminUpdateUserStatus);
router.put('/users/:id/role', adminUpdateUserRole);
router.delete('/users/:id', adminDeleteUser);

// Analytics
router.get('/analytics', adminAnalytics);

module.exports = router;
