import { Request, Response } from 'express';

import { User, validateNameEmail } from '../models/user.model';
import { ifNotFoundById } from '../utils/errorResponse';

const getProfile = async (req: Request, res: Response) => {
  const userId = req.body.authUser._id;
  const user = await User.findById(userId).select('-password');
  ifNotFoundById(user, res);
  res.send(user);
};

const updateProfile = async (req: Request, res: Response) => {
  const userId = req.body.authUser._id;
  const {
    name,
    email,
    bio = '',
    avatar = 'https://static.toiimg.com/thumb/resizemode-4,msid-76729750,imgsize-249247,width-720/76729750.jpg',
  } = req.body;
  const { error } = validateNameEmail({ name, email });
  if (error) return res.status(400).send({ message: error.details[0].message });
  try {
    const user = await User.findByIdAndUpdate(userId, { name, email, bio, avatar }, { new: true }).select('-password');
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: 'Email Id Already present' });
  }
};

export default { getProfile, updateProfile };
