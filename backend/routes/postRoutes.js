const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createPostController = require('../controllers/Post/createPost');
const getAllPostsController = require('../controllers/Post/getAllPosts');
const likePostController = require('../controllers/Post/likePost');
const commentPostController = require('../controllers/Post/commentPost');

// Create a new post (protected route)
router.post('/create', authToken, createPostController);

// Get all posts (public route)
router.get('/all', getAllPostsController);

// Like/Unlike a post (protected route)
router.post('/:postId/like', authToken, likePostController);

// Comment on a post (protected route)
router.post('/:postId/comment', authToken, commentPostController);

module.exports = router;

