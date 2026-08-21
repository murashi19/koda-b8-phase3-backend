import express from "express";
import { redirectLink } from "../controllers/link.controller.js";

const router = express.Router();

/**
 * @openapi
 * /{slug}:
 *   get:
 *     tags: [Redirect]
 *     summary: Redirect ke original URL berdasarkan slug
 *     description: Endpoint publik, tidak pakai prefix /api supaya short URL yang dibagikan tetap pendek. Hasil lookup slug di-cache di Redis selama 1 jam.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: artikel-saya
 *     responses:
 *       301:
 *         description: Redirect ke original_url
 *       404:
 *         description: Slug tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:slug", redirectLink);

export default router;
