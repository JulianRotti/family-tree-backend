// src/middlewares/validateRelationship.js
import Member from '../models/members.js';
import { getRelationshipByAttributes } from '../services/familyService.js';

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

    try {
        // Check if the member already exists in the database
        const existingRelationship = await getRelationshipByAttributes(member_1_id, member_2_id, relationship);

        // If member already exists, return an error
        if (existingRelationship) {
            return res.status(400).json({ error: 'The relationship already exists' });
        }

        // If validation passes and no duplicate is found, move on to the next middleware or controller
        next();
    } catch (error) {
        // Handle any database or internal server errors
        return res.status(500).json({ error: 'Server error while validating relationship' });
    }
};
