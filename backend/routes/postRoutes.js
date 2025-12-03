const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authMiddleware');
const createPostController = require('../controllers/Post/createPost');
const getAllPostsController = require('../controllers/Post/getAllPosts');
const likePostController = require('../controllers/Post/likePost');
const commentPostController = require('../controllers/Post/commentPost');

router.post('/create', authToken, createPostController);

router.get('/all', getAllPostsController);

router.post('/:postId/like', authToken, likePostController);

router.post('/:postId/comment', authToken, commentPostController);

module.exports = router;

