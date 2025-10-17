const { Router } = require('express');
const { getConfig, updateConfig, deleteConfig } = require('./controller');
const { protect, adminOnly } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');

const router = Router();

router.get('/', protect, adminOnly, asyncHandler(getConfig));
/**
 * @swagger
 * components:
 *   schemas:
 *     BillingModel:
 *       type: object
 *       required: [name, rate]
 *       properties:
 *         name:
 *           type: string
 *           example: Weight-Based
 *         rate:
 *           type: number
 *           minimum: 0
 *           example: 0.5
 *     WasteCategory:
 *       type: object
 *       required: [key, label]
 *       properties:
 *         key:
 *           type: string
 *           example: plastic
 *         label:
 *           type: string
 *           example: Plastic Waste
 *     SystemConfig:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         billingModels:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BillingModel'
 *         wasteCategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WasteCategory'
 *       example:
 *         _id: 665f1e9a2c0fe7e8f1234567
 *         billingModels:
 *           - { name: "Flat Fee", rate: 10 }
 *           - { name: "Weight-Based", rate: 0.5 }
 *         wasteCategories:
 *           - { key: "plastic", label: "Plastic" }
 *           - { key: "paper", label: "Paper" }
 */
/**
 * @swagger
 * /api/configuration:
 *   get:
 *     summary: Get the system configuration
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: Current configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SystemConfig'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/', protect, adminOnly, asyncHandler(updateConfig));
/**
 * @swagger
 * /api/configuration:
 *   put:
 *     summary: Update the system configuration
 *     tags: [Configuration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billingModels:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BillingModel'
 *               wasteCategories:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/WasteCategory'
 *           example:
 *             billingModels:
 *               - { name: "Flat Fee", rate: 10 }
 *               - { name: "Weight-Based", rate: 0.5 }
 *             wasteCategories:
 *               - { key: "plastic", label: "Plastic" }
 *               - { key: "paper", label: "Paper" }
 *     responses:
 *       200:
 *         description: Updated configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SystemConfig'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Validation error (e.g., duplicate category key)
 */
router.delete('/', protect, adminOnly, asyncHandler(deleteConfig));
/**
 * @swagger
 * /api/configuration:
 *   delete:
 *     summary: Reset configuration to defaults (deletes document)
 *     tags: [Configuration]
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

module.exports = router;
