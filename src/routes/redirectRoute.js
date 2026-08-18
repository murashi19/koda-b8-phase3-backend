import express from "express";
import { RedirectLink } from "../controllers/link.controller.js";

const router = express.Router();

router.get("/:slug", RedirectLink);

export default router;
