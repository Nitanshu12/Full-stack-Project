const connectionModel = require("../../models/Connection");

async function mentorDashboardStats(req, res) {
    try {
        const totalMentees = await connectionModel.countDocuments({
            $or: [
                { requester: req.userId },
                { recipient: req.userId }
            ],
            status: 'accepted'
        });

        const pendingRequests = await connectionModel.countDocuments({
            recipient: req.userId,
            status: 'pending'
        });

        res.status(200).json({
            data: {
                totalMentees,
                pendingRequests,
                totalSessions: 0,
                reviews: 0
            },
            success: true,
            error: false,
            message: "Mentor dashboard stats fetched"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = mentorDashboardStats;
