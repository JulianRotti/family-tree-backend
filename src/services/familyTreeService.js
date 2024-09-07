// src/services/familyTreeService.js

import sequelize from '../config/database.js';
import Member from '../models/members.js';
import Relationship from '../models/relationships.js';

// Helper function to find relationships for a given member
const findRelationships = (id, relationships, relationshipType) => {
    return relationships.filter((relationship) => {
        return relationship.relationship === relationshipType &&
               (relationship.member_1_id === id || relationship.member_2_id === id);
    });
};

// Recursive function to build the family tree (IDs only)
const buildFamilyTreeWithIds = (id, relationships) => {
    // Start with the member's ID
    const memberData = {
        id: id,
        family: {
            spouse: null,
            children: []
        }
    };

    // Find spouse and children
    findRelationships(id, relationships, 'spouse').forEach((relationship) => {
        if (relationship.member_1_id === id) {
            memberData.family.spouse = relationship.member_2_id;
        } else if (relationship.member_2_id === id) {
            memberData.family.spouse = relationship.member_1_id;
        }
    });

    findRelationships(id, relationships, 'parent').forEach((relationship) => {
        if (relationship.member_1_id === id) {
            // Add the child's ID recursively
            const childTree = buildFamilyTreeWithIds(relationship.member_2_id, relationships);
            if (childTree) {
                memberData.family.children.push(childTree);
            }
        }
    });

    // Simplify the structure: if no spouse and no children, set family to null
    if (!memberData.family.spouse && memberData.family.children.length === 0) {
        memberData.family = null;
    }

    return memberData;
};

// Fetch family tree by member ID
export const getFamilyTreeById = async (id) => {
    try {
        // Execute the stored procedure and fetch raw data
        const results = await sequelize.query('CALL get_family_tree(:id);', {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,  // Ensure all result sets are returned
        });

        // Extract the two result sets and convert them to arrays
        const relationshipsData = Object.values(results[0]);  // First result set: relationships
        const membersData = Object.values(results[1]);        // Second result set: members

        // Map raw data to Sequelize model instances
        const relationships = relationshipsData.map((relationship) =>
            Relationship.build({
                member_1_id: relationship.member_1_id,
                member_2_id: relationship.member_2_id,
                relationship: relationship.relationship,
            }).get({ plain: true })  // Return plain object, not full Sequelize model instance
        );

        const members = membersData.map((member) =>
            Member.build({
                id: member.id,
                first_name: member.first_name,
                last_name: member.last_name,
                initial_last_name: member.initial_last_name,
                birth_date: member.birth_date,
                death_date: member.death_date,
            }).get({ plain: true })  // Return plain object, not full Sequelize model instance
        );

        // Build the family tree with only IDs using structured relationships
        const familyTree = buildFamilyTreeWithIds(id, relationships);

        // Return the family tree (IDs only) and the member metadata
        return { family_tree_by_id: familyTree, members: members };
    } catch (error) {
        console.error('Error fetching family tree:', error);
        throw new Error('Could not fetch family tree');
    }
};
