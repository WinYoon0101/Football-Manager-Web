import { Router } from "express";
import SeasonController from "../controllers/season.controller";

const router = Router();

router.get("/", SeasonController.getAll);
router.get("/:id/rankings", SeasonController.getRankings);

export default router;

