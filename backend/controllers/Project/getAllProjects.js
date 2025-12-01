const projectModel = require('../../models/Project');

async function getAllProjectsController(req, res) {
    try {
        const { search, tags, location, isRemote, page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build query
        const query = {
            status: 'active'
        };

        // Search by title, description, or tags
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { lookingFor: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Filter by tags
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            query.tags = { $in: tagArray };
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by remote
        if (isRemote !== undefined) {
            query.isRemote = isRemote === 'true';
        }

        // Get projects with pagination
        const projects = await projectModel
            .find(query)
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await projectModel.countDocuments(query);

        res.status(200).json({
            data: {
                projects,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalProjects: total,
                    hasMore: skip + projects.length < total
                }
            },
            success: true,
            error: false,
            message: 'Projects retrieved successfully'
        });

    } catch (err) {
        console.error('Error getting projects:', err);
        res.status(500).json({
            message: err.message || 'Error getting projects',
            error: true,
            success: false
        });
    }
}

module.exports = getAllProjectsController;

