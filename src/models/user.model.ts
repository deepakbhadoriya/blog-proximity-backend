import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRETE as string);
  return token;
};

// @ts-ignore
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
};

// @ts-ignore
const validateNameEmail = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(user);
};

const User = mongoose.model('User', UserSchema);

export { User, validateUser, validateNameEmail };
