import { Router } from "express";
import TeamController from "../controllers/team.controller";
import { uploadSingle } from "../middlewares/upload";

const router = Router();

router.get("/", TeamController.getAll);
router.get("/:id", TeamController.getById);
router.post("/", uploadSingle("logo"), TeamController.create);
router.put("/:id", uploadSingle("logo"), TeamController.update);
router.delete("/:id", TeamController.delete);

export default router;
