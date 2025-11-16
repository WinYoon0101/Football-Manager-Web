import { Router } from "express";
import PlayerController from "../controllers/player.controller";
import { uploadSingle } from "../middlewares/upload";

const router = Router();

router.get("/", PlayerController.getAll);
router.get("/types", PlayerController.getPlayerTypes);
router.get("/:id", PlayerController.getById);
router.post("/", uploadSingle("image"), PlayerController.create);
router.put("/:id", uploadSingle("image"), PlayerController.update);
router.delete("/:id", PlayerController.delete);

export default router;

