// src/middleware/convertId.js
export const convertIdToInt = (req, res, next, id) => {
    const parsedId = parseInt(id, 10);

    // If the parsed ID is not a number, return an error
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format, must be an integer' });
    }

    // Replace the string ID with the integer value
    req.params.id = parsedId;
    next();
};
