'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTaskByID = exports.getTasksByProject = exports.createTask = void 0;
const http_errors_1 = __importDefault(require('http-errors'));
// Models import
const taskModel_1 = __importDefault(require('../models/taskModel'));
const projectModel_1 = __importDefault(require('../models/projectModel'));
const mongoose_1 = __importDefault(require('mongoose'));
// Create task
const createTask = async (req, res, next) => {
    const { title, description, status, due_date } = req.body;
    const { projectID } = req.params;
    try {
        // Create and save the new task
        const newTask = await taskModel_1.default.create({
            title,
            description,
            status,
            due_date,
            project: projectID,
        });
        // Return the newly created task
        res.status(201).json({ task: newTask });
    } catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
// Get tasks by project
const getTasksByProject = async (req, res, next) => {
    const { projectID } = req.params;
    try {
        const tasks = await taskModel_1.default.find({ project: projectID });
        // Return tasks by project
        res.status(200).json({ tasks });
    } catch (error) {
        next(error);
    }
};
exports.getTasksByProject = getTasksByProject;
// Get task by ID
const getTaskByID = async (req, res, next) => {
    const { projectID, taskID } = req.params;
    // Validate projectID format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.projectID)) {
        return next(
            http_errors_1.default.BadRequest('Invalid Project ID format')
        );
    }
    // Validate taskID format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.taskID)) {
        return next(http_errors_1.default.BadRequest('Invalid task ID format'));
    }
    try {
        // Find the project to confirm the user owns it
        const project = await projectModel_1.default.findOne({
            _id: projectID,
            owner: req.user?._id,
        });
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }
        // Find the task within the project
        const task = await taskModel_1.default.findOne({
            _id: taskID,
            project: projectID,
        });
        if (!task) {
            return next(
                http_errors_1.default.NotFound(
                    'Task not found within this project'
                )
            );
        }
        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};
exports.getTaskByID = getTaskByID;