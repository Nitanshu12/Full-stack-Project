const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createProjectController = require('../controllers/Project/createProject');
const getProjectStatsController = require('../controllers/Project/getProjectStats');
const getAllProjectsController = require('../controllers/Project/getAllProjects');
const getMyProjectsController = require('../controllers/Project/getMyProjects');
const updateProjectController = require('../controllers/Project/updateProject');
const deleteProjectController = require('../controllers/Project/deleteProject');

// Create a new project (protected route)
router.post('/create', authToken, createProjectController);

// Get project stats for the logged-in user (protected route)
router.get('/stats', authToken, getProjectStatsController);

// Get projects created by the logged-in user
router.get('/mine', authToken, getMyProjectsController);

// Update a project (only by owner)
router.put('/:id', authToken, updateProjectController);

// Delete a project (only by owner)
router.delete('/:id', authToken, deleteProjectController);

// Get all active projects (public route, but can be protected if needed)
router.get('/all', getAllProjectsController);

module.exports = router;

