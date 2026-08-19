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

router.get("/links", getAllLinks);
router.delete("/links/:id", deleteLink);
router.post("/links", createLink);
router.get("/dashboard", getDashboardStats);

export default router;
