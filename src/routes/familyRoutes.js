// src/routes/familyRoutes.js

import express from 'express';
import { convertIdAndValidateQuery } from '../middleware/convertIdAndValidateQuery.js';  // Import the updated middleware
import { validateMember } from '../middleware/validateMember.js';
import { validateRelationship } from '../middleware/validateRelationship.js';
import {
    getAllMembers,
    createMember,
    getAllRelationships,
    createRelationship,
    getFamilyTreeById
} from '../controllers/familyController.js';

const router = express.Router();

// Apply the middleware to validate `id` and query parameters (w_node, w_partner, w_children)
router.get('/family-tree/:id', convertIdAndValidateQuery, getFamilyTreeById);

// Define other routes
router.get('/members', getAllMembers);
router.post('/members', validateMember, createMember);
router.get('/relationships', getAllRelationships);
router.post('/relationships', validateRelationship, createRelationship);

export default router;
