'use strict';
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
// Create task endpoint
router.post('/:projectID/tasks', taskController_1.createTask);
// Get tasks by project endpoint
router.get('/:projectID/tasks', taskController_1.getTasksByProject);
// Get task by ID endpoint
router.get('/:projectID/tasks/:taskID', taskController_1.getTaskByID);
// Update task by ID endpoint
router.put('/:projectID/tasks/:taskID', taskController_1.updateTask);
exports.default = router;
