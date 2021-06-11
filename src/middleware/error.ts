import { Request, Response, NextFunction } from 'express';
import log from '../logger';

const error = (err: { message: string }, req: Request, res: Response, next: NextFunction) => {
  log.error(err.message as string, err);
  res.status(500).send('Something failed.');
};

export default error;
