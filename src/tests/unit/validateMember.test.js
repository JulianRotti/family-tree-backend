import { validateMember } from '../../middleware/validateMember';
import { getMemberByAttributes } from '../../services/familyService';

// Mock the `getMemberByAttributes` function
jest.mock('../../services/familyService', () => ({
    getMemberByAttributes: jest.fn(),
}));

describe('validateMember Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { 
            body: {
                first_name: 'John',
                last_name: 'Doe',
                birth_date: '1990-01-01',
                birth_city: 'Berlin',
                birth_country: 'Deutschland'
            } 
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();

        // Reset the mock before each test to ensure isolated test cases
        getMemberByAttributes.mockReset();
    });

    // 🟢 Required field checks
    it('should return 400 if first_name is missing', async () => {
        delete req.body.first_name;

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Vorname ist nicht angegeben.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if last_name is missing', async () => {
        delete req.body.last_name;

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Nachname ist nicht angegeben.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if birth_date is missing', async () => {
        delete req.body.birth_date;

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Geburtsdatum ist nicht angegeben.' });
        expect(next).not.toHaveBeenCalled();
    });

    // 🟢 Name validation
    it('should return 400 if first_name contains numbers', async () => {
        req.body.first_name = 'John123';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Vorname enthält unerlaubte Zeichen.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if last_name contains special characters', async () => {
        req.body.last_name = 'Doe@';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Nachname enthält unerlaubte Zeichen.' });
        expect(next).not.toHaveBeenCalled();
    });

    // 🟢 Date validation
    it('should return 400 if birth_date is invalid', async () => {
        req.body.birth_date = 'invalid-date';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Geburtsdatum ist nicht valide.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if death_date is before birth_date', async () => {
        req.body.death_date = '1989-12-31';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Geburtsdatum darf nicht nach dem Sterbedatum liegen.' });
        expect(next).not.toHaveBeenCalled();
    });

    // 🟢 Email validation
    it('should return 400 if email is invalid', async () => {
        req.body.email = 'invalid-email';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Ungültige E-Mail-Adresse.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should allow valid email format', async () => {
        req.body.email = 'test@example.com';

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    // 🟢 Telephone validation
    it('should return 400 if telephone is invalid', async () => {
        req.body.telephone = 'abc-123';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Ungültige Telefonnummer.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should allow valid telephone number', async () => {
        req.body.telephone = '+49 123 456789';

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    // 🟢 Street number validation
    it('should return 400 if street_number is invalid', async () => {
        req.body.street_number = 'InvalidStreet12';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Straßenname und Hausnummer sind ungültig. (z. B. Müllerstraße 12 oder Hauptstr. 5)' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should allow valid street_number', async () => {
        req.body.street_number = 'Müllerstraße 12';

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    // 🟢 City validation
    it('should return 400 if city contains numbers', async () => {
        req.body.city = 'Berlin123';

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Stadtname enthält unerlaubte Zeichen.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should allow valid city names with umlauts', async () => {
        req.body.city = 'München';

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    // 🟢 Duplicate member check
    it('should return 400 if member already exists', async () => {
        getMemberByAttributes.mockResolvedValue({ id: 1 });

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Ein Mitglied mit demselben Namen und Geburtsdatum existiert bereits.',
        });
        expect(next).not.toHaveBeenCalled();
    });

    // 🟢 Server error handling
    it('should return 500 if there is a server error during member lookup', async () => {
        getMemberByAttributes.mockRejectedValue(new Error('Database error'));

        await validateMember(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Serverfehler bei der Mitgliedsvalidierung.' });
        expect(next).not.toHaveBeenCalled();
    });

    // 🟢 Valid input should proceed
    it('should call next if all inputs are valid', async () => {
        getMemberByAttributes.mockResolvedValue(null);

        await validateMember(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });
});
