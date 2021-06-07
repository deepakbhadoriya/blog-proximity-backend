import { Errback, Request, Response, NextFunction } from 'express';
import log from '../logger';

const error = (err: Errback, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  log.error(err.message, err);
  res.status(500).send('Something failed.');
};

export default error;
