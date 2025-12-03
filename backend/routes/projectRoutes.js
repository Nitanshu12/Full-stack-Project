const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createProjectController = require('../controllers/Project/createProject');
const getProjectStatsController = require('../controllers/Project/getProjectStats');
const getAllProjectsController = require('../controllers/Project/getAllProjects');
const getMyProjectsController = require('../controllers/Project/getMyProjects');
const updateProjectController = require('../controllers/Project/updateProject');
const deleteProjectController = require('../controllers/Project/deleteProject');

router.post('/create', authToken, createProjectController);

router.get('/stats', authToken, getProjectStatsController);

router.get('/mine', authToken, getMyProjectsController);

router.put('/:id', authToken, updateProjectController);

router.delete('/:id', authToken, deleteProjectController);

router.get('/all', getAllProjectsController);

module.exports = router;

