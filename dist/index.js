'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const morgan_1 = __importDefault(require('morgan'));
const helmet_1 = __importDefault(require('helmet'));
const express_mongo_sanitize_1 = __importDefault(
    require('express-mongo-sanitize')
);
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const compression_1 = __importDefault(require('compression'));
const cors_1 = __importDefault(require('cors'));
const http_errors_1 = __importDefault(require('http-errors'));
const mongoose_1 = __importDefault(require('mongoose'));
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'));
const swagger_jsdoc_1 = __importDefault(require('swagger-jsdoc'));
// Configs import
const loggerConfig_1 = __importDefault(require('./configs/loggerConfig'));
// Routes import
const userRoute_1 = __importDefault(require('./routes/userRoute'));
const projectRoute_1 = __importDefault(require('./routes/projectRoute'));
const taskRoute_1 = __importDefault(require('./routes/taskRoute'));
// Create express app
const app = (0, express_1.default)();
// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'SkyVenture Tasks API',
            version: '1.0.0',
            description: 'Simple Task Management API',
        },
        tags: [
            { name: 'User', description: 'API for managing users' },
            { name: 'Projects', description: 'API for managing projects' },
            { name: 'Tasks', description: 'API for managing tasks' },
        ],
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
                Task: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Task ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Task title',
                        },
                        description: {
                            type: 'string',
                            description: 'Task description',
                        },
                        status: {
                            type: 'string',
                            description: 'Task status',
                            enum: ['pending', 'in-progress', 'completed'],
                        },
                        due_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Task due date',
                        },
                        project: {
                            type: 'string',
                            description: 'Associated project ID',
                        },
                        is_deleted: {
                            type: 'boolean',
                            description: 'Task deletion status',
                        },
                    },
                    required: ['title', 'project'],
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Customize Swagger UI with a custom title
const options = {
    swaggerOptions: {
        docExpansion: 'none',
        defaultModelsExpandDepth: -1,
        title: 'My Custom API Documentation',
    },
};
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const DATABASE_URL =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;
// Connect to MongoDB atlas
mongoose_1.default
    .connect(DATABASE_URL)
    .then(() =>
        loggerConfig_1.default.info(
            `Database connected successfully -> ${DATABASE_URL}`
        )
    );
// Terminate server on MongoDB error
mongoose_1.default.connection.on('error', err => {
    loggerConfig_1.default.error(
        `Database connection failed -> ${err.message}`
    );
    process.exit(1);
});
// HTTP request logger middleware
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
// Secure express apps with various HTTP headers
app.use((0, helmet_1.default)());
// Parse JSON request body
app.use(express_1.default.json());
// Parse JSON request url
app.use(express_1.default.urlencoded({ extended: true }));
// Sanitize user-supplied data to prevent MongoDB operator injection
app.use((0, express_mongo_sanitize_1.default)());
// Enable cookie parser
app.use((0, cookie_parser_1.default)());
// Node.js compression middleware
app.use((0, compression_1.default)());
// Setup CORS
app.use((0, cors_1.default)());
// Routing
app.use('/api/user', userRoute_1.default);
app.use('/api/projects', projectRoute_1.default);
app.use('/api/projects', taskRoute_1.default);
// Redirect all root requests to /api-docs
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});
// Serve Swagger UI
app.use(
    '/api-docs',
    swagger_ui_express_1.default.serve,
    swagger_ui_express_1.default.setup(swaggerDocs, options)
);
// Start the dev server
let server = app.listen(PORT, () => {
    loggerConfig_1.default.info(`Server listening on port ${PORT}`);
});
// Catch all incoming 404 Not Found error
app.use(async (req, res, next) => {
    next(
        http_errors_1.default.NotFound(
            'The requested resource could not be found on this server'
        )
    );
});
// Handle HTTP errors
app.use(async (err, req, res, next) => {
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
        loggerConfig_1.default.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    } else {
        process.exit(1);
    }
};
// Handle unexpected error
const unexpectedErrorHandler = err => {
    loggerConfig_1.default.error(err);
    exitHandler();
};
// Listen for server error logs
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
// Terminate server gracefully
process.on('SIGTERM', () => {
    if (server) {
        loggerConfig_1.default.info(`Terminate the server on port ${PORT}`);
        process.exit(1);
    }
});
exports.default = app;
