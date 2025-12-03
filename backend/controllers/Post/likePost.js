const postModel = require('../../models/Post');

async function likePostController(req, res) {
    try {
        const { postId } = req.params;
        const userId = req.userId; 

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                error: true,
                success: false
            });
        }

       
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
           
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            
            post.likes.push(userId);
        }

        await post.save();

        
        await post.populate('author', 'name email');
        await post.populate('likes', 'name');
        await post.populate('comments.user', 'name email');

        res.status(200).json({
            data: post,
            success: true,
            error: false,
            message: isLiked ? 'Post unliked successfully' : 'Post liked successfully'
        });

    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).json({
            message: err.message || 'Error liking post',
            error: true,
            success: false
        });
    }
}

module.exports = likePostController;

