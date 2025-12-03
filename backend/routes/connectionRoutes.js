const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createConnectionController = require('../controllers/User/createConnection');
const getMyConnectionsController = require('../controllers/User/getMyConnections');

router.post('/connect', authToken, createConnectionController);
router.get('/my', authToken, getMyConnectionsController);

module.exports = router;


