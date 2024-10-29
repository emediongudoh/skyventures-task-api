'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.authMiddleware = void 0;
const http_errors_1 = __importDefault(require('http-errors'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const authMiddleware = async (req, res, next) => {
    try {
        let header = req.header('Authorization');
        // Check if token is valid
        const token = header?.slice(7, header.length);
        if (!token) {
            throw http_errors_1.default.BadRequest('The token is not valid');
        }
        // Verify JWT
        jsonwebtoken_1.default.verify(
            token,
            process.env.JWT_SECRET,
            (error, user) => {
                if (error) {
                    throw http_errors_1.default.BadRequest(
                        'The token is not valid'
                    );
                }
                req.user = user;
                next();
            }
        );
    } catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
