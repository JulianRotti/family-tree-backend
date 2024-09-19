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
            // Update the test to include valid first_name and last_name
            const response = await request(app)
                .post('/members')
                .send({ first_name: 'John', last_name: 'Doe', birth_date: '' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Invalid or missing birth date');
        });

        it('should create a member and return 201', async () => {
            const mockMember = { id: 1, first_name: 'John', last_name: 'Doe' };
            familyService.createMember.mockResolvedValue(mockMember);

            // Include valid first_name, last_name, and birth_date in the request
            const response = await request(app)
                .post('/members')
                .send({ first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockMember);
        });
    });

    describe('GET /members', () => {
        it('should return 200 and the list of members', async () => {
            const mockMembers = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
            familyService.getAllMembers.mockResolvedValue(mockMembers);

            const response = await request(app).get('/members');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockMembers);
        });
    });
});
