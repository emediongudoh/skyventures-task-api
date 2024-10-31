'use strict';
/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API for managing tasks
 */
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
// Middlewares import
const authMiddleware_1 = require('../middlewares/authMiddleware');
// Controllers import
const taskController_1 = require('../controllers/taskController');
// Create express router
const router = express_1.default.Router();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * @swagger
 * /api/projects/{projectID}/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project to which the task belongs
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request, task title is required
 */
// Create task endpoint
router.post('/:projectID/tasks', taskController_1.createTask);
/**
 * @swagger
 * /api/projects/{projectID}/tasks:
 *   get:
 *     summary: Get tasks by project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project to fetch tasks from
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter tasks by status
 *         schema:
 *           type: string
 *       - in: query
 *         name: due_date
 *         required: false
 *         description: Filter tasks by due date
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           format: int32
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of tasks per page
 *         schema:
 *           type: integer
 *           format: int32
 *     responses:
 *       200:
 *         description: A list of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     totalCount:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       404:
 *         description: Project not found or unauthorized
 */
// Get tasks by project endpoint
router.get('/:projectID/tasks', taskController_1.getTasksByProject);
/**
 * @swagger
 * /api/projects/{projectID}/tasks/bulk-update:
 *   put:
 *     summary: Bulk update tasks status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskIDs:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *     responses:
 *       200:
 *         description: Tasks updated successfully
 *       404:
 *         description: Project not found or unauthorized
 */
// Bulk update tasks status endpoint
router.put(
    '/:projectID/tasks/bulk-update',
    taskController_1.bulkUpdateTasksStatus
);
/**
 * @swagger
 * /api/projects/{projectID}/tasks/{taskID}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskID
 *         required: true
 *         description: The ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found within this project
 */
// Get task by ID endpoint
router.get('/:projectID/tasks/:taskID', taskController_1.getTaskByID);
/**
 * @swagger
 * /api/projects/{projectID}/tasks/{taskID}:
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskID
 *         required: true
 *         description: The ID of the task to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found or unauthorized
 */
// Update task by ID endpoint
router.put('/:projectID/tasks/:taskID', taskController_1.updateTask);
/**
 * @swagger
 * /api/projects/{projectID}/tasks/{taskID}/soft-delete:
 *   put:
 *     summary: Soft delete task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         required: true
 *         description: The ID of the project
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskID
 *         required: true
 *         description: The ID of the task to soft delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task soft deleted successfully
 *       404:
 *         description: Task not found or unauthorized
 */
// Soft delete task by ID endpoint
router.put(
    '/:projectID/tasks/:taskID/soft-delete',
    taskController_1.softDeleteTask
);
exports.default = router;
