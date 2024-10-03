// Import the controller functions you want to test
import { getMemberByAttributes, getRelationshipByAttributes } from './controllers/familyController.js';

// Simulate the test function to call the controller for fetching a member by attributes
const testGetMemberByAttribute = async (first_name, last_name, birth_date) => {
  // Mock request (req) object with query parameters
  const req = {
    query: {                   // Simulate query parameters
      first_name: first_name.toString(),  // Query parameters are strings in HTTP requests
      last_name: last_name.toString(),
      birth_date: birth_date.toString(),  // Ensure birth_date is in 'YYYY-MM-DD' format
    },
  };

  // Mock response (res) object
  const res = {
    status: function (statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json: function (data) {
      console.log('Status:', this.statusCode);
      console.log('JSON Response:', JSON.stringify(data, null, 2));
    },
  };

  try {
    // Call the controller directly with the mocked req and res
    await getMemberByAttributes(req, res);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Simulate the test function to call the controller for fetching a relationship by attributes
const testGetRelationshipByAttributes = async (member_1_id, member_2_id, relationship) => {
  // Mock request (req) object with query parameters
  const req = {
    query: {                   // Simulate query parameters
      member_1_id: member_1_id.toString(),  // Convert member_1_id to string
      member_2_id: member_2_id.toString(),  // Convert member_2_id to string
      relationship: relationship.toString(),
    },
  };

  // Mock response (res) object
  const res = {
    status: function (statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json: function (data) {
      console.log('Status:', this.statusCode);
      console.log('JSON Response:', JSON.stringify(data, null, 2));
    },
  };

  try {
    // Call the correct controller with the mocked req and res
    await getRelationshipByAttributes(req, res);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Test the controller with a specific member's first_name, last_name, and birth_date
testGetMemberByAttribute('Sebald', 'Horn', '1930-01-01');

// Test the controller with a specific relationship's member_1_id, member_2_id, and relationship
testGetRelationshipByAttributes(1, 7, 'spouse');
