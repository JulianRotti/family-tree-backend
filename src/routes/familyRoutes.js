// src/routes/familyRoutes.js

import express from 'express';
import { validateFamilyTreeQuery } from '../middleware/validateFamilyTreeQuery.js';
import { validateId } from '../middleware/validateId.js';
import { validateDoubleMember, validateMember } from '../middleware/validateMember.js';
import { validateRelationship } from '../middleware/validateRelationship.js';
import { validateTokenAndRole } from '../middleware/validateTokenAndRole.js';
import { convertToNull } from '../middleware/convertToNull.js';
import { 
    getAllMembers, 
    updateMember, 
    createMember, 
    getAllRelationships, 
    createRelationship, 
    getFamilyTreeById,
} from '../controllers/familyController.js';

const router = express.Router();

// Apply the middleware to validate `id` and query parameters (w_node, w_partner, w_children)
router.get(
    '/family-tree/:id', 
    validateTokenAndRole('editor'), 
    validateId, 
    validateFamilyTreeQuery, 
    getFamilyTreeById
);

// Define other routes
router.get(
    '/members', 
    validateTokenAndRole('viewer'), 
    getAllMembers
);
router.post(
    '/members', 
    validateTokenAndRole('editor'), 
    validateMember,
    validateDoubleMember,
    convertToNull,
    createMember
);
router.get(
    '/relationships', 
    validateTokenAndRole('viewer'), 
    getAllRelationships
);
router.post(
    '/relationships', 
    validateTokenAndRole('editor'), 
    validateRelationship, 
    createRelationship
);
router.patch(
    '/members', 
    validateTokenAndRole('editor'), 
    validateId, 
    validateMember,
    convertToNull, 
    updateMember
);

export default router;
