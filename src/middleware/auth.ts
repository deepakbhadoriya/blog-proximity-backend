import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get Token from Header
  const token = req.header('x-auth-token');

  // Check if Not Token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETE as string);
    req.body.authUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not Valid' });
  }
};

export default auth;
