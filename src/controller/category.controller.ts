import { Request, Response } from 'express';

import { Category, validateCategory } from '../models/category.model';
import { ifNotFoundById, validateMongoObjId } from '../utils/errorResponse';

const userProperty = { path: 'user', select: '-password' };

const getAllPublicCategory = async (req: Request, res: Response) => {
  const category = await Category.find().populate(userProperty);
  res.send(category);
};

const getAllUserCategory = async (req: Request, res: Response) => {
  const userId = req.body.authUser._id.toString();
  validateMongoObjId(userId, res);
  const category = await Category.find({ user: userId }).populate(userProperty);
  res.send(category);
};

const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId).populate(userProperty);
  res.send(category);
};

const addCategory = async (req: Request, res: Response) => {
  const user = req.body.authUser;
  const { name, scrollType } = req.body;

  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  let category = new Category({ name, scrollType, user });

  try {
    category = await category.save();
    category = await Category.findById(category._id).populate(userProperty);
    res.send(category);
  } catch (error) {
    res.status(400).send({ message: 'Duplicate category name' });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const user = req.body.authUser;
  const { name, scrollType } = req.body;

  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId);
  ifNotFoundById(category, res);

  //* Validates if user owns the category
  if (category.user.toString() === user._id) {
    const { error } = validateCategory(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    try {
      const category = await Category.findByIdAndUpdate(categoryId, { name, scrollType }, { new: true }).populate(
        userProperty
      );
      res.send(category);
    } catch (error) {
      res.status(400).send({ message: 'Duplicate category name' });
    }
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;
  const user = req.body.authUser;

  validateMongoObjId(categoryId, res);
  const category = await Category.findById(categoryId);
  ifNotFoundById(category, res);

  //* Validates if user owns the category
  if (category.user.toString() === user._id) {
    const category = await Category.findByIdAndDelete(categoryId).populate(userProperty);
    res.send(category);
  } else {
    res.status(401).send({ message: 'Unauthorized access ' });
  }
};

export default {
  getAllPublicCategory,
  getAllUserCategory,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
