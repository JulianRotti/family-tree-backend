// src/models/relationships.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Member from './members.js';

const Relationship = sequelize.define('Relationship', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    member_1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Member,
            key: 'id',
        },
    },
    member_2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Member,
            key: 'id',
        },
    },
    relationship: {
        type: DataTypes.ENUM('parent', 'spouse'),
        allowNull: false,
    },
    connection_hash: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'relationships',
});

export default Relationship;
