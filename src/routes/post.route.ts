/* eslint-disable space-before-function-paren */
import { Router } from 'express';

import { Post, validatePost } from '../models/post.model';
import { ifNotFoundById, validateMongoObjId } from '../utils/errorResponse';
import auth from '../middleware/auth';

const router = Router();
const userProperty = { path: 'user', select: '-password' };

// @route   GET api/v1/post
// @desc    Get the all the post
// @access  Public
router.get('/', async (req, res) => {
  // @ts-ignore
  const query: {
    user: string;
    category: string;
    page: number;
    limit: number;
    // @ts-ignore
  } = req.query;

  // destructure user, category, page and limit and set default values
  const { user, category, page = 1, limit = 10 } = query || {};

  // @ts-ignore
  const match: { user: any; category: any } = {};
  if (user) match.user = user;
  if (category) match.category = category;

  const posts = await Post.find(match)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate(userProperty)
    .populate('category')
    .exec();

  // get total documents in the Posts collection
  const count = await Post.countDocuments(match);

  res.send({
    posts,
    totalPages: Math.ceil(count / limit),
    totalPosts: count,
    currentPage: page,
  });
});

// @route   GET api/v1/post/:postId
// @desc    Get the post by ID
// @access  Public
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;
  validateMongoObjId(postId, res);
  const post = await Post.findById(postId).populate(userProperty).populate('category');
  res.send(post);
});

// @route   POST api/v1/post
// @desc    Add new post
// @access  Private
router.post('/', auth, async (req, res) => {
  // @ts-ignore
  const user = req.user;
  const { title, description, thumbnailUrl, category } = req.body;

  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let post = new Post({ title, description, thumbnailUrl, category, user });

  post = await post.save();
  post = await Post.findById(post._id).populate(userProperty).populate('category');
  res.send(post);
});

// @route   PUT api/v1/post/:postId
// @desc    Update the post by Id
// @access  Private
router.put('/:postId', auth, async (req, res) => {
  const postId = req.params.postId;
  // @ts-ignore
  const user = req.user;

  validateMongoObjId(postId, res);
  const post = await Post.findById(postId);
  ifNotFoundById(post, res);

  const { title, description, thumbnailUrl = post.thumbnailUrl, category = post.category } = req.body;

  //* Validates if user owns the post
  if (post.user.toString() === user._id) {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, thumbnailUrl, category },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
      .populate(userProperty)
      .populate('category');

    res.send(updatedPost);
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
});

// @route   DELETE api/v1/post/:postId
// @desc    Delete the post by Id
// @access  Private
router.delete('/:postId', auth, async (req, res) => {
  const postId = req.params.postId;
  // @ts-ignore
  const user = req.user;

  validateMongoObjId(postId, res);
  const post = await Post.findById(postId);
  ifNotFoundById(post, res);

  //* Validates if user owns the post
  if (post.user.toString() === user._id) {
    const post = await Post.findByIdAndDelete(postId).populate(userProperty).populate('category');
    res.send(post);
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
});

export default router;
