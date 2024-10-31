import request from 'supertest';

// Custom imports
import app from '../index';

// Models import
import User from '../models/userModel';
import Project from '../models/projectModel';
import Task from '../models/taskModel';

let token: string;
let userID: string;
let projectID: string;
let taskID: string;

afterAll(async () => {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
});

beforeAll(async () => {
    // Create a test user and log in to get a token
    const userResponse = await request(app).post('/api/user/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
    });
    userID = userResponse.body._id;

    const loginResponse = await request(app).post('/api/user/login').send({
        email: 'test@example.com',
        password: 'Password123',
    });

    token = loginResponse.body.token;

    // Create a test project for task tests
    const projectResponse = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'Test Project',
            description: 'A description for the test project.',
        });
    projectID = projectResponse.body.project._id;
});

describe('Task Routes', () => {
    // Integration tests for the create task route
    describe('POST /api/projects/:projectID/tasks', () => {
        it('should create a new task', async () => {
            const response = await request(app)
                .post(`/api/projects/${projectID}/tasks`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Task',
                    description: 'A description for the test task.',
                    status: 'pending',
                    due_date: new Date().toISOString(),
                });

            taskID = response.body.task._id;

            expect(response.status).toBe(201);
            expect(response.body.task).toHaveProperty('_id');
            expect(response.body.task.title).toBe('Test Task');
            expect(response.body.task.description).toBe(
                'A description for the test task.'
            );
            expect(response.body.task.project).toBe(projectID);
        });

        it('should return a 400 error for missing task title', async () => {
            const response = await request(app)
                .post(`/api/projects/${projectID}/tasks`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    description: 'A description without a title.',
                    status: 'pending',
                    due_date: new Date().toISOString(),
                });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Task title is required');
        });
    });

    // Integration tests for the get tasks by project route
    describe('GET /api/projects/:projectID/tasks', () => {
        it('should retrieve tasks for a project', async () => {
            const response = await request(app)
                .get(`/api/projects/${projectID}/tasks`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.tasks).toBeInstanceOf(Array);
            expect(response.body.tasks.length).toBeGreaterThan(0);
        });
    });

    // Integration tests for the get task by ID route
    describe('GET /api/projects/:projectID/tasks/:taskID', () => {
        it('should retrieve a task by ID', async () => {
            const response = await request(app)
                .get(`/api/projects/${projectID}/tasks/${taskID}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.task).toHaveProperty('_id', taskID);
            expect(response.body.task.title).toBe('Test Task');
        });

        it('should return a 404 error for a non-existent task', async () => {
            const response = await request(app)
                .get(`/api/projects/${projectID}/tasks/invalidtaskID`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Invalid task ID format');
        });
    });

    // Integration tests for the update task route
    describe('PUT /api/projects/:projectID/tasks/:taskID', () => {
        it('should update a task', async () => {
            const response = await request(app)
                .put(`/api/projects/${projectID}/tasks/${taskID}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Updated Test Task',
                    description: 'An updated description for the test task.',
                    status: 'completed',
                });

            expect(response.status).toBe(200);
            expect(response.body.task.title).toBe('Updated Test Task');
            expect(response.body.task.description).toBe(
                'An updated description for the test task.'
            );
        });

        it('should return a 404 error for a non-existent task during update', async () => {
            const response = await request(app)
                .put(`/api/projects/${projectID}/tasks/invalidtaskID`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Trying to update a non-existent task',
                });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Invalid task ID format');
        });
    });

    // Integration tests for the soft delete task route
    describe('PUT /api/projects/:projectID/tasks/:taskID/soft-delete', () => {
        it('should soft delete a task', async () => {
            const response = await request(app)
                .put(`/api/projects/${projectID}/tasks/${taskID}/soft-delete`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe(
                'Task soft deleted successfully'
            );
        });

        it('should return a 404 error for a non-existent task during soft delete', async () => {
            const response = await request(app)
                .put(
                    `/api/projects/${projectID}/tasks/invalidtaskID/soft-delete`
                )
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe('Invalid Task ID format');
        });
    });
});
