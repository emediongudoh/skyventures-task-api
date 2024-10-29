'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getUserProjects = exports.createProject = void 0;
// Models import
const projectModel_1 = __importDefault(require('../models/projectModel'));
// Create project
const createProject = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const owner = req.user?._id;
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
        });
        // Return user projects
        res.json({ projects });
    } catch (error) {
        next(error);
    }
};
exports.getUserProjects = getUserProjects;
