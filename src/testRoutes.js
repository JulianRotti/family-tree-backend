import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/family'; // Fix base URL

const testUpdate = async (id, updateData) => {
    try {
        const response = await axios.patch(`${BASE_URL}/members`, updateData);
        console.log(`✅ Success (ID: ${id}):`, response.data);
    } catch (error) {
        console.error(`❌ Error (ID: ${id}):`, error.response ? error.response.data : error.message);
    }
};

// Test Cases
const existingId = "30"; // Change to a valid existing ID
const nonExistingId = "9999"; // Change to an ID that doesn't exist

// Partial update data
const updateData = {
    first_name: 'Kello',
    last_name: 'Rorols',
    birth_date: '2000-01-01',
    birth_city: 'New City',
    birth_country: 'New Country',
    email: 'updated@example.com'
};

// Run tests
(async () => {
    console.log('🔹 Testing with existing ID...');
    updateData.id = existingId;
    await testUpdate(existingId, updateData);

    console.log('🔹 Testing with non-existing ID...');
    updateData.id = nonExistingId;
    await testUpdate(nonExistingId, updateData);
})();
