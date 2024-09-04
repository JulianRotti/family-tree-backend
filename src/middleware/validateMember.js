// src/middlewares/validateMember.js

export const validateMember = (req, res, next) => {
    const { birth_date, death_date } = req.body;

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
