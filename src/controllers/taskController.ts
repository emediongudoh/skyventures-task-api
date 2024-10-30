import { Request, Response, NextFunction } from 'express';

// Models import
import Task, { ITask } from '../models/taskModel';

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
