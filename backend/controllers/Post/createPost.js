const postModel = require('../../models/Post');

async function createPostController(req, res) {
    try {
        const { content } = req.body;
        const userId = req.userId; 

       
        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                message: 'Post content is required',
                error: true,
                success: false
            });
        }

   
        const newPost = new postModel({
            content: content.trim(),
            author: userId,
            likes: [],
            comments: []
        });

        const savedPost = await newPost.save();
        
       
        await savedPost.populate('author', 'name email');

        res.status(201).json({
            data: savedPost,
            success: true,
            error: false,
            message: 'Post created successfully!'
        });

    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({
            message: err.message || 'Error creating post',
            error: true,
            success: false
        });
    }
}

module.exports = createPostController;

