'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.bulkUpdateTasksStatus =
    exports.softDeleteTask =
    exports.updateTask =
    exports.getTaskByID =
    exports.getTasksByProject =
    exports.createTask =
        void 0;
const http_errors_1 = __importDefault(require('http-errors'));
const mongoose_1 = __importDefault(require('mongoose'));
// Models import
const taskModel_1 = __importDefault(require('../models/taskModel'));
const projectModel_1 = __importDefault(require('../models/projectModel'));
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
    const {
        status,
        due_date,
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        order = 'asc',
    } = req.query;
    try {
        // Find the project to confirm the user owns it
        const project = await projectModel_1.default.findOne({
            _id: projectID,
            owner: req.user?._id,
            is_deleted: false,
        });
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }
        // Build query object for task filtering
        const query = { project: projectID, is_deleted: false };
        if (status) query.status = status;
        // Validate and set the due date filter
        if (due_date && !isNaN(Date.parse(due_date))) {
            const date = new Date(due_date);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            query.due_date = { $gte: date, $lt: nextDay };
        } else if (due_date) {
            return next(
                http_errors_1.default.BadRequest(
                    'Invalid date format for due_date'
                )
            );
        }
        // Convert pagination and sorting params to numbers
        const pageNumber = Math.max(Number(page), 1);
        const pageSize = Math.max(Number(limit), 1);
        const sortOrder = order === 'desc' ? -1 : 1;
        // Get filtered, paginated and sorted tasks
        const tasks = await taskModel_1.default
            .find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        // Return the paginated tasks list
        res.status(200).json({
            tasks,
            pagination: {
                currentPage: pageNumber,
                pageSize,
                totalCount: await taskModel_1.default.countDocuments(query),
                totalPages: Math.ceil(
                    (await taskModel_1.default.countDocuments(query)) / pageSize
                ),
            },
        });
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
            is_deleted: false,
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
            is_deleted: false,
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
// Update task
const updateTask = async (req, res, next) => {
    const { projectID, taskID } = req.params;
    const updates = req.body;
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
        // Check if the project exists and is not deleted
        const project = await projectModel_1.default.findOne({
            _id: projectID,
            is_deleted: false,
        });
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or you do not have the permission to view it'
                )
            );
        }
        // Find and update the task
        const task = await taskModel_1.default.findOneAndUpdate(
            { _id: taskID, project: projectID, is_deleted: false },
            updates,
            { new: true, runValidators: true }
        );
        // Check if the task exists and the user is the owner
        if (!task) {
            return next(
                http_errors_1.default.NotFound('Task not found or unauthorized')
            );
        }
        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
// Soft delete task
const softDeleteTask = async (req, res, next) => {
    const { projectID, taskID } = req.params;
    // Validate projectID format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.projectID)) {
        return next(
            http_errors_1.default.BadRequest('Invalid Project ID format')
        );
    }
    // Validate taskID format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.taskID)) {
        return next(http_errors_1.default.BadRequest('Invalid Task ID format'));
    }
    try {
        // Find and delete the task
        const task = await taskModel_1.default.findOneAndUpdate(
            {
                _id: taskID,
                project: projectID,
            },
            { is_deleted: true },
            { new: true, runValidators: true }
        );
        // Check if the task exists and the user is the owner
        if (!task) {
            return next(
                http_errors_1.default.NotFound('Task not found or unauthorized')
            );
        }
        res.json({ message: 'Task soft deleted successfully' });
    } catch (error) {
        next(error);
    }
};
exports.softDeleteTask = softDeleteTask;
// Bulk update tasks status
const bulkUpdateTasksStatus = async (req, res, next) => {
    const { projectID } = req.params;
    const { taskIDs, status } = req.body;
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
        // Validate the status value
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return next(
                http_errors_1.default.BadRequest('Invalid status value')
            );
        }
        // Update tasks in bulk
        const result = await taskModel_1.default.updateMany(
            { _id: { $in: taskIDs }, project: projectID },
            { status }
        );
        res.status(200).json({
            message: `${result.modifiedCount} tasks updated to status '${status}'`,
        });
    } catch (error) {
        next(error);
    }
};
exports.bulkUpdateTasksStatus = bulkUpdateTasksStatus;
