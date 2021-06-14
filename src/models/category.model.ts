import mongoose from 'mongoose';
import Joi from 'joi';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  scrollType: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

// @ts-ignore
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().required(),
    scrollType: Joi.string().required(),
    user: Joi.object(),
    authUser: Joi.object(),
  });

  return schema.validate(category);
}

const Category = mongoose.model('Category', CategorySchema);

export { Category, validateCategory };
