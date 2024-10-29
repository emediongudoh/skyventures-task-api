import { Request as ExpressRequest, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

interface Request extends ExpressRequest {
    user?: any;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let header = req.header('Authorization');

        // Check if token is valid
        const token = header?.slice(7, header.length);
        if (!token) {
            throw createHttpError.BadRequest('The token is not valid');
        }

        // Verify JWT
        jwt.verify(token, process.env.JWT_SECRET!, (error, user) => {
            if (error) {
                throw createHttpError.BadRequest('The token is not valid');
            }
            req.user = user;
            next();
        });
    } catch (error) {
        next(error);
    }
};
