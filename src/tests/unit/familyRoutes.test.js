// tests/routes/familyRoutes.test.js

import request from 'supertest';
import express from 'express';
import familyRoutes from '../../routes/familyRoutes';
import * as familyService from '../../services/familyService';

// Set up the express app for testing
const app = express();
app.use(express.json());
app.use(familyRoutes);

// Mock the service layer
jest.mock('../../services/familyService');

describe('Family Routes', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /members', () => {
        it('should validate member and return 400 if birth_date is invalid', async () => {
            const response = await request(app)
                .post('/members')
                .send({ birth_date: '', name: 'John Doe' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid or missing birth date');
        });

        it('should create a member and return 201', async () => {
            const mockMember = { id: 1, name: 'John Doe' };
            familyService.createMember.mockResolvedValue(mockMember);

            const response = await request(app)
                .post('/members')
                .send({ birth_date: '1990-01-01', name: 'John Doe' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockMember);
        });
    });

    describe('GET /members', () => {
        it('should return 200 and the list of members', async () => {
            const mockMembers = [{ id: 1, name: 'John Doe' }];
            familyService.getAllMembers.mockResolvedValue(mockMembers);

            const response = await request(app).get('/members');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMembers);
        });
    });
});
