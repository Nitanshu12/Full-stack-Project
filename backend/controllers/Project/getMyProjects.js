const projectModel = require('../../models/Project');

async function getMyProjectsController(req, res) {
    try {
        const userId = req.userId;

        const projects = await projectModel
            .find({ createdBy: userId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            data: { projects },
            success: true,
            error: false,
            message: 'Your projects retrieved successfully'
        });
    } catch (err) {
        console.error('Error getting user projects:', err);
        res.status(500).json({
            message: err.message || 'Error getting user projects',
            error: true,
            success: false
        });
    }
}

module.exports = getMyProjectsController;


