// src/tests/unit/controllers.test.js

import {
    getAllMembers,
    createMember,
    getAllRelationships,
    createRelationship,
} from '../../controllers/familyController.js';
import * as familyService from '../../services/familyService.js';

// Mock the familyService module
jest.mock('../../services/familyService.js');

describe('FamilyController', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Tests for getAllMembers
    test('should return all members with status 200', async () => {
        const mockMembers = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
        familyService.getAllMembers.mockResolvedValue(mockMembers);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockMembers);
    });

    test('should handle error in getAllMembers and return status 500', async () => {
        familyService.getAllMembers.mockRejectedValue(new Error('Failed to fetch members'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllMembers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch members' });
    });

    // Tests for createMember
    test('should create a new member and return status 201', async () => {
        const newMember = { id: 1, first_name: 'John', last_name: 'Doe' };
        familyService.createMember.mockResolvedValue(newMember);

        const req = { body: { first_name: 'John', last_name: 'Doe' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createMember(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newMember);
    });

    test('should handle error in createMember and return status 500', async () => {
        familyService.createMember.mockRejectedValue(new Error('Failed to create member'));

        const req = { body: { first_name: 'John', last_name: 'Doe' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createMember(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create member' });
    });

    // Tests for getAllRelationships
    test('should return all relationships with status 200', async () => {
        const mockRelationships = [
            { id: 1, member_1_id: 1, member_2_id: 2, relationship: 'parent' }
        ];
        familyService.getAllRelationships.mockResolvedValue(mockRelationships);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllRelationships(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRelationships);
    });

    test('should handle error in getAllRelationships and return status 500', async () => {
        familyService.getAllRelationships.mockRejectedValue(new Error('Failed to fetch relationships'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await getAllRelationships(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch relationships' });
    });

    // Tests for createRelationship
    test('should create a new relationship and return status 201', async () => {
        const newRelationship = { id: 1, member_1_id: 1, member_2_id: 2, relationship: 'parent' };
        familyService.createRelationship.mockResolvedValue(newRelationship);

        const req = { body: { member_1_id: 1, member_2_id: 2, relationship: 'parent' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createRelationship(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newRelationship);
    });

    test('should handle error in createRelationship and return status 400', async () => {
        const errorMessage = 'Parent cannot be younger than the child';
        familyService.createRelationship.mockRejectedValue(new Error(errorMessage));

        const req = { body: { member_1_id: 1, member_2_id: 2, relationship: 'parent' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await createRelationship(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });

});
