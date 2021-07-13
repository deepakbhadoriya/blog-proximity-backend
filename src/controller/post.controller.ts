import { Request, Response } from 'express';

import { Post, validatePost } from '../models/post.model';
import { ifNotFoundById, validateMongoObjId } from '../utils/errorResponse';

interface QueryTS {
  user?: string;
  category?: string;
  page?: number;
  limit?: number;
}

const userProperty = { path: 'user', select: '-password' };

const getAllPost = async (req: Request, res: Response) => {
  const query = req.query;

  // destructure user, category, page and limit and set default values
  const { user, category, page = 1, limit = 10 } = (query as QueryTS) || {};

  const match: { user?: string; category?: string } = {};
  if (user) match.user = user;
  if (category) match.category = category;

  const posts = await Post.find(match)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate(userProperty)
    .populate('category')
    .sort({ createdAt: 'desc' })
    .exec();

  // get total documents in the Posts collection
  const count = await Post.countDocuments(match);

  res.send({
    posts,
    totalPages: Math.ceil(count / limit),
    totalPosts: count,
    currentPage: page,
  });
};

const getUserAllPost = async (req: Request, res: Response) => {
  const user = req.body.authUser._id;
  const query = req.query;

  // destructure user, category, page and limit and set default values
  const { category, page = 1, limit = 10 } = (query as QueryTS) || {};

  const match: { user?: string; category?: string } = {};
  if (user) match.user = user;
  if (category) match.category = category;

  const posts = await Post.find(match)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate(userProperty)
    .populate('category')
    .sort({ createdAt: 'desc' })
    .exec();

  // get total documents in the Posts collection
  const count = await Post.countDocuments(match);

  res.send({
    posts,
    totalPages: Math.ceil(count / limit),
    totalPosts: count,
    currentPage: page,
  });
};

const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  validateMongoObjId(postId, res);
  const post = await Post.findById(postId).populate(userProperty).populate('category');
  res.send(post);
};

const addPost = async (req: Request, res: Response) => {
  const user = req.body.authUser;
  const { title, description, thumbnailUrl = 'https://placeimg.com/1000/600/any', category } = req.body;

  const { error } = validatePost({ title, description });
  if (error) return res.status(400).send({ message: error.details[0].message });

  let post = new Post({ title, description, thumbnailUrl, category, user });

  post = await post.save();
  post = await Post.findById(post._id).populate(userProperty).populate('category');
  res.send(post);
};

const updatePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const user = req.body.authUser;

  validateMongoObjId(postId, res);
  const post = await Post.findById(postId);
  ifNotFoundById(post, res);

  const { title, description, thumbnailUrl = post.thumbnailUrl, category = post.category } = req.body;

  //* Validates if user owns the post
  if (post.user.toString() === user._id) {
    const { error } = validatePost({ title, description });
    if (error) return res.status(400).send({ message: error.details[0].message });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description, thumbnailUrl, category },
      { new: true }
    )
      .populate(userProperty)
      .populate('category');

    res.send(updatedPost);
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
};

const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  const user = req.body.authUser;

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
};

export default { getAllPost, getUserAllPost, getPostById, addPost, updatePost, deletePost };
