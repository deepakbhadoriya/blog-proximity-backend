/* eslint-disable space-before-function-paren */
import { Router } from 'express';

import { User, validateNameEmail } from '../models/user.model';
import { ifNotFoundById } from '../utils/errorResponse';
import auth from '../middleware/auth';

const router = Router();

// @route   GET api/v1/profile
// @desc    Get the user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  const userId = req.body.authUser._id;
  const user = await User.findById(userId).select('-password');
  ifNotFoundById(user, res);
  res.send(user);
});

// @route   put api/v1/profile
// @desc    Update the user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  const userId = req.body.authUser._id;
  const {
    name,
    email,
    bio = '',
    avatar = 'https://static.toiimg.com/thumb/resizemode-4,msid-76729750,imgsize-249247,width-720/76729750.jpg',
  } = req.body;
  const { error } = validateNameEmail({ name, email });
  if (error) return res.status(400).send({ message: error.details[0].message });
  const user = await User.findByIdAndUpdate(userId, { name, email, bio, avatar }, { new: true }).select('-password');
  res.send(user);
});

export default router;
