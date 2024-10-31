/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API for managing projects
 */

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
router.post('/', createProject);

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
router.get('/', getUserProjects);

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
router.get('/:projectID', getProjectByID);

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
router.put('/:projectID', updateProject);

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
router.put('/:projectID/soft-delete', softDeleteProject);

export default router;
