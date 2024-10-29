import express from 'express';

// Controller imports
import { register, login, testAuthFunc } from '../controllers/userController';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Create express router
const router = express.Router();

// Register endpoint
router.post('/register', register);

// Login endpoint
router.post('/login', login);

// Test auth middleware
router.get('/test-auth', authMiddleware, testAuthFunc);

export default router;
