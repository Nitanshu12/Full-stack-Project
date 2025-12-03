const connectionModel = require('../../models/Connection');
const userModel = require('../../models/User');

async function createConnectionController(req, res) {
    try {
        const userId = req.userId;
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({
                message: 'Target user is required',
                success: false,
                error: true
            });
        }

        if (targetUserId === String(userId)) {
            return res.status(400).json({
                message: 'You cannot connect with yourself',
                success: false,
                error: true
            });
        }

        const targetUser = await userModel.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                message: 'Target user not found',
                success: false,
                error: true
            });
        }

        // Check if connection already exists (in either direction)
        const existing = await connectionModel.findOne({
            $or: [
                { requester: userId, receiver: targetUserId },
                { requester: targetUserId, receiver: userId }
            ]
        });

        if (existing) {
            return res.status(200).json({
                message: 'You are already connected with this user',
                success: true,
                error: false,
                data: existing
            });
        }

        const connection = await connectionModel.create({
            requester: userId,
            receiver: targetUserId,
            status: 'connected'
        });

        await connection.populate('requester receiver', 'name email');

        res.status(201).json({
            message: 'Connection created successfully',
            success: true,
            error: false,
            data: connection
        });
    } catch (err) {
        console.error('Error creating connection:', err);
        res.status(500).json({
            message: err.message || 'Failed to create connection',
            success: false,
            error: true
        });
    }
}

module.exports = createConnectionController;


