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
// Create project endpoint
router.post(
    '/',
    authMiddleware_1.authMiddleware,
    projectController_1.createProject
);
// Get user projects endpoint
router.get(
    '/',
    authMiddleware_1.authMiddleware,
    projectController_1.getUserProjects
);
// Get project by ID endpoint
router.get(
    '/:projectID',
    authMiddleware_1.authMiddleware,
    projectController_1.getProjectByID
);
// Update project by ID endpoint
router.put(
    '/:projectID',
    authMiddleware_1.authMiddleware,
    projectController_1.updateProject
);
exports.default = router;
