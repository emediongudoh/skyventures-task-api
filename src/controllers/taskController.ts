import { Request as ExpressRequest, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// Models import
import Task, { ITask } from '../models/taskModel';
import Project from '../models/projectModel';

interface Request extends ExpressRequest {
    user?: { _id: string };
}

// Create task
export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, description, status, due_date } = req.body;
    const { projectID } = req.params;

    try {
        // Create and save the new task
        const newTask: ITask = await Task.create({
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

// Get tasks by project
export const getTasksByProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
        const project = await Project.findOne({
            _id: projectID,
            owner: req.user?._id,
            is_deleted: false,
        });
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }

        // Build query object for task filtering
        const query: any = { project: projectID, is_deleted: false };
        if (status) query.status = status;

        // Validate and set the due date filter
        if (due_date && !isNaN(Date.parse(due_date as string))) {
            const date = new Date(due_date as string);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);

            query.due_date = { $gte: date, $lt: nextDay };
        } else if (due_date) {
            return next(
                createHttpError.BadRequest('Invalid date format for due_date')
            );
        }

        // Convert pagination and sorting params to numbers
        const pageNumber = Math.max(Number(page), 1);
        const pageSize = Math.max(Number(limit), 1);
        const sortOrder = order === 'desc' ? -1 : 1;

        // Get filtered, paginated and sorted tasks
        const tasks = await Task.find(query)
            .sort({ [sortBy as string]: sortOrder })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        // Return the paginated tasks list
        res.status(200).json({
            tasks,
            pagination: {
                currentPage: pageNumber,
                pageSize,
                totalCount: await Task.countDocuments(query),
                totalPages: Math.ceil(
                    (await Task.countDocuments(query)) / pageSize
                ),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get task by ID
export const getTaskByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID, taskID } = req.params;

    // Validate projectID format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    // Validate taskID format
    if (!mongoose.Types.ObjectId.isValid(req.params.taskID)) {
        return next(createHttpError.BadRequest('Invalid task ID format'));
    }

    try {
        // Find the project to confirm the user owns it
        const project = await Project.findOne({
            _id: projectID,
            owner: req.user?._id,
            is_deleted: false,
        });
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }

        // Find the task within the project
        const task = await Task.findOne({
            _id: taskID,
            project: projectID,
            is_deleted: false,
        });
        if (!task) {
            return next(
                createHttpError.NotFound('Task not found within this project')
            );
        }

        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

// Update task
export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID, taskID } = req.params;
    const updates = req.body;

    // Validate projectID format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    // Validate taskID format
    if (!mongoose.Types.ObjectId.isValid(req.params.taskID)) {
        return next(createHttpError.BadRequest('Invalid task ID format'));
    }

    try {
        // Check if the project exists and is not deleted
        const project = await Project.findOne({
            _id: projectID,
            is_deleted: false,
        });
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have the permission to view it'
                )
            );
        }

        // Find and update the task
        const task = await Task.findOneAndUpdate(
            { _id: taskID, project: projectID, is_deleted: false },
            updates,
            { new: true, runValidators: true }
        );

        // Check if the task exists and the user is the owner
        if (!task) {
            return next(
                createHttpError.NotFound('Task not found or unauthorized')
            );
        }

        res.status(200).json({ task });
    } catch (error) {
        next(error);
    }
};

// Soft delete task
export const softDeleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID, taskID } = req.params;

    // Validate projectID format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    // Validate taskID format
    if (!mongoose.Types.ObjectId.isValid(req.params.taskID)) {
        return next(createHttpError.BadRequest('Invalid Task ID format'));
    }

    try {
        // Find and delete the task
        const task = await Task.findOneAndUpdate(
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
                createHttpError.NotFound('Task not found or unauthorized')
            );
        }

        res.json({ message: 'Task soft deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Bulk update tasks status
export const bulkUpdateTasksStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID } = req.params;
    const { taskIDs, status } = req.body;

    try {
        // Find the project to confirm the user owns it
        const project = await Project.findOne({
            _id: projectID,
            owner: req.user?._id,
        });
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }

        // Validate the status value
        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return next(createHttpError.BadRequest('Invalid status value'));
        }

        // Update tasks in bulk
        const result = await Task.updateMany(
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
