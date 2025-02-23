// src/middlewares/validateRelationship.js
import Member from '../models/members.js';
import { getRelationshipByAttributes } from '../services/familyService.js';

export const validateRelationship = async (req, res, next) => {
    const { member_1_id, member_2_id, relationship } = req.body;

    const member_1 = await Member.findByPk(member_1_id);
    const member_2 = await Member.findByPk(member_2_id);

    if (!member_1) {
        return res.status(400).json({ error: `Mitglied mit ID ${member_1_id} ist noch nicht angelegt.` });
    }
    
    if (!member_2) {
        return res.status(400).json({ error: `Mitglied mit ID ${member_2_id} ist noch nicht angelegt.` });
    }

    const name_member_1 = `${member_1.first_name} ${member_1.last_name}`;
    const name_member_2 = `${member_2.first_name} ${member_2.last_name}`;

    // Validation logic
    if (relationship === 'parent') {
        if (new Date(member_1.birth_date) > new Date(member_2.birth_date)) {
            return res.status(400).json({ error: `Elternteil ${name_member_1} kann nicht jünger als das Kind ${name_member_2} sein` });
        }
    }

    try {
        // Check if the member already exists in the database
        const existingRelationship = await getRelationshipByAttributes(member_1_id, member_2_id, relationship);

        // If member already exists, return an error
        if (existingRelationship) {
            return res.status(200).json({ notice: `Beziehung zwischen ${name_member_1} und ${name_member_2} ist bereits gespeichert.` });
        }

        // If validation passes and no duplicate is found, move on to the next middleware or controller
        next();
    } catch (error) {
        // Handle any database or internal server errors
        return res.status(500).json({ error: 'Serverfehler bei der Validierung der Beziehung' });
    }
};
