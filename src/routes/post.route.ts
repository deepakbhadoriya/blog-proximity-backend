import { Router } from 'express';

import post from '../controller/post.controller';
import auth from '../middleware/auth';

const router = Router();

// @route   GET api/v1/post
// @desc    Get the all the post
// @access  Public
router.get('/', post.getAllPost);

// @route   GET api/v1/post/user
// @desc    Get the all the user post
// @access  Private
router.get('/user', auth, post.getUserAllPost);

// @route   GET api/v1/post/:postId
// @desc    Get the post by ID
// @access  Public
router.get('/:postId', post.getPostById);

// @route   POST api/v1/post
// @desc    Add new post
// @access  Private
router.post('/', auth, post.addPost);

// @route   PUT api/v1/post/:postId
// @desc    Update the post by Id
// @access  Private
router.put('/:postId', auth, post.updatePost);

// @route   DELETE api/v1/post/:postId
// @desc    Delete the post by Id
// @access  Private
router.delete('/:postId', auth, post.deletePost);

export default router;
