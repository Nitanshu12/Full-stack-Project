const projectModel = require("../../models/Project");

async function orgProjects(req, res) {
    try {
        if (req.method === 'GET') {
            const projects = await projectModel.find({ createdBy: req.userId })
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).json({
                data: projects,
                success: true,
                error: false,
                message: "Organization projects fetched"
            });
        }

        if (req.method === 'POST') {
            const { title, description, techStack, teamSize, status, timeline } = req.body;

            const project = new projectModel({
                title,
                description,
                techStack: techStack || [],
                teamSize: teamSize || 1,
                status: status || 'Open',
                timeline: timeline || '',
                createdBy: req.userId
            });

            const savedProject = await project.save();

            return res.status(201).json({
                data: savedProject,
                success: true,
                error: false,
                message: "Project created successfully"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = orgProjects;
