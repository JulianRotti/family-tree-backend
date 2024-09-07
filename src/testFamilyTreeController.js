// testFamilyController.js

// Import the controller function you want to test
import { getFamilyTreeById } from './controllers/familyController.js';

// Simulate the test function to call the controller
const testGetFamilyTreeById = async (memberId) => {
  // Mock request (req) object
  const req = {
    params: { id: memberId },  // Simulate route parameter
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

  // Call the controller directly with the mocked req and res
  await getFamilyTreeById(req, res);
};

// Test the controller with a specific memberId
testGetFamilyTreeById(1);
