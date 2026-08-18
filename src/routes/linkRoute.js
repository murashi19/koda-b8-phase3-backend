import express from "express";
import { GetAllLinks } from "../controllers/link.controller.js";

import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);

router.get("/links", GetAllLinks);

export default router;
