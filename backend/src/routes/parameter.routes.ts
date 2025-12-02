import { Router } from "express";
import ParameterController from "../controllers/parameter.controller";

const router = Router();

router.get("/", ParameterController.getAll);
router.get("/:id", ParameterController.getById);
router.put("/:id", ParameterController.update);

export default router;
