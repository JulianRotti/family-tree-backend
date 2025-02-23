export const convertToNull = (req, res, next) => {
    // Convert all empty strings in req.body to null
    Object.keys(req.body).forEach((key) => {
        if (req.body[key] === '') {
            req.body[key] = null;
        }
    });
    next();
};
