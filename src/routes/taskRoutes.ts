import express from 'express';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Controllers import
import {
    bulkUpdateTasksStatus,
    createTask,
    softDeleteTask,
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

// Bulk update tasks status endpoint
router.put('/:projectID/tasks/bulk-update', bulkUpdateTasksStatus);

// Get task by ID endpoint
router.get('/:projectID/tasks/:taskID', getTaskByID);

// Update task by ID endpoint
router.put('/:projectID/tasks/:taskID', updateTask);

// Soft delete task by ID endpoint
router.put('/:projectID/tasks/:taskID/soft-delete', softDeleteTask);

export default router;
