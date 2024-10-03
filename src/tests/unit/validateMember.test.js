import { validateMember } from '../../middleware/validateMember';
import { getMemberByAttributes } from '../../services/familyService';

// Mock the `getMemberByAttributes` function
jest.mock('../../services/familyService', () => ({
    getMemberByAttributes: jest.fn(),
}));

describe('validateMember Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        // Reset the mock before each test to ensure isolated test cases
        getMemberByAttributes.mockReset();
    });

    // Test for missing birth_date
    it('should return 400 if birth_date is missing', async () => {
        req.body = { first_name: 'John', last_name: 'Doe' };

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing birth date' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for death_date before birth_date
    it('should return 400 if death_date is before birth_date', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '2000-01-01', death_date: '1999-01-01' };

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Birth date cannot be after death date' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for valid birth_date and death_date
    it('should call next if birth_date and death_date are valid', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01', death_date: '2020-01-01' };

        // Simulate no existing member in the database
        getMemberByAttributes.mockResolvedValue(null);

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for valid first_name and last_name
    it('should call next if first_name and last_name are valid', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        // Simulate no existing member in the database
        getMemberByAttributes.mockResolvedValue(null);

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for first_name containing numbers
    it('should return 400 if first_name contains numbers', async () => {
        req.body = { first_name: 'John123', last_name: 'Doe', birth_date: '1990-01-01' };

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid first name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for last_name containing spaces
    it('should return 400 if last_name contains spaces', async () => {
        req.body = { first_name: 'John', last_name: 'Doe Smith', birth_date: '1990-01-01' };

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid last name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for hyphenated names (valid)
    it('should call next if first_name and last_name contain hyphens', async () => {
        req.body = { first_name: 'Anne-Marie', last_name: 'Smith-Jones', birth_date: '1990-01-01' };

        // Simulate no existing member in the database
        getMemberByAttributes.mockResolvedValue(null);

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for special characters in the name
    it('should return 400 if first_name contains special characters', async () => {
        req.body = { first_name: 'John@Doe', last_name: 'Doe', birth_date: '1990-01-01' };

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid first name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for valid birth_date without death_date
    it('should call next if only birth_date is provided and valid', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        // Simulate no existing member in the database
        getMemberByAttributes.mockResolvedValue(null);

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for member already existing in the database
    it('should return 400 if the member already exists', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        // Simulate that a member with the same attributes already exists
        getMemberByAttributes.mockResolvedValue({ id: 1 });

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'A member with the same first name, last name, and birth date already exists.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for server error during member lookup
    it('should return 500 if there is a server error during member lookup', async () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        // Simulate a server error (e.g., database failure)
        getMemberByAttributes.mockRejectedValue(new Error('Database error'));

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error while validating member' });
        expect(next).not.toHaveBeenCalled();
    });
});
