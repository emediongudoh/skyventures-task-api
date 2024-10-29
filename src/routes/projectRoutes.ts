import express from 'express';

// Controllers import
import {
    createProject,
    getUserProjects,
} from '../controllers/projectController';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Create express router
const router = express.Router();

// Create project endpoint
router.post('/', authMiddleware, createProject);

// Get user projects endpoint
router.get('/', authMiddleware, getUserProjects);

export default router;
