import { Request as ExpressRequest, Response, NextFunction } from 'express';

// Models import
import Project, { IProject } from '../models/projectModel';

interface Request extends ExpressRequest {
    user?: { _id: string };
}

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body;

        const owner = req.user?._id;

        // Create and save the new project
        const newProject: IProject = await Project.create({
            name,
            description,
            owner,
        });

        // Return the newly created project
        res.status(201).json({ project: newProject });
    } catch (error) {
        next(error);
    }
};
