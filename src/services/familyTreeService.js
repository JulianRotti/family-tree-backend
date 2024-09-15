// src/services/familyTreeService.js

import sequelize from '../config/database.js';
import Member from '../models/members.js';
import Relationship from '../models/relationships.js';

// Helper function to find relationships for a given member
const findSpouse = (id, relationships) => {
    return relationships.filter((relationship) => {
        return relationship.relationship === "spouse" &&
               (relationship.member_1_id === id || relationship.member_2_id === id);
    });
};

// Helper function to find all children for a given parent
const findChildrenForParent = (parentId, relationships) => {
    return relationships
        .filter((relationship) => {
            return relationship.relationship === 'parent' && relationship.member_1_id === parentId;
        })
        .map((relationship) => relationship.member_2_id);  // Return only child IDs
};

// Updated findChildren function to return only children shared by both id_1 and id_2
const findChildren = (id_1, id_2, relationships) => {
    // Get children of both parents
    const childrenOfId1 = findChildrenForParent(id_1, relationships);
    const childrenOfId2 = findChildrenForParent(id_2, relationships);

    // Return the intersection of both sets of children (shared children)
    return childrenOfId1.filter((childId) => childrenOfId2.includes(childId));
};



// Recursive function to build the family tree (IDs only) with multiple spouses
const buildFamilyTreeWithIds = (id, relationships) => {
    const memberData = { id, family: [] };

    // Find spouses
    const spouses = findSpouse(id, relationships);

    // For each spouse, find children and build family structure
    spouses.forEach((relationship) => {
        let spouseId = null;

        if (relationship.member_1_id === id) {
            spouseId = relationship.member_2_id;
        } else if (relationship.member_2_id === id) {
            spouseId = relationship.member_1_id;
        }

        // For each spouse, find the children shared with that spouse
        const children = findChildren(id, spouseId, relationships).map((childId) => {
            // Recursively build the child's family tree
            const childTree = buildFamilyTreeWithIds(childId, relationships);

            // Ensure the child's ID is present and its family is correct
            return {
                id: childId,  // Include the child’s ID in the response
                family: childTree.family || []  // Include their family if they have one, otherwise an empty array
            };
        });

        // Add spouse and children as a new family object
        memberData.family.push({
            spouse: spouseId,
            children: children
        });
    });

    // Simplify the structure: if no family members (spouses or children), set family to null
    if (memberData.family.length === 0) {
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
