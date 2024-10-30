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

    try {
        const tasks = await Task.find({ project: projectID });

        // Return tasks by project
        res.status(200).json({ tasks });
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
        });
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }

        // Find the task within the project
        const task = await Task.findOne({ _id: taskID, project: projectID });
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
        // Find and update the task
        const task = await Task.findOneAndUpdate(
            { _id: taskID, project: projectID },
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

// Delete task
export const deleteTask = async (
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
        const task = await Task.findOneAndDelete({
            _id: taskID,
            project: projectID,
        });

        // Check if the task exists and the user is the owner
        if (!task) {
            return next(
                createHttpError.NotFound('Task not found or unauthorized')
            );
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};
