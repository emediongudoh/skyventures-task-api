import express from 'express';

// Controllers import
import { createProject } from '../controllers/projectController';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Create express router
const router = express.Router();

// Create project endpoint
router.post('/', authMiddleware, createProject);

export default router;
