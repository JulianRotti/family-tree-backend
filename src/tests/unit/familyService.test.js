// tests/services/familyService.test.js

import * as familyService from '../../../src/services/familyService';
import Relationship from '../../../src/models/relationships';

// Mock the Relationship model
jest.mock('../../../src/models/relationships');

describe('Family Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createRelationship', () => {
        it('should create a new relationship', async () => {
            const mockRelationship = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };

            // Mocking Relationship.create to resolve with the mock relationship data
            Relationship.create.mockResolvedValue(mockRelationship);

            const result = await familyService.createRelationship(mockRelationship);

            expect(Relationship.create).toHaveBeenCalledWith(mockRelationship);
            expect(result).toEqual(mockRelationship);
        });

        it('should throw an error if relationship creation fails', async () => {
            // Simulate failure during relationship creation
            Relationship.create.mockRejectedValue(new Error('Failed to create relationship'));

            await expect(familyService.createRelationship({ member_1_id: 1, member_2_id: 2, relationship: 'parent' }))
                .rejects
                .toThrow('Failed to create relationship');
        });
    });

    describe('getAllRelationships', () => {
        it('should return a list of relationships', async () => {
            const mockRelationships = [{ id: 1, member_1_id: 1, member_2_id: 2, relationship: 'parent' }];
            
            // Mocking Relationship.findAll to return a list of relationships
            Relationship.findAll.mockResolvedValue(mockRelationships);

            const result = await familyService.getAllRelationships();

            expect(Relationship.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockRelationships);
        });

        it('should throw an error if fetching relationships fails', async () => {
            Relationship.findAll.mockRejectedValue(new Error('Failed to fetch relationships'));

            await expect(familyService.getAllRelationships())
                .rejects
                .toThrow('Failed to fetch relationships');
        });
    });
});
