import { Router } from "express";
import MatchController from "../controllers/match.controller";

const router = Router();

// Result routes (phải đặt TRƯỚC route dynamic /:id)
router.get("/results/standings", MatchController.getStandings);
router.get("/results/round/:roundId", MatchController.getResultsByRound);
router.get("/results/team/:teamId", MatchController.getResultsByTeam);
router.get("/results/:id", MatchController.getResultById);
router.get("/results", MatchController.getAllResults);

// Match routes
router.get("/rounds", MatchController.getRounds);
router.get("/", MatchController.getAll);
router.get("/:id", MatchController.getById);
router.post("/", MatchController.create);
router.put("/:id", MatchController.update);
router.delete("/:id", MatchController.delete);

export default router;
