const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createConnectionController = require('../controllers/User/createConnection');
const getMyConnectionsController = require('../controllers/User/getMyConnections');

// Create a new connection with another user
router.post('/connect', authToken, createConnectionController);

// Get all connections for the logged-in user
router.get('/my', authToken, getMyConnectionsController);

module.exports = router;


