const postModel = require('../../models/Post');

async function commentPostController(req, res) {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.userId; 

      
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: 'Comment text is required',
                error: true,
                success: false
            });
        }

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                error: true,
                success: false
            });
        }

        post.comments.push({
            user: userId,
            text: text.trim()
        });

        await post.save();


        await post.populate('author', 'name email');
        await post.populate('likes', 'name');
        await post.populate('comments.user', 'name email');

        res.status(200).json({
            data: post,
            success: true,
            error: false,
            message: 'Comment added successfully'
        });

    } catch (err) {
        console.error('Error commenting on post:', err);
        res.status(500).json({
            message: err.message || 'Error commenting on post',
            error: true,
            success: false
        });
    }
}

module.exports = commentPostController;

