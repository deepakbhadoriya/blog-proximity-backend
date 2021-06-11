import mongoose from 'mongoose';
import Joi from 'joi';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// @ts-ignore
function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).required(),
    user: Joi.object(),
    authUser: Joi.object(),
    thumbnailUrl: Joi.string(),
    category: Joi.array(),
  });

  return schema.validate(post);
}

const Post = mongoose.model('Post', PostSchema);

export { Post, validatePost };
