'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
// Controller imports
const userController_1 = require('../controllers/userController');
// Middlewares import
const authMiddleware_1 = require('../middlewares/authMiddleware');
// Create express router
const router = express_1.default.Router();
// Register endpoint
router.post('/register', userController_1.register);
// Login endpoint
router.post('/login', userController_1.login);
// Test auth middleware
router.get(
    '/test-auth',
    authMiddleware_1.authMiddleware,
    userController_1.testAuthFunc
);
exports.default = router;
