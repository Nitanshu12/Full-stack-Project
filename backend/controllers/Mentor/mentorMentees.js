const connectionModel = require("../../models/Connection");
const userModel = require("../../models/User");

async function mentorMentees(req, res) {
    try {
        const connections = await connectionModel.find({
            $or: [
                { requester: req.userId },
                { recipient: req.userId }
            ],
            status: 'accepted'
        }).lean();

        // Get the other user IDs from connections
        const menteeIds = connections.map(conn => {
            return conn.requester.toString() === req.userId
                ? conn.recipient
                : conn.requester;
        });

        const mentees = await userModel.find({
            _id: { $in: menteeIds },
            role: 'STUDENT'
        }).select('name email skills interests createdAt').lean();

        res.status(200).json({
            data: mentees,
            success: true,
            error: false,
            message: "Mentees fetched"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = mentorMentees;
