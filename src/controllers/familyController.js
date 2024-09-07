// src/controllers/familyController.js

import * as familyService from '../services/familyService.js';
import * as familyTreeService from '../services/familyTreeService.js';  // Import the family tree service

// Fetch all members
export const getAllMembers = async (req, res) => {
    try {
        const members = await familyService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

// Create a new member
export const createMember = async (req, res) => {
    try {
        const newMember = await familyService.createMember(req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create member' });
    }
};

// Fetch all relationships
export const getAllRelationships = async (req, res) => {
    try {
        const relationships = await familyService.getAllRelationships();
        res.status(200).json(relationships);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch relationships' });
    }
};

// Create a new relationship
export const createRelationship = async (req, res) => {
    try {
        const newRelationship = await familyService.createRelationship(req.body);
        res.status(201).json(newRelationship);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create relationship' });
    }
};

export const getFamilyTreeById = async (req, res) => {
    const { id } = req.params;  // `id` is already an integer, thanks to middleware

    try {
        const familyTree = await familyTreeService.getFamilyTreeById(id);
        res.status(200).json(familyTree);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch family tree' });
    }
};

