// src/middlewares/validateRelationship.js
import Member from '../models/members.js';

export const validateRelationship = async (req, res, next) => {
    const { member_1_id, member_2_id, relationship } = req.body;

    // Validation logic
    if (relationship === 'parent') {
        const parent = await Member.findByPk(member_1_id);
        const child = await Member.findByPk(member_2_id);

        if (!parent || !child) {
            return res.status(400).json({ error: 'Invalid member IDs provided' });
        }

        if (new Date(parent.birth_date) > new Date(child.birth_date)) {
            return res.status(400).json({ error: 'Parent cannot be younger than the child' });
        }
    }

    next(); // Pass control to the next middleware or route handler
};
