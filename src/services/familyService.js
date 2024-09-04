// src/services/familyService.js

import Member from '../models/members.js';
import Relationship from '../models/relationships.js';

export const createMember = async (memberData) => {
    return await Member.create(memberData);
};

export const createRelationship = async (relationshipData) => {
    const { member_1_id, member_2_id, relationship } = relationshipData;

    // Core business logic (e.g., database interaction)
    return await Relationship.create({ member_1_id, member_2_id, relationship });
};

export const getAllMembers = async () => {
    return await Member.findAll();
};

export const getAllRelationships = async () => {
    return await Relationship.findAll();
};
