'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const supertest_1 = __importDefault(require('supertest'));
// Custom imports
const index_1 = __importDefault(require('../index'));
// Models import
const userModel_1 = __importDefault(require('../models/userModel'));
const projectModel_1 = __importDefault(require('../models/projectModel'));
let token;
let userID;
let projectID;
afterAll(async () => {
    await userModel_1.default.deleteMany();
    await projectModel_1.default.deleteMany();
});
beforeAll(async () => {
    // Create a test user and log in to get a token
    const userResponse = await (0, supertest_1.default)(index_1.default)
        .post('/api/user/register')
        .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123',
        });
    userID = userResponse.body._id;
    const loginResponse = await (0, supertest_1.default)(index_1.default)
        .post('/api/user/login')
        .send({
            email: 'test@example.com',
            password: 'Password123',
        });
    token = loginResponse.body.token;
});
describe('Project Routes', () => {
    // Integration tests for the create project route
    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Test Project',
                    description: 'A description for the test project.',
                });
            projectID = response.body.project._id;
            expect(response.status).toBe(201);
            expect(response.body.project).toHaveProperty('_id');
            expect(response.body.project.name).toBe('Test Project');
            expect(response.body.project.description).toBe(
                'A description for the test project.'
            );
            expect(response.body.project.owner).toBe(userID);
        });
        it('should return a 400 error for missing project name', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'A description without a name.',
                });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Project name is required'
            );
        });
    });
    // Integration tests for the get user projects route
    describe('GET /api/projects', () => {
        it('should retrieve user projects', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/projects')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.projects).toBeInstanceOf(Array);
            expect(response.body.projects.length).toBeGreaterThan(0);
        });
    });
    // Integration tests for the get project by ID route
    describe('GET /api/projects/:projectID', () => {
        it('should retrieve a project by ID', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get(`/api/projects/${projectID}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.project).toHaveProperty('_id', projectID);
            expect(response.body.project.name).toBe('Test Project');
        });
        it('should return a 404 error for a non-existent project', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .get('/api/projects/invalidprojectID')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Invalid Project ID format'
            );
        });
    });
    // Integration tests for the update project route
    describe('PUT /api/projects/:projectID', () => {
        it('should update a project', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .put(`/api/projects/${projectID}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Updated Project',
                    description: 'An updated description for the test project.',
                });
            expect(response.status).toBe(200);
            expect(response.body.project.name).toBe('Updated Project');
            expect(response.body.project.description).toBe(
                'An updated description for the test project.'
            );
        });
        it('should return a 404 error for a non-existent project during update', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .put('/api/projects/invalidprojectID')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Trying to update a non-existent project',
                });
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Invalid Project ID format'
            );
        });
    });
    // Integration tests for the soft delete project route
    describe('PUT /api/projects/:projectID/soft-delete', () => {
        it('should soft delete a project', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .put(`/api/projects/${projectID}/soft-delete`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                'Project soft deleted successfully'
            );
        });
        it('should return a 404 error for a non-existent project during soft delete', async () => {
            const response = await (0, supertest_1.default)(index_1.default)
                .put('/api/projects/invalidprojectID/soft-delete')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Invalid Project ID format'
            );
        });
    });
});
