// src/controllers/familyController.js

import * as familyService from '../services/familyService.js';

export const getAllMembers = async (req, res) => {
    try {
        const members = await familyService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

export const createMember = async (req, res) => {
    try {
        const newMember = await familyService.createMember(req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create member' });
    }
};

export const getAllRelationships = async (req, res) => {
    try {
        const relationships = await familyService.getAllRelationships();
        res.status(200).json(relationships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch relationships' });
    }
};

export const createRelationship = async (req, res) => {
    try {
        const newRelationship = await familyService.createRelationship(req.body);
        res.status(201).json(newRelationship);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create relationship' });
    }
};
