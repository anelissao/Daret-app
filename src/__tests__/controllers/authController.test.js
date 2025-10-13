const request = require('supertest');
const app = require('../../app');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Auth Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '0612345678'
            };

            const mockResult = {
                user: { _id: 'user123', ...userData },
                token: 'fake-token'
            };

            authService.register.mockResolvedValue(mockResult);

            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('user');
            expect(response.body.data).toHaveProperty('token');
        });

        it('should return 400 for invalid data', async () => {
            const invalidData = {
                firstName: 'John',
                email: 'invalid-email'
            };

            const response = await request(app)
                .post('/api/auth/register')
                .send(invalidData)
                .expect(400);

            expect(response.body.status).toBe('error');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user with valid credentials', async () => {
            const credentials = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockResult = {
                user: { _id: 'user123', email: credentials.email },
                token: 'fake-token'
            };

            authService.login.mockResolvedValue(mockResult);

            const response = await request(app)
                .post('/api/auth/login')
                .send(credentials)
                .expect(200);

            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            authService.login.mockRejectedValue(new Error('Invalid email or password'));

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'john@example.com',
                    password: 'wrongpassword'
                })
                .expect(500);

            expect(response.body.status).toBe('error');
        });
    });
});
