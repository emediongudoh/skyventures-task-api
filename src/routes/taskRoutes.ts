import express from 'express';

// Middlewares import
import { authMiddleware } from '../middlewares/authMiddleware';

// Controllers import
import { createTask } from '../controllers/taskController';

// Create express router
const router = express.Router();

// Apply authMiddleware to all routes in this router
router.use(authMiddleware);

// Create task endpoint
router.post('/:projectID/tasks', createTask);

export default router;
