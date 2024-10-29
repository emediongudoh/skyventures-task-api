import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import validator from 'validator';

// Models import
import User from '../models/userModel';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body;

        // Check if username length is at least 2 characters long
        const isValidUsername = validator.isLength(username, { min: 2 });
        if (!isValidUsername) {
            throw createHttpError.BadRequest(
                'Your username needs to be at least 2 characters long'
            );
        }

        // Check if username is already in use
        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            throw createHttpError.BadRequest('This username is already in use');
        }

        // Check if email is already in use
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            throw createHttpError.BadRequest(
                'This email address is already in use'
            );
        }

        // Validate password manually against the schema constraints
        const isValidPassword =
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password) &&
            password.length >= 8;

        if (!isValidPassword) {
            throw createHttpError.BadRequest(
                'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit'
            );
        }

        // Create and save the user
        const user = new User({
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
    } catch (error) {
        next(error);
    }
};