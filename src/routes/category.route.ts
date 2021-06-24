import { Router } from 'express';

import auth from '../middleware/auth';
import category from '../controller/category.controller';

const router = Router();

// @route   GET api/v1/category
// @desc    Get the all the category
// @access  Public
router.get('/', category.getAllPublicCategory);

// @route   GET api/v1/category/user/:userId
// @desc    Get the all category of User
// @access  Public
router.get('/user', auth, category.getAllUserCategory);

// @route   GET api/v1/category/:categoryId
// @desc    Get the category by ID
// @access  Public
router.get('/:categoryId', category.getCategoryById);

// @route   POST api/v1/category
// @desc    Add new category
// @access  Private
router.post('/', auth, category.addCategory);

// @route   PUT api/v1/category/:categoryId
// @desc    Update the category by Id
// @access  Private
router.put('/:categoryId', auth, category.updateCategory);

// @route   DELETE api/v1/category/:categoryId
// @desc    Delete the category by Id
// @access  Private
router.delete('/:categoryId', auth, category.deleteCategory);

export default router;
