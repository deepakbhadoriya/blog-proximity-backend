import mongoose from 'mongoose';
import Joi from 'joi';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    user: Joi.object().required,
  });

  return schema.validate(category);
}

const Category = mongoose.model('Category', CategorySchema);

export { Category, validateCategory };
