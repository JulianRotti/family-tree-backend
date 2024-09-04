// tests/middlewares/validateMember.test.js

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

    it('should return 400 if birth_date is missing', () => {
        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing birth date' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if death_date is before birth_date', () => {
        req.body = { birth_date: '2000-01-01', death_date: '1999-01-01' };

        validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Birth date cannot be after death date' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next if birth_date and death_date are valid', () => {
        req.body = { birth_date: '1990-01-01', death_date: '2020-01-01' };

        validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
