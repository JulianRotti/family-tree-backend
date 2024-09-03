// tests/unit/controllers.test.js

import { getAllMembers, createMember, getAllRelationships, createRelationship } from '../../src/controllers/familyController.js';
import * as familyService from '../../src/services/familyService.js';

jest.mock('../../src/services/familyService.js'); // Mock the service layer

describe('Family Controllers', () => {

    describe('getAllMembers', () => {
        it('should return all family members', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockMembers = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
            familyService.getAllMembers.mockResolvedValue(mockMembers);

            await getAllMembers(req, res);

            expect(familyService.getAllMembers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMembers);
        });

        it('should return a 500 error if fetching members fails', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            familyService.getAllMembers.mockRejectedValue(new Error('Failed to fetch members'));

            await getAllMembers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch members' });
        });
    });

    describe('createMember', () => {
        it('should create a new family member', async () => {
            const req = { body: { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockMember = { id: 1, ...req.body };
            familyService.createMember.mockResolvedValue(mockMember);

            await createMember(req, res);

            expect(familyService.createMember).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockMember);
        });

        it('should return a 500 error if creating a member fails', async () => {
            const req = { body: { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            familyService.createMember.mockRejectedValue(new Error('Failed to create member'));

            await createMember(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create member' });
        });
    });

    describe('getAllRelationships', () => {
        it('should return all family relationships', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockRelationships = [{ member_1_id: 1, member_2_id: 2, relationship: 'parent' }];
            familyService.getAllRelationships.mockResolvedValue(mockRelationships);

            await getAllRelationships(req, res);

            expect(familyService.getAllRelationships).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRelationships);
        });

        it('should return a 500 error if fetching relationships fails', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            familyService.getAllRelationships.mockRejectedValue(new Error('Failed to fetch relationships'));

            await getAllRelationships(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch relationships' });
        });
    });

    describe('createRelationship', () => {
        it('should create a new family relationship', async () => {
            const req = { body: { member_1_id: 1, member_2_id: 2, relationship: 'parent' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockRelationship = { id: 1, ...req.body };
            familyService.createRelationship.mockResolvedValue(mockRelationship);

            await createRelationship(req, res);

            expect(familyService.createRelationship).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockRelationship);
        });

        it('should return a 400 error if creating a relationship fails', async () => {
            const req = { body: { member_1_id: 1, member_2_id: 2, relationship: 'parent' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            familyService.createRelationship.mockRejectedValue(new Error('Invalid relationship data'));

            await createRelationship(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid relationship data' });
        });
    });

});
