import { Router } from "express";
import GoalController from "../controllers/goal.controller";

const router = Router();

router.get("/", GoalController.getAll);
router.get("/types", GoalController.getGoalTypes);
router.get("/match/:matchId", GoalController.getByMatch);
router.get("/:id", GoalController.getById);
router.post("/", GoalController.create);
router.put("/:id", GoalController.update);
router.delete("/:id", GoalController.delete);

export default router;
