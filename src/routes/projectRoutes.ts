import express from 'express';

// Controllers import
import {
    createProject,
    getProjectByID,
    getUserProjects,
    updateProject,
} from '../controllers/projectController';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Create express router
const router = express.Router();

// Create project endpoint
router.post('/', authMiddleware, createProject);

// Get user projects endpoint
router.get('/', authMiddleware, getUserProjects);

// Get project by ID endpoint
router.get('/:projectID', authMiddleware, getProjectByID);

// Update project by ID endpoint
router.put('/:projectID', authMiddleware, updateProject);

export default router;
