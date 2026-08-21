import express from "express";
import {
  createLink,
  deleteLink,
  getAllLinks,
  getDashboardStats,
} from "../controllers/link.controller.js";

import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);

/**
 * @openapi
 * /api/links:
 *   get:
 *     tags: [Links]
 *     summary: List link milik user yang login (dengan pagination & search)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Halaman ke berapa
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan slug atau original_url
 *     responses:
 *       200:
 *         description: Daftar link berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lists Links
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Link'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       example: 12
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/links", getAllLinks);

/**
 * @openapi
 * /api/links/{id}:
 *   delete:
 *     tags: [Links]
 *     summary: Hapus link milik sendiri
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID link yang mau dihapus
 *     responses:
 *       200:
 *         description: Link berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Link deleted successfully
 *                 results:
 *                   $ref: '#/components/schemas/Link'
 *       401:
 *         description: Token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Link tidak ditemukan atau bukan milik user ini
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/links/:id", deleteLink);

/**
 * @openapi
 * /api/links:
 *   post:
 *     tags: [Links]
 *     summary: Buat short link baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [originalUrl]
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://example.com/artikel-panjang
 *               customSlug:
 *                 type: string
 *                 description: Opsional. Kalau kosong, slug akan digenerate otomatis. Hanya boleh huruf, angka, dan dash, panjang 3-50 karakter.
 *                 example: artikel-saya
 *     responses:
 *       201:
 *         description: Link berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Link created successfully
 *                 results:
 *                   $ref: '#/components/schemas/Link'
 *       400:
 *         description: originalUrl kosong/tidak valid, atau customSlug tidak memenuhi aturan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: customSlug sudah dipakai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/links", createLink);

/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     tags: [Links]
 *     summary: Statistik ringkas untuk dashboard user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard stats retrieved
 *                 results:
 *                   type: object
 *                   properties:
 *                     totalLinks:
 *                       type: integer
 *                       example: 12
 *                     recentLinks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Link'
 *       401:
 *         description: Token tidak ada atau tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/dashboard", getDashboardStats);

export default router;
