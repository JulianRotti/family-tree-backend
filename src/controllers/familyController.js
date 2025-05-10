// src/controllers/familyController.js

import * as familyService from '../services/familyService.js';
import * as familyTreeService from '../services/familyTreeService.js'; 
import * as fileStorageService from '../services/storage/fileStorageService.js';

/* Todos
- wrap upload file and create member in a transaction with rollback
- upload logic for updateMember (if path contains filename => okay, else delete old file and upload new file)
*/

// Fetch all members
export const getAllMembers = async (req, res) => {
    try {
        const members = await familyService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Abrufen der Mitglieder: ${error}.` });
    }
};

export const updateMember = async (req, res) => {
    try {
        const updated = await familyService.updateMember(req.body);
        if (updated) {
            res.status(200).json({ message: 'Familienmitglied aktualisiert.' });
        } else {
            res.status(404).json({ error: 'Kein Familienmitglied mit dieser ID.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Aktualisieren des Familienmitglieds: ${error}.` });
    }
};

// Fetch members by first_name, last_name, and birth_date (use req.query)
export const getMemberByAttributes = async (req, res) => {
    const { first_name, last_name, birth_date } = req.query; // Use query parameters
    try {
        const member = await familyService.getMemberByAttributes(first_name, last_name, birth_date);
        if (member) {
            res.status(200).json(member);
        } else {
            res.status(404).json({ error: 'Mitglied nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Abrufen des Mitglieds: ${error}.` });
    }
};

export const getMemberById = async (req, res) => {
    const { id } = req.params; 
    try {
        const member = await familyService.getMemberById(id);
        if (member) {
            res.status(200).json(member);
        } else {
            res.status(404).json({ error: 'Mitglied nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Abrufen des Mitglieds: ${error}.` });
    }
};

// Create a new member
export const createMember = async (req, res) => {
    //process.stdout.write("test start\n");
    try {
        let image_path = null;
        if (req.file) {
            image_path = await fileStorageService.saveImageAndReturnUrl(req);
        }
        const newMember = await familyService.createMember({ ...req.body, image_path });
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Erstellen des Mitglieds: ${error}.` });
    }
};

// Fetch all relationships
export const getAllRelationships = async (req, res) => {
    try {
        const relationships = await familyService.getAllRelationships();
        res.status(200).json(relationships);
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Abrufen der Beziehungen: ${error}.` });
    }
};

// Fetch relationships by member_1_id, member_2_id, and relationship (use req.query)
export const getRelationshipByAttributes = async (req, res) => {
    const { member_1_id, member_2_id, relationship } = req.query; // Use query parameters
    try {
        const relationshipData = await familyService.getRelationshipByAttributes(member_1_id, member_2_id, relationship);
        if (relationshipData) {
            res.status(200).json(relationshipData);
        } else {
            res.status(404).json({ error: 'Beziehung nicht gefunden.' });
        }
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Abrufen der Beziehung: ${error}.` });
    }
};

// Create a new relationship
export const createRelationship = async (req, res) => {
    try {
        const newRelationship = await familyService.createRelationship(req.body);
        res.status(201).json(newRelationship);
    } catch (error) {
        res.status(500).json({ error: `Fehler beim Erstellen der Beziehung: ${error}.` });
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
        res.status(500).json({ error: `Fehler beim Abrufen des Stammbaums: ${error}.` });
    }
};
