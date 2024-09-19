export const convertIdAndValidateQuery = (req, res, next) => {

    // Validate and convert `id` to an integer
    const parsedId = parseInt(req.params.id, 10);

    // If the parsed ID is not a valid integer, return an error
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID format, must be an integer' });
    }
    req.params.id = parsedId;  // Replace the string ID with the integer value

    // Validate query parameters: w_node, w_partner, w_children (optional but must be integers if provided)
    const w_node = req.query.w_node ? parseInt(req.query.w_node, 10) : undefined;
    const w_partner = req.query.w_partner ? parseInt(req.query.w_partner, 10) : undefined;
    const w_children = req.query.w_children ? parseInt(req.query.w_children, 10) : undefined;


    // Check if w_node, w_partner, or w_children are present and valid integers
    if (w_node !== undefined && isNaN(w_node)) {
        return res.status(400).json({ error: 'Invalid w_node format, must be an integer' });
    }
    if (w_partner !== undefined && isNaN(w_partner)) {
        return res.status(400).json({ error: 'Invalid w_partner format, must be an integer' });
    }
    if (w_children !== undefined && isNaN(w_children)) {
        return res.status(400).json({ error: 'Invalid w_children format, must be an integer' });
    }

    next();
};
