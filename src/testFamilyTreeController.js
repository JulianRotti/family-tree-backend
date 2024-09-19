// Import the controller function you want to test
import { getFamilyTreeById } from './controllers/familyController.js';

// Simulate the test function to call the controller
const testGetFamilyTreeById = async (memberId, w_node, w_partner, w_children) => {
  // Mock request (req) object with query parameters
  const req = {
    params: { id: memberId },  // Simulate route parameter
    query: {                   // Simulate query parameters
      w_node: w_node.toString(),  // Query parameters are strings in HTTP requests
      w_partner: w_partner.toString(),
      w_children: w_children.toString(),
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

  // Call the controller directly with the mocked req and res
  await getFamilyTreeById(req, res);
};

// Test the controller with a specific memberId and custom widths
testGetFamilyTreeById(1, 1, 2, 3);
