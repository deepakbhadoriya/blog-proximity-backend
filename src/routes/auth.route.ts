/* eslint-disable space-before-function-paren */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import { pick } from 'lodash';

import auth from '../middleware/auth';
import { User, validateUser } from '../models/user.model';

const router = Router();

// @route   GET api/v1/auth/profile
// @desc    Get the logged in user details
// @access  Private
router.get('/profile', auth, async (req: Request, res: Response) => {
  // @ts-ignore
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// @route   GET api/v1/auth/login
// @desc    Get the logged in user details
// @access  Public
router.post('/login', async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send({ token });
});

const validateLogin = (req: Request) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  // @ts-ignore
  return schema.validate(req);
};

// @route   POST api/v1/auth/register
// @desc    Register User route
// @access  Public
router.post('/register', async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.json({ token });
});

export default router;
