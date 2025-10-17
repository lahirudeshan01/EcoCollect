const { Router } = require('express');
const { getConfig, updateConfig, deleteConfig } = require('./controller');
const { protect, adminOnly } = require('../../middleware/auth.middleware');
const asyncHandler = require('../../utils/asyncHandler');

const router = Router();

router.get('/', protect, adminOnly, asyncHandler(getConfig));
/**
 * @swagger
 * /api/configuration:
 *   get:
 *     summary: Get the system configuration
 *     tags: [Configuration]
 *     responses:
 *       200:
 *         description: Current configuration
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
 *     responses:
 *       200:
 *         description: Updated configuration
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
