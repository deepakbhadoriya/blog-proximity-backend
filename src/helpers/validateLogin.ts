import { Request } from 'express';
import Joi from 'joi';

export const validateLogin = (req: Request) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};
