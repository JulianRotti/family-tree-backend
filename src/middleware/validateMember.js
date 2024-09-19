// src/middlewares/validateMember.js

export const validateMember = (req, res, next) => {


    const { first_name, last_name, birth_date, death_date } = req.body;

    // Regex to match names with alphabetic characters and hyphens, but no numbers or spaces
    const nameRegex = /^[A-Za-z-]+$/;

    // Ensure first_name is provided and matches the regex
    if (!first_name || !nameRegex.test(first_name)) {
        return res.status(400).json({ error: 'Invalid first name. Only letters and hyphens are allowed.' });
    }

    // Ensure last_name is provided and matches the regex
    if (!last_name || !nameRegex.test(last_name)) {
        return res.status(400).json({ error: 'Invalid last name. Only letters and hyphens are allowed.' });
    }

    // Ensure birth_date is provided and is a valid date
    if (!birth_date || isNaN(Date.parse(birth_date))) {
        return res.status(400).json({ error: 'Invalid or missing birth date' });
    }

    // Check if death_date is provided and validate it, if present
    if (death_date && isNaN(Date.parse(death_date))) {
        return res.status(400).json({ error: 'Invalid death date' });
    }

    // Ensure birth_date is not after death_date
    if (death_date && new Date(birth_date) > new Date(death_date)) {
        return res.status(400).json({ error: 'Birth date cannot be after death date' });
    }

    // If validation passes, move on to the next middleware or controller
    next();
};
