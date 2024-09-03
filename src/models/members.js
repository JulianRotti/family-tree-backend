// src/models/members.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Member = sequelize.define('Member', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    initial_last_name: {
        type: DataTypes.STRING,
    },
    birth_date: {
        type: DataTypes.DATEONLY,
    },
    death_date: {
        type: DataTypes.DATEONLY,
    },
}, {
    timestamps: false, // Assuming your table does not have createdAt/updatedAt columns
    tableName: 'members', // Ensure this matches your existing table name
});

export default Member;
