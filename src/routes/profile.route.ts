import { Router } from 'express';

import profile from '../controller/profile.controller';
import auth from '../middleware/auth';

const router = Router();

// @route   GET api/v1/profile
// @desc    Get the user profile
// @access  Private
router.get('/', auth, profile.getProfile);

// @route   put api/v1/profile
// @desc    Update the user profile
// @access  Private
router.put('/', auth, profile.updateProfile);

export default router;
