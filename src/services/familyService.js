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

// New function to fetch a member by attributes (first_name, last_name, birth_date)
export const getMemberByAttributes = async (first_name, last_name, birth_date) => {
    return await Member.findOne({
        where: {
            first_name,
            last_name,
            birth_date
        }
    });
};

// Corrected: New function to fetch a relationship by connection_hash and relationship
export const getRelationshipByAttributes = async (member_1_id, member_2_id, relationship) => {
    const connectionHash = `${Math.min(member_1_id, member_2_id)}-${Math.max(member_1_id, member_2_id)}`;
    console.log('Connection Hash:', connectionHash);
    return await Relationship.findOne({
        where: {
            connection_hash: connectionHash,
            relationship
        }
    });
};
