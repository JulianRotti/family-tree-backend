// src/routes/familyRoutes.js

import express from 'express';
import {
    getAllMembers,
    createMember,
    getAllRelationships,
    createRelationship
} from '../controllers/familyController.js';

const router = express.Router();

// Member routes
router.get('/members', getAllMembers);
router.post('/members', createMember);

// Relationship routes
router.get('/relationships', getAllRelationships);
router.post('/relationships', createRelationship);

export default router;
