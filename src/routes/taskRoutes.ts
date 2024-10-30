import express from 'express';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Controllers import
import {
    createTask,
    getTaskByID,
    getTasksByProject,
} from '../controllers/taskController';

// Create express router
const router = express.Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// Create task endpoint
router.post('/:projectID/tasks', createTask);

// Get tasks by project endpoint
router.get('/:projectID/tasks', getTasksByProject);

// Get task by ID endpoint
router.get('/:projectID/tasks/:taskID', getTaskByID);

export default router;
