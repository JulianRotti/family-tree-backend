// src/services/familyService.js

import Member from '../models/members.js';
import Relationship from '../models/relationships.js';

export const createMember = async (memberData) => {
    return await Member.create(memberData);
};

export const createRelationship = async (relationshipData) => {
    const { member_1_id, member_2_id, relationship } = relationshipData;

    // Validate the relationship logic
    if (relationship === 'parent') {
        const parent = await Member.findByPk(member_1_id);
        const child = await Member.findByPk(member_2_id);

        if (new Date(parent.birth_date) > new Date(child.birth_date)) {
            throw new Error('Parent cannot be younger than the child');
        }
    }

    // Only pass member_1_id, member_2_id, and relationship
    return await Relationship.create({ member_1_id, member_2_id, relationship });
};

export const getAllMembers = async () => {
    return await Member.findAll();
};

export const getAllRelationships = async () => {
    return await Relationship.findAll();
};
