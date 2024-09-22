// src/services/familyTreeService.js

import sequelize from '../config/database.js';
import Member from '../models/members.js';
import Relationship from '../models/relationships.js';

// Helper function to find relationships for a given member
const findSpouse = (id, relationships) => {
    const spouseRelationships = relationships.filter((relationship) => {
        return relationship.relationship === "spouse" &&
               (relationship.member_1_id === id || relationship.member_2_id === id);
    });
    return spouseRelationships;
};

// Helper function to find all children for a given parent
const findChildrenForParent = (parentId, relationships) => {
    const children = relationships
        .filter((relationship) => {
            return relationship.relationship === 'parent' && relationship.member_1_id === parentId;
        })
        .map((relationship) => relationship.member_2_id);  // Return only child IDs
    return children
};

// Updated findChildren function to return only children shared by both id_1 and id_2
const findChildren = (id_1, id_2, relationships) => {
    // Get children of both parents
    const childrenOfId1 = findChildrenForParent(id_1, relationships);
    const childrenOfId2 = findChildrenForParent(id_2, relationships);

    // Return the intersection of both sets of children (shared children)
    return childrenOfId1.filter((childId) => childrenOfId2.includes(childId));
};


// Recursive function to build the family tree with subtree length, accepting w_node, w_partner, and w_children as input parameters
const buildFamilyTreeWithIdsAndSubtreeLen = (id, relationships, w_node, w_partner, w_children) => {
    const memberData = { id, family: [] };
    let subtreeLen = 0;

    // Find spouses
    const spouses = findSpouse(id, relationships);

    // Check if the member has no family (no spouses or no children)
    if (spouses.length === 0) {
        return { id, subtree_len: w_node + w_children, family: [] };
    }

    // Collect families with children
    let familiesWithChildren = spouses.map((relationship) => {
        let spouseId = relationship.member_1_id === id ? relationship.member_2_id : relationship.member_1_id;

        // Find children shared with the spouse
        const children = findChildren(id, spouseId, relationships).map((childId) => {
            // Recursively build the child's family tree with subtree length
            return buildFamilyTreeWithIdsAndSubtreeLen(childId, relationships, w_node, w_partner, w_children);
        });

        // !!! Calculate family subtree length as the sum of all children's subtree lengths
        const familySubtreeLen = children.reduce((acc, child) => acc + child.subtree_len, 0);

        return { spouse: spouseId, subtree_len: familySubtreeLen, children: children };  // Include family subtree length
    }).filter(family => family.children.length > 0);

    // !!! Calculate total subtree length for this member based on families
    if (familiesWithChildren.length === 0) {
        subtreeLen = w_node + w_children;
    } else if (familiesWithChildren.length === 1) {
        // Case 1: Only one family with children
        const len_children_fam = familiesWithChildren[0].subtree_len;  // Use family subtree_len
        subtreeLen = Math.max(w_partner + w_children + 2 * w_node, len_children_fam);
    } else {
        // Case 2: Multiple families with children
        subtreeLen += w_partner / 2 + w_children / 2 + w_node;
        familiesWithChildren.forEach(family => {
            const len_children_fam = family.subtree_len;  // Use family subtree_len
            subtreeLen += Math.max(w_partner + w_node, len_children_fam);
        });
    }

    // Return the member data with calculated subtree length
    return {
        id,
        subtree_len: subtreeLen,
        family: familiesWithChildren
    };
};


// Fetch family tree by member ID
export const getFamilyTreeById = async (id, w_node, w_partner, w_children) => {
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
        const familyTree = buildFamilyTreeWithIdsAndSubtreeLen(id, relationships, w_node, w_partner, w_children);

        // Return the family tree (IDs only) and the member metadata
        return { family_tree_by_id: familyTree, members: members };
    } catch (error) {
        console.error('Error fetching family tree:', error);
        throw new Error('Could not fetch family tree');
    }
};
