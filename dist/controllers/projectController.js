'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.softDeleteProject =
    exports.updateProject =
    exports.getProjectByID =
    exports.getUserProjects =
    exports.createProject =
        void 0;
const http_errors_1 = __importDefault(require('http-errors'));
const mongoose_1 = __importDefault(require('mongoose'));
// Models import
const projectModel_1 = __importDefault(require('../models/projectModel'));
// Create project
const createProject = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const owner = req.user?._id;
        // Check if the name is provided
        if (!name) {
            throw http_errors_1.default.BadRequest('Project name is required');
        }
        // Create and save the new project
        const newProject = await projectModel_1.default.create({
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
exports.createProject = createProject;
// Get user projects
const getUserProjects = async (req, res, next) => {
    try {
        const projects = await projectModel_1.default.find({
            owner: req.user?._id,
            is_deleted: false,
        });
        // Return user projects
        res.json({ projects });
    } catch (error) {
        next(error);
    }
};
exports.getUserProjects = getUserProjects;
// Get project by ID
const getProjectByID = async (req, res, next) => {
    const { projectID } = req.params;
    // Validate ObjectId format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.projectID)) {
        return next(
            http_errors_1.default.BadRequest('Invalid Project ID format')
        );
    }
    try {
        const project = await projectModel_1.default.findOne({
            _id: projectID,
            owner: req.user?._id,
            is_deleted: false,
        });
        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or you do not have permission to view it'
                )
            );
        }
        res.json({ project });
    } catch (error) {
        next(error);
    }
};
exports.getProjectByID = getProjectByID;
// Update a project by ID
const updateProject = async (req, res, next) => {
    const { projectID } = req.params;
    // Validate ObjectId format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.projectID)) {
        return next(
            http_errors_1.default.BadRequest('Invalid Project ID format')
        );
    }
    try {
        const { name, description } = req.body;
        // Find and update the project
        const project = await projectModel_1.default.findOneAndUpdate(
            { _id: projectID, owner: req.user?._id, is_deleted: false },
            { name, description },
            { new: true, runValidators: true }
        );
        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or unauthorized'
                )
            );
        }
        res.json({ project });
    } catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
// Soft delete a project by ID
const softDeleteProject = async (req, res, next) => {
    const { projectID } = req.params;
    // Validate ObjectId format
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.projectID)) {
        return next(
            http_errors_1.default.BadRequest('Invalid Project ID format')
        );
    }
    try {
        // Advanced requirement -> Soft delete project
        const project = await projectModel_1.default.findOneAndUpdate(
            { _id: projectID, owner: req.user?._id },
            { is_deleted: true },
            { new: true, runValidators: true }
        );
        // Check if the project exists and the user is the owner
        if (!project) {
            return next(
                http_errors_1.default.NotFound(
                    'Project not found or unauthorized'
                )
            );
        }
        res.json({ message: 'Project soft deleted successfully' });
    } catch (error) {
        next(error);
    }
};
exports.softDeleteProject = softDeleteProject;
