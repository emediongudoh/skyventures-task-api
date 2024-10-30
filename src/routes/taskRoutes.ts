import express from 'express';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Controllers import
import {
    createTask,
    deleteTask,
    getTaskByID,
    getTasksByProject,
    updateTask,
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

// Update task by ID endpoint
router.put('/:projectID/tasks/:taskID', updateTask);

// Delete task by ID endpoint
router.delete('/:projectID/tasks/:taskID', deleteTask);

export default router;
