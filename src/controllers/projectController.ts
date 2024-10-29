import { Request as ExpressRequest, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// Models import
import Project, { IProject } from '../models/projectModel';

interface Request extends ExpressRequest {
    user?: { _id: string };
}

// Create project
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

// Get user projects
export const getUserProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projects = await Project.find({ owner: req.user?._id });

        // Return user projects
        res.json({ projects });
    } catch (error) {
        next(error);
    }
};

// Get project by ID
export const getProjectByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    try {
        const project = await Project.findOne({
            _id: projectID,
            owner: req.user?._id,
        });

        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                createHttpError.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }

        res.json({ project });
    } catch (error) {
        next(error);
    }
};

// Update a project by ID
export const updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    try {
        const { name, description } = req.body;

        // Find and update the project
        const project = await Project.findOneAndUpdate(
            { _id: projectID, owner: req.user?._id },
            { name, description },
            { new: true, runValidators: true }
        );

        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                createHttpError.NotFound('Project not found or unauthorized')
            );
        }

        res.json({ project });
    } catch (error) {
        next(error);
    }
};

// Delete a project by ID
export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { projectID } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.projectID)) {
        return next(createHttpError.BadRequest('Invalid Project ID format'));
    }

    try {
        // Find and delete the project
        const project = await Project.findOneAndDelete({
            _id: projectID,
            owner: req.user?._id,
        });

        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                createHttpError.NotFound('Project not found or unauthorized')
            );
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};
