const projectModel = require('../../models/Project');

async function createProjectController(req, res) {
    try {
        const { title, description, tags, lookingFor, location, isRemote } = req.body;
        const userId = req.userId; 

       
        if (!title) {
            return res.status(400).json({
                message: 'Project title is required',
                error: true,
                success: false
            });
        }

        if (!description) {
            return res.status(400).json({
                message: 'Project description is required',
                error: true,
                success: false
            });
        }

       
        const projectData = {
            title,
            description,
            tags: tags || [],
            lookingFor: lookingFor || [],
            location: location || '',
            isRemote: isRemote || false,
            createdBy: userId
        };

        const newProject = new projectModel(projectData);
        const savedProject = await newProject.save();

       
        await savedProject.populate('createdBy', 'name email');

        res.status(201).json({
            data: savedProject,
            success: true,
            error: false,
            message: 'Project created successfully!'
        });

    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({
            message: err.message || 'Error creating project',
            error: true,
            success: false
        });
    }
}

module.exports = createProjectController;

