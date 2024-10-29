import express from 'express';

// Controller imports
import { register, login } from '../controllers/userController';

// Create express router
const router = express.Router();

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

export default router;
