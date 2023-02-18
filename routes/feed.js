const express = require('express');
const { body } = require('express-validator')

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/getposts - Get all the posts to render in the field
router.get('/getPosts', feedController.getPosts);

// POST /feed/createPost - create a post with user entered content
router.post('/createPost', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 10 })
], feedController.createPost);

router.get('/getPost/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 10 })
], feedController.editPost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;

// /media/soumyanil/New Volume/social-media-api