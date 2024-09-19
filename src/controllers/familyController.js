// src/controllers/familyController.js

import * as familyService from '../services/familyService.js';
import * as familyTreeService from '../services/familyTreeService.js'; 

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

// Fetch family tree by member ID with visualization parameters
export const getFamilyTreeById = async (req, res) => {
    const { id } = req.params;  // `id` is already an integer, thanks to middleware

    // Extract query parameters (with defaults)
    const w_node = parseInt(req.query.w_node) || 10;  // Default width of a node
    const w_partner = parseInt(req.query.w_partner) || 40;  // Default space between node and spouse
    const w_children = parseInt(req.query.w_children) || 50;  // Default space between children

    try {
        // Pass id and the visualization parameters to the service function
        const familyTree = await familyTreeService.getFamilyTreeById(id, w_node, w_partner, w_children);
        res.status(200).json(familyTree);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch family tree' });
    }
};
