// testFamilyTreeService.js

import { getFamilyTreeById } from './services/familyTreeService.js';  // Correct path for the service
import sequelize from './config/database.js';  // Correct path for the Sequelize instance

// Test Function to call the service
const testFamilyTreeService = async (memberId) => {
  try {
    // Call the service and pass the test member ID
    const familyTree = await getFamilyTreeById(memberId, 1, 2, 3);

    // Log the results to see if the data is returned correctly
    console.log('Family Tree for Member ID:', memberId);
    
    // Use JSON.stringify to display the full nested structure
    console.log('Family Tree:', JSON.stringify(familyTree.family_tree_by_id, null, 2));  // Pretty print with 2 spaces
    console.log('Members:', familyTree.members);

  } catch (error) {
    console.error('Error fetching family tree:', error.message);
  } finally {
    // Close the DB connection after the test
    await sequelize.close();
  }
};

// Provide a test member ID
const testMemberId = 1;  // Change this ID to whatever is available in your DB
testFamilyTreeService(testMemberId);
