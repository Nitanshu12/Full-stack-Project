const connectionModel = require('../../models/Connection');

async function getMyConnectionsController(req, res) {
    try {
        const userId = req.userId;

        const connections = await connectionModel
            .find({
                status: 'connected',
                $or: [{ requester: userId }, { receiver: userId }]
            })
            .populate('requester receiver', 'name email skills interests');

        res.status(200).json({
            message: 'Connections retrieved successfully',
            success: true,
            error: false,
            data: connections
        });
    } catch (err) {
        console.error('Error getting connections:', err);
        res.status(500).json({
            message: err.message || 'Failed to get connections',
            success: false,
            error: true
        });
    }
}

module.exports = getMyConnectionsController;


