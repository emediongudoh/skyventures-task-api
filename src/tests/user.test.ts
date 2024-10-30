import request from 'supertest';

// Custom imports
import app from '../index';
import User from '../models/userModel';

afterAll(async () => {
    await User.deleteMany();
});

describe('User Routes', () => {
    // Integration tests for the registration route
    describe('POST /api/user/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/user/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'Password123',
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('_id');
            expect(response.body.username).toBe('testuser');
            expect(response.body.email).toBe('test@example.com');
        });

        it('should return a 400 error for existing username', async () => {
            const user = {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'Password123',
            };

            // Register the first user
            await request(app).post('/api/user/register').send(user);

            // Attempt to register the same user again
            const response = await request(app)
                .post('/api/user/register')
                .send(user);

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'This username is already in use'
            );
        });

        it('should return a 400 error for invalid email', async () => {
            const response = await request(app)
                .post('/api/user/register')
                .send({
                    username: 'testuser2',
                    email: 'invalid-email',
                    password: 'Password123',
                });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'The email address you entered is not valid'
            );
        });

        it('should return a 400 error for weak password', async () => {
            const response = await request(app)
                .post('/api/user/register')
                .send({
                    username: 'testuser3',
                    email: 'test3@example.com',
                    password: '123456',
                });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit'
            );
        });
    });

    // Integration tests for the login route
    describe('POST /api/user/login', () => {
        beforeAll(async () => {
            await request(app).post('/api/user/register').send({
                username: 'loginuser',
                email: 'login@example.com',
                password: 'Password123',
            });
        });

        it('should log in a user', async () => {
            const response = await request(app).post('/api/user/login').send({
                email: 'login@example.com',
                password: 'Password123',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('_id');
            expect(response.body.username).toBe('loginuser');
            expect(response.body.email).toBe('login@example.com');
        });

        it('should return a 400 error for incorrect password', async () => {
            const response = await request(app).post('/api/user/login').send({
                email: 'login@example.com',
                password: 'WrongPassword',
            });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'Incorrect password. Retry again'
            );
        });

        it('should return a 400 error for unregistered email', async () => {
            const response = await request(app).post('/api/user/login').send({
                email: 'unregistered@example.com',
                password: 'Password123',
            });

            expect(response.status).toBe(400);
            expect(response.body.error.message).toBe(
                'No account found for this email address. Retry again'
            );
        });
    });
});
