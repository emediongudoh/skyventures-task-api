'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTasksByProject = exports.createTask = void 0;
// Models import
const taskModel_1 = __importDefault(require('../models/taskModel'));
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
