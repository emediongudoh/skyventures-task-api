import express from 'express';

// Controller imports
import { register } from '../controllers/userController';

// Create express router
const router = express.Router();

// Register endpoint
router.post('/register', register);

export default router;
