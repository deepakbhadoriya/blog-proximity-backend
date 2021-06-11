import mongoose from 'mongoose';
import { Response } from 'express';

const ifNotFoundById = (data: any, res: Response, message = 'Not found') => !data && res.status(404).send({ message });

const validateMongoObjId = (id: string, res: Response, message = 'Not valid Id') =>
  !mongoose.Types.ObjectId.isValid(id) && res.status(404).send({ message });

export { ifNotFoundById, validateMongoObjId };
