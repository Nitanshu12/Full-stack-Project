const projectModel = require("../../models/Project");
const connectionModel = require("../../models/Connection");

async function orgDashboardStats(req, res) {
    try {
        const postedProjects = await projectModel.countDocuments({ createdBy: req.userId });

        const connections = await connectionModel.countDocuments({
            $or: [
                { requester: req.userId },
                { recipient: req.userId }
            ],
            status: 'accepted'
        });

        res.status(200).json({
            data: {
                postedProjects,
                teamMembers: connections,
                applications: 0,
                activeCollabs: 0
            },
            success: true,
            error: false,
            message: "Organization dashboard stats fetched"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = orgDashboardStats;
