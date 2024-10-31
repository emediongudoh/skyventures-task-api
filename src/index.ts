import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

// Configs import
import logger from './configs/loggerConfig';

// Routes import
import userRoutes from './routes/userRoute';
import projectRoutes from './routes/projectRoute';
import taskRoutes from './routes/taskRoute';

// Create express app
const app = express();

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SkyVenture Tasks API',
            version: '1.0.0',
            description: 'Simple Task Management API',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Project: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Project ID',
                        },
                        name: {
                            type: 'string',
                            description: 'Project name',
                        },
                        description: {
                            type: 'string',
                            description: 'Project description',
                        },
                        owner: {
                            type: 'string',
                            description: 'ID of the project owner',
                        },
                        is_deleted: {
                            type: 'boolean',
                            description: 'Project deletion status',
                        },
                    },
                    required: ['name', 'description', 'owner'],
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

// Create Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Customize Swagger UI with a custom title
const options = {
    swaggerOptions: {
        docExpansion: 'none',
        defaultModelsExpandDepth: -1,
        title: 'My Custom API Documentation',
    },
};

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_DATABASE_URL!
        : process.env.DATABASE_URL!;

// Connect to MongoDB atlas
mongoose
    .connect(DATABASE_URL)
    .then(() =>
        logger.info(`Database connected successfully -> ${DATABASE_URL}`)
    );

// Terminate server on MongoDB error
mongoose.connection.on('error', err => {
    logger.error(`Database connection failed -> ${err.message}`);
    process.exit(1);
});

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

// Routing
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);

// Redirect all root requests to /api-docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

// Start the dev server
let server = app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});

// Catch all incoming 404 Not Found error
app.use(async (req, res, next) => {
    next(
        createHttpError.NotFound(
            'The requested resource could not be found on this server'
        )
    );
});

// Handle HTTP errors
app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

// Terminate server on error
const exitHandler = () => {
    if (server) {
        logger.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    } else {
        process.exit(1);
    }
};

// Handle unexpected error
const unexpectedErrorHandler = (err: unknown) => {
    logger.error(err);
    exitHandler();
};

// Listen for server error logs
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Terminate server gracefully
process.on('SIGTERM', () => {
    if (server) {
        logger.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    }
});

export default app;
