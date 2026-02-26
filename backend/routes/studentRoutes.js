const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const createProjectController = require('../controllers/Project/createProject');
const getMyProjectsController = require('../controllers/Project/getMyProjects');
const getProjectStatsController = require('../controllers/Project/getProjectStats');
const updateProjectController = require('../controllers/Project/updateProject');
const deleteProjectController = require('../controllers/Project/deleteProject');
const createConnectionController = require('../controllers/User/createConnection');
const getMyConnectionsController = require('../controllers/User/getMyConnections');
const allUsers = require('../controllers/User/allUsers');

// All routes require student (or admin) role
router.use(authToken, authorizeRole('STUDENT', 'ADMIN'));

// Projects
router.post('/projects/create', createProjectController);
router.get('/projects', getMyProjectsController);
router.get('/projects/stats', getProjectStatsController);
router.put('/projects/:id', updateProjectController);
router.delete('/projects/:id', deleteProjectController);

// Connections
router.post('/connections/connect', createConnectionController);
router.get('/connections/my', getMyConnectionsController);

// Smart Matches
router.get('/matches', allUsers);

module.exports = router;
