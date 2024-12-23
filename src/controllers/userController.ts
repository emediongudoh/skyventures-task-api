import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Models import
import User, { IUser } from '../models/userModel';

// Utils import
import { generateToken } from '../utils/generateToken';

// Register
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

        // Validate email format
        if (!validator.isEmail(email)) {
            throw createHttpError.BadRequest(
                'The email address you entered is not valid'
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
        const user: IUser = await User.create({
            username,
            email,
            password,
        });

        // Generate JWT
        const token = generateToken({ _id: user._id.toString() }, '7d');

        // Return the newly registered user
        res.status(201).json({
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        next(error);
    }
};

// Login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        // Check if email is valid
        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError.BadRequest(
                'No account found for this email address. Retry again'
            );
        }

        // Check if password is correct
        const correctPass = await bcrypt.compare(password, user.password);
        if (!correctPass) {
            throw createHttpError.BadRequest('Incorrect password. Retry again');
        }

        // Generate JWT
        const token = generateToken({ _id: user._id.toString() }, '7d');

        // Return the logged-in user
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        next(error);
    }
};
