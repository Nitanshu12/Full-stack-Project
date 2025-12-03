const projectModel = require('../../models/Project');

async function deleteProjectController(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const deleted = await projectModel.findOneAndDelete({ _id: id, createdBy: userId });

        if (!deleted) {
            return res.status(404).json({
                message: 'Project not found or you are not authorized to delete it',
                error: true,
                success: false
            });
        }

        res.status(200).json({
            data: { id: deleted._id },
            success: true,
            error: false,
            message: 'Project deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({
            message: err.message || 'Error deleting project',
            error: true,
            success: false
        });
    }
}

module.exports = deleteProjectController;


