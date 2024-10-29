"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const validator_1 = __importDefault(require("validator"));
// Models import
const userModel_1 = __importDefault(require("../models/userModel"));
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Check if username length is at least 2 characters long
        const isValidUsername = validator_1.default.isLength(username, { min: 2 });
        if (!isValidUsername) {
            throw http_errors_1.default.BadRequest('Your username needs to be at least 2 characters long');
        }
        // Check if username is already in use
        const usernameExist = await userModel_1.default.findOne({ username });
        if (usernameExist) {
            throw http_errors_1.default.BadRequest('This username is already in use');
        }
        // Check if email is already in use
        const emailExist = await userModel_1.default.findOne({ email });
        if (emailExist) {
            throw http_errors_1.default.BadRequest('This email address is already in use');
        }
        // Validate password manually against the schema constraints
        const isValidPassword = /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            password.length >= 8;
        if (!isValidPassword) {
            throw http_errors_1.default.BadRequest('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit');
        }
        // Create and save the user
        const user = new userModel_1.default({
            username,
            email,
            password,
        });
        // Save the user
        await user.save();
        // Return the newly registered user
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
