import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pick } from 'lodash';

import { validateLogin } from '../helpers/validateLogin';
import { User, validateUser } from '../models/user.model';

const login = async (req: Request, res: Response) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ message: 'Invalid email or password.' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({ message: 'Invalid email or password.' });

  const token = user.generateAuthToken();
  res.send({ token });
};

const register = async (req: Request, res: Response) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ message: 'User already registered.' });

  user = new User(pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.json({ token });
};

export default { login, register };
