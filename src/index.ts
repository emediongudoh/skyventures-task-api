import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

// Configs import
import logger from './configs/loggerConfig';

// Create express app
const app = express();

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// HTTP request logger middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Secure express apps with various HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse JSON request url
app.use(express.urlencoded({ extended: true }));

// Sanitize user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize());

// Enable cookie parser
app.use(cookieParser());

// Node.js compression middleware
app.use(compression());

// Setup CORS
app.use(cors());

// Test task route
app.post('/', (req: Request, res: Response) => {
    // res.send('Testing SkyVentures Task API');
    res.send(req.body);
});

// Start the dev server
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
