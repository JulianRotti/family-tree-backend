import { validateMember } from '../../middleware/validateMember';

describe('validateMember Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    // Test for missing birth_date
    it('should return 400 if birth_date is missing', () => {

        req.body = { first_name: 'John', last_name: 'Doe'};

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing birth date' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for death_date before birth_date
    it('should return 400 if death_date is before birth_date', () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '2000-01-01', death_date: '1999-01-01' };

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Birth date cannot be after death date' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for valid birth_date and death_date
    it('should call next if birth_date and death_date are valid', () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01', death_date: '2020-01-01' };

        validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for valid first_name and last_name
    it('should call next if first_name and last_name are valid', () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for first_name containing numbers
    it('should return 400 if first_name contains numbers', () => {
        req.body = { first_name: 'John123', last_name: 'Doe', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid first name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for last_name containing spaces
    it('should return 400 if last_name contains spaces', () => {
        req.body = { first_name: 'John', last_name: 'Doe Smith', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid last name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for hyphenated names (valid)
    it('should call next if first_name and last_name contain hyphens', () => {
        req.body = { first_name: 'Anne-Marie', last_name: 'Smith-Jones', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    // Test for special characters in the name
    it('should return 400 if first_name contains special characters', () => {
        req.body = { first_name: 'John@Doe', last_name: 'Doe', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid first name. Only letters and hyphens are allowed.' });
        expect(next).not.toHaveBeenCalled();
    });

    // Test for valid birth_date without death_date
    it('should call next if only birth_date is provided and valid', () => {
        req.body = { first_name: 'John', last_name: 'Doe', birth_date: '1990-01-01' };

        validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
