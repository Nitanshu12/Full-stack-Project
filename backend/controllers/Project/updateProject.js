const projectModel = require('../../models/Project');

async function updateProjectController(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, description, tags, lookingFor, location, isRemote, status } = req.body;

        const project = await projectModel.findOne({ _id: id, createdBy: userId });

        if (!project) {
            return res.status(404).json({
                message: 'Project not found or you are not authorized to update it',
                error: true,
                success: false
            });
        }

        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (tags !== undefined) project.tags = tags;
        if (lookingFor !== undefined) project.lookingFor = lookingFor;
        if (location !== undefined) project.location = location;
        if (isRemote !== undefined) project.isRemote = isRemote;
        if (status !== undefined) project.status = status;

        const updatedProject = await project.save();
        await updatedProject.populate('createdBy', 'name email');

        res.status(200).json({
            data: updatedProject,
            success: true,
            error: false,
            message: 'Project updated successfully'
        });
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({
            message: err.message || 'Error updating project',
            error: true,
            success: false
        });
    }
}

module.exports = updateProjectController;


