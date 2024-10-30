import express from 'express';

// Controllers import
import {
    createProject,
    softDeleteProject,
    getProjectByID,
    getUserProjects,
    updateProject,
} from '../controllers/projectController';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Create express router
const router = express.Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// Create project endpoint
router.post('/', createProject);

// Get user projects endpoint
router.get('/', getUserProjects);

// Get project by ID endpoint
router.get('/:projectID', getProjectByID);

// Update project by ID endpoint
router.put('/:projectID', updateProject);

// Soft delete project by ID endpoint
router.put('/:projectID/soft-delete', softDeleteProject);

export default router;
