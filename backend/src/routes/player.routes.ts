// src/routes/player.routes.ts

import { Router } from "express";
import PlayerController from "../controllers/player.controller";

const router = Router();

// Các route của player
router.get("/", PlayerController.getAll);
router.get("/:id", PlayerController.getById);
router.post("/", PlayerController.create);
router.put("/:id", PlayerController.update);
router.delete("/:id", PlayerController.delete);

export default router;
