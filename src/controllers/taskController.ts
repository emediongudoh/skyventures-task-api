import { Request as ExpressRequest, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

// Models import
import Task, { ITask } from '../models/taskModel';
import Project from '../models/projectModel';
import mongoose from 'mongoose';

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
