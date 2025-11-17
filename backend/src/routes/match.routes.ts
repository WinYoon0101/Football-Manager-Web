import { Router } from "express";
import MatchController from "../controllers/match.controller";

const router = Router();

// Match routes
router.get("/", MatchController.getAll);
router.get("/rounds", MatchController.getRounds);
router.get("/:id", MatchController.getById);
router.post("/", MatchController.create);
router.put("/:id", MatchController.update);
router.delete("/:id", MatchController.delete);

// Result routes (merged from result.routes.ts)
router.get("/results", MatchController.getAllResults);
router.get("/results/:id", MatchController.getResultById);
router.get("/results/round/:roundId", MatchController.getResultsByRound);
router.get("/results/team/:teamId", MatchController.getResultsByTeam);
router.get("/results/standings", MatchController.getStandings);

export default router;
