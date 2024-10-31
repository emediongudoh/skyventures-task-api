'use strict';
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
// Create project endpoint
router.post('/', projectController_1.createProject);
// Get user projects endpoint
router.get('/', projectController_1.getUserProjects);
// Get project by ID endpoint
router.get('/:projectID', projectController_1.getProjectByID);
// Update project by ID endpoint
router.put('/:projectID', projectController_1.updateProject);
// Soft delete project by ID endpoint
router.put('/:projectID/soft-delete', projectController_1.softDeleteProject);
exports.default = router;
