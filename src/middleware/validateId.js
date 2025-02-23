export const validateId = (req, res, next) => {
    // Check if ID is in params or body
    const id = req.params.id || req.body.id;

    // Convert ID to an integer
    const parsedId = parseInt(id, 10);

    // If ID is missing or not a valid number, return error
    if (!id || isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid or missing ID, must be an integer' });
    }

    // Store validated integer ID back in the request
    if (req.params.id) {
        req.params.id = parsedId;
    } else {
        req.body.id = parsedId;
    }

    next();
};
