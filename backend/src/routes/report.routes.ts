import { Router } from "express";
import ReportController from "../controllers/report.controller";

const router = Router();

// Report routes
router.get("/teams/stats", (req, res, next) => {
  ReportController.getTeamStats(req, res).catch(next);
});

router.get("/players/stats", (req, res, next) => {
  ReportController.getPlayerStats(req, res).catch(next);
});

export default router;

