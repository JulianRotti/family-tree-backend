// src/routes/familyRoutes.js

import express from 'express';
import {
    getAllMembers,
    createMember,
    getAllRelationships,
    createRelationship
} from '../controllers/familyController.js';

import { validateRelationship } from '../middleware/validateRelationship.js';  // Correct middleware folder
import { validateMember } from '../middleware/validateMember.js';              // Correct middleware folder

const router = express.Router();

/**
 * @swagger
 * /api/family/members:
 *   get:
 *     summary: Retrieve a list of family members
 *     description: Fetches all the members in the family.
 *     responses:
 *       200:
 *         description: A list of family members.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   birth_date:
 *                     type: string
 *                     format: date
 *                   death_date:
 *                     type: string
 *                     format: date
 */
router.get('/members', getAllMembers);

/**
 * @swagger
 * /api/family/members:
 *   post:
 *     summary: Create a new family member
 *     description: Adds a new member to the family.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - birth_date
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               death_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Created a new member.
 *       400:
 *         description: Invalid input.
 */
router.post('/members', validateMember, createMember);

/**
 * @swagger
 * /api/family/relationships:
 *   get:
 *     summary: Retrieve a list of relationships
 *     description: Fetches all the relationships in the family.
 *     responses:
 *       200:
 *         description: A list of relationships.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   member_1_id:
 *                     type: integer
 *                   member_2_id:
 *                     type: integer
 *                   relationship:
 *                     type: string
 */
router.get('/relationships', getAllRelationships);

/**
 * @swagger
 * /api/family/relationships:
 *   post:
 *     summary: Create a new relationship
 *     description: Adds a new relationship between family members.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - member_1_id
 *               - member_2_id
 *               - relationship
 *             properties:
 *               member_1_id:
 *                 type: integer
 *               member_2_id:
 *                 type: integer
 *               relationship:
 *                 type: string
 *                 enum: [parent, sibling, spouse]
 *     responses:
 *       201:
 *         description: Created a new relationship.
 *       400:
 *         description: Validation error.
 */
router.post('/relationships', validateRelationship, createRelationship);

export default router;
