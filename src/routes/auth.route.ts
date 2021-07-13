import { Router } from 'express';
import auth from '../controller/auth.controller';

const router = Router();

// @route   GET api/v1/auth/login
// @desc    Get the logged in user details
// @access  Public
router.post('/login', auth.login);

// @route   POST api/v1/auth/register
// @desc    Register User route
// @access  Public
router.post('/register', auth.register);

export default router;
