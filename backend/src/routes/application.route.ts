// src/routes/application.route.ts
import { Router } from "express";
import ApplicationController from "../controllers/application.controller";

const router = Router();

router.get("/", ApplicationController.getAll);
router.get("/:id", ApplicationController.getById);
router.get("/season/:seasonId", ApplicationController.getBySeason);
router.get("/season/:seasonId/all", ApplicationController.getAllBySeason);
router.post("/", ApplicationController.create);
router.put("/:id", ApplicationController.update);
router.delete("/:id", ApplicationController.delete);
router.get("/season/:seasonId/accepted-teams", ApplicationController.getAcceptedTeamsBySeason);

export default router;
