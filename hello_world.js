import sequelize from './src/config/database.js';
import Member from './src/models/members.js';
import Relationship from './src/models/relationships.js';

async function runTest() {
    try {
        // Connect to the database
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Fetch all members from the database
        const members = await Member.findAll();
        console.log('All members:', JSON.stringify(members, null, 2));

        // Fetch all relationships from the database
        const relationships = await Relationship.findAll();
        console.log('All relationships:', JSON.stringify(relationships, null, 2));

        // Find a specific member by their first and last name
        const specificMember = await Member.findOne({ where: { first_name: 'Sebald', last_name: 'Horn' } });
        console.log('Specific member:', JSON.stringify(specificMember, null, 2));

        // Fetch relationships for a specific member
        if (specificMember) {
            const memberRelationships = await Relationship.findAll({ where: { member_1_id: specificMember.id } });
            console.log(`Relationships for ${specificMember.first_name} ${specificMember.last_name}:`, JSON.stringify(memberRelationships, null, 2));
        }

    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        // Close the database connection
        await sequelize.close();
        console.log('Database connection closed.');
    }
}

runTest();
