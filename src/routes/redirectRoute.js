import express from "express";
import { redirectLink } from "../controllers/link.controller.js";

const router = express.Router();

router.get("/:slug", redirectLink);

export default router;
