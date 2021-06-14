/* eslint-disable space-before-function-paren */
import { Router } from 'express';

import { Category, validateCategory } from '../models/category.model';
import { ifNotFoundById, validateMongoObjId } from '../utils/errorResponse';
import auth from '../middleware/auth';

const router = Router();

const userProperty = { path: 'user', select: '-password' };

// @route   GET api/v1/category
// @desc    Get the all the category
// @access  Public
router.get('/', async (req, res) => {
  const category = await Category.find().populate(userProperty);
  res.send(category);
});

// @route   GET api/v1/category/user/:userId
// @desc    Get the all category of User
// @access  Public
router.get('/user', auth, async (req, res) => {
  const userId = req.body.authUser._id.toString();
  validateMongoObjId(userId, res);
  const category = await Category.find({ user: userId }).populate(userProperty);
  res.send(category);
});

// @route   GET api/v1/category/:topicId
// @desc    Get the category by ID
// @access  Public
router.get('/:categoryId', async (req, res) => {
  const categoryId = req.params.categoryId;
  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId).populate(userProperty);
  res.send(category);
});

// @route   POST api/v1/category
// @desc    Add new category
// @access  Private
router.post('/', auth, async (req, res) => {
  const user = req.body.authUser;
  const { name, scrollType } = req.body;

  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let category = new Category({ name, scrollType, user });

  try {
    category = await category.save();
    category = await Category.findById(category._id).populate(userProperty);
    res.send(category);
  } catch (error) {
    res.status(400).send({ message: 'Duplicate category name' });
  }
});

// @route   PUT api/v1/category/:categoryId
// @desc    Update the category by Id
// @access  Private
router.put('/:categoryId', auth, async (req, res) => {
  const categoryId = req.params.categoryId;
  const user = req.body.authUser;
  const { name, scrollType } = req.body;

  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId);
  ifNotFoundById(category, res);

  //* Validates if user owns the category
  if (category.user.toString() === user._id) {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    try {
      const category = await Category.findByIdAndUpdate(categoryId, { name, scrollType }, { new: true }).populate(
        // eslint-disable-next-line comma-dangle
        userProperty
      );
      res.send(category);
    } catch (error) {
      res.status(400).send({ message: 'Duplicate category name' });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
});

// @route   DELETE api/v1/category/:categoryId
// @desc    Delete the category by Id
// @access  Private
router.delete('/:categoryId', auth, async (req, res) => {
  const categoryId = req.params.categoryId;
  const user = req.body.authUser;

  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId);
  ifNotFoundById(category, res);

  //* Validates if user owns the category
  if (category.user.toString() === user._id) {
    const category = await Category.findByIdAndDelete(categoryId).populate(userProperty);
    res.send(category);
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
});

export default router;
