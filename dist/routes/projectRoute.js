'use strict';
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
// Controllers import
const projectController_1 = require('../controllers/projectController');
// Middlewares import
const authMiddleware_1 = require('../middlewares/authMiddleware');
// Create express router
const router = express_1.default.Router();
// Apply authMiddleware to all routes in this router
router.use(authMiddleware_1.authMiddleware);
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The project name
 *                 example: New Project
 *               description:
 *                 type: string
 *                 description: The project description
 *                 example: Project description here
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Bad request, project name is required
 */
router.post('/', projectController_1.createProject);
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Retrieve a list of user projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get('/', projectController_1.getUserProjects);
/**
 * @swagger
 * /api/projects/{projectID}:
 *   get:
 *     summary: Get project details by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project to retrieve
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found or unauthorized
 */
router.get('/:projectID', projectController_1.getProjectByID);
/**
 * @swagger
 * /api/projects/{projectID}:
 *   put:
 *     summary: Update project details by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated project name
 *                 example: Updated Project Name
 *               description:
 *                 type: string
 *                 description: Updated project description
 *                 example: Updated description
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found or unauthorized
 */
router.put('/:projectID', projectController_1.updateProject);
/**
 * @swagger
 * /api/projects/{projectID}/soft-delete:
 *   put:
 *     summary: Soft delete a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the project to soft delete
 *     responses:
 *       200:
 *         description: Project soft deleted successfully
 *       404:
 *         description: Project not found or unauthorized
 */
router.put('/:projectID/soft-delete', projectController_1.softDeleteProject);
exports.default = router;
