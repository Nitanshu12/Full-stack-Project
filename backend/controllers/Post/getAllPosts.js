const postModel = require('../../models/Post');

async function getAllPostsController(req, res) {
    try {
        
        const posts = await postModel
            .find()
            .populate('author', 'name email')
            .populate('likes', 'name')
            .populate('comments.user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            data: posts,
            success: true,
            error: false,
            message: 'Posts retrieved successfully'
        });

    } catch (err) {
        console.error('Error getting posts:', err);
        res.status(500).json({
            message: err.message || 'Error getting posts',
            error: true,
            success: false
        });
    }
}

module.exports = getAllPostsController;

