import { Express, Request, Response } from 'express';

import auth from './auth.route';
import category from './category.route';
import post from './post.route';
import error from '../middleware/error';

const route = (app: Express) => {
  // Routes
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/category', category);
  app.use('/api/v1/post', post);

  // Test Routes
  app.use('/__test', (req: Request, res: Response) => res.json('API working'));
  app.use('/', (req: Request, res: Response) => res.json('Blog API'));
  // app.use('', (req: Request, res: Response) => res.status(404).json({ message: 'not found' }));

  app.use(error);
};

export default route;
