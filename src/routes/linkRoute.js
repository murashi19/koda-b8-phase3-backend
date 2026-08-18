import express from "express";
import {
  CreateLink,
  DeleteLink,
  GetAllLinks,
} from "../controllers/link.controller.js";

import authMiddleware from "../middlewares/auth.js";
const router = express.Router();

router.use(authMiddleware);

router.get("/links", GetAllLinks);
router.delete("/links/:id", DeleteLink);
router.post("/links", CreateLink);

export default router;
