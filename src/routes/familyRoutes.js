// src/routes/familyRoutes.js

import express from 'express';
import { convertIdToInt } from '../middleware/convertId.js';  // Import the middleware
import {
    getAllMembers,
    createMember,
    getAllRelationships,
    createRelationship,
    getFamilyTreeById
} from '../controllers/familyController.js';

const router = express.Router();

// Apply the middleware to automatically convert `id` to an integer
router.param('id', convertIdToInt);

// Define the routes
router.get('/members', getAllMembers);
router.post('/members', createMember);
router.get('/relationships', getAllRelationships);
router.post('/relationships', createRelationship);
router.get('/family-tree/:id', getFamilyTreeById);

export default router;
