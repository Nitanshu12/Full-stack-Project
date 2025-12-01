const projectModel = require('../../models/Project');

async function getProjectStatsController(req, res) {
    try {
        const userId = req.userId; // From auth middleware

        // Count active projects for the user
        const activeProjectsCount = await projectModel.countDocuments({
            createdBy: userId,
            status: 'active'
        });

        res.status(200).json({
            data: {
                activeProjects: activeProjectsCount
            },
            success: true,
            error: false,
            message: 'Project stats retrieved successfully'
        });

    } catch (err) {
        console.error('Error getting project stats:', err);
        res.status(500).json({
            message: err.message || 'Error getting project stats',
            error: true,
            success: false
        });
    }
}

module.exports = getProjectStatsController;

