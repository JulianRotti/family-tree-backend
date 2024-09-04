// tests/controllers/familyController.test.js

import { getAllMembers, createMember } from '../../controllers/familyController';
import * as familyService from '../../services/familyService';

// Mock the service layer
jest.mock('../../services/familyService');

describe('Family Controller', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllMembers', () => {
        it('should return 200 and the list of members', async () => {
            const mockMembers = [{ id: 1, name: 'John' }];
            familyService.getAllMembers.mockResolvedValue(mockMembers);

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMembers);
        });

        it('should return 500 if service fails', async () => {
            familyService.getAllMembers.mockRejectedValue(new Error('Failed to fetch members'));

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await getAllMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch members' });
        });
    });

    describe('createMember', () => {
        it('should return 201 and the created member', async () => {
            const mockMember = { id: 1, name: 'Jane' };
            familyService.createMember.mockResolvedValue(mockMember);

            const req = { body: { name: 'Jane' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createMember(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockMember);
        });

        it('should return 500 if service fails', async () => {
            familyService.createMember.mockRejectedValue(new Error('Failed to create member'));

            const req = { body: { name: 'Jane' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await createMember(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create member' });
        });
    });
});
