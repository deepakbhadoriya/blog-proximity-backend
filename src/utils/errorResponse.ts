import mongoose from 'mongoose';

// @ts-ignore
const ifNotFoundById = (data, res, message = 'Not found') => !data && res.status(404).send({ message });

// @ts-ignore
const validateMongoObjId = (id, res, message = 'Not valid Id') =>
  !mongoose.Types.ObjectId.isValid(id) && res.status(404).send({ message });

export { ifNotFoundById, validateMongoObjId };
