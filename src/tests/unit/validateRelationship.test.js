// tests/middlewares/validateRelationship.test.js

import { validateRelationship } from '../../middleware/validateRelationship';
import Member from '../../models/members';

// Mock the Member model
jest.mock('../../models/members');

describe('validateRelationship Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if member_1 or member_2 is not found', async () => {
        req.body = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };

        // Simulate that members are not found in the database
        Member.findByPk.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

        await validateRelationship(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid member IDs provided' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if the parent is younger than the child', async () => {
        req.body = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };

        // Mocking Member data with birth dates
        const mockParent = { id: 1, birth_date: '2010-01-01' };
        const mockChild = { id: 2, birth_date: '2000-01-01' };

        Member.findByPk.mockResolvedValueOnce(mockParent).mockResolvedValueOnce(mockChild);

        await validateRelationship(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Parent cannot be younger than the child' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if validation passes', async () => {
        req.body = { member_1_id: 1, member_2_id: 2, relationship: 'parent' };

        // Mocking Member data with valid birth dates
        const mockParent = { id: 1, birth_date: '1980-01-01' };
        const mockChild = { id: 2, birth_date: '2000-01-01' };

        Member.findByPk.mockResolvedValueOnce(mockParent).mockResolvedValueOnce(mockChild);

        await validateRelationship(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled(); // No error should have been sent
    });

    it('should skip validation if relationship is not parent', async () => {
        req.body = { member_1_id: 1, member_2_id: 2, relationship: 'sibling' };

        await validateRelationship(req, res, next);

        expect(next).toHaveBeenCalled(); // Validation should be bypassed
        expect(Member.findByPk).not.toHaveBeenCalled(); // No database queries should have been made
        expect(res.status).not.toHaveBeenCalled(); // No error should have been sent
    });
});
