// src/tests/unit/familyService.test.js

import Member from '../../models/members.js';
import Relationship from '../../models/relationships.js';
import * as familyService from '../../services/familyService.js';

jest.mock('../../models/members.js'); // Mocking the Member model
jest.mock('../../models/relationships.js'); // Mocking the Relationship model

describe('FamilyService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for getAllMembers
    test('should fetch all members', async () => {
        const mockMembers = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
        Member.findAll.mockResolvedValue(mockMembers);

        const result = await familyService.getAllMembers();

        expect(Member.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockMembers);
    });

    // Test for createMember
    test('should create a new member', async () => {
        const newMember = { first_name: 'John', last_name: 'Doe' };
        const createdMember = { id: 1, ...newMember };
        Member.create.mockResolvedValue(createdMember);

        const result = await familyService.createMember(newMember);

        expect(Member.create).toHaveBeenCalledWith(newMember);
        expect(result).toEqual(createdMember);
    });

    // Test for getAllRelationships
    test('should fetch all relationships', async () => {
        const mockRelationships = [
            { id: 1, member_1_id: 1, member_2_id: 2, relationship: 'parent' }
        ];
        Relationship.findAll.mockResolvedValue(mockRelationships);

        const result = await familyService.getAllRelationships();

        expect(Relationship.findAll).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockRelationships);
    });

    // Test for createRelationship with validation
    test('should create a valid parent-child relationship', async () => {
        const parent = { id: 1, birth_date: '1970-01-01' };
        const child = { id: 2, birth_date: '2000-01-01' };
        Member.findByPk.mockResolvedValueOnce(parent).mockResolvedValueOnce(child);

        const newRelationship = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };
        Relationship.create.mockResolvedValue(newRelationship);

        const result = await familyService.createRelationship(newRelationship);

        expect(Member.findByPk).toHaveBeenCalledTimes(2);
        expect(Relationship.create).toHaveBeenCalledWith(newRelationship);
        expect(result).toEqual(newRelationship);
    });

    test('should throw error if parent is younger than the child', async () => {
        const parent = { id: 1, birth_date: '2000-01-01' };
        const child = { id: 2, birth_date: '1970-01-01' };
        Member.findByPk.mockResolvedValueOnce(parent).mockResolvedValueOnce(child);

        const newRelationship = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };

        await expect(familyService.createRelationship(newRelationship)).rejects.toThrow(
            'Parent cannot be younger than the child'
        );

        expect(Member.findByPk).toHaveBeenCalledTimes(2);
        expect(Relationship.create).not.toHaveBeenCalled();
    });
});
