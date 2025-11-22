import { Router } from "express";
import SeasonController from "../controllers/season.controller";

const router = Router();

router.get("/", SeasonController.getAll);
router.get("/:id/rankings", SeasonController.getRankings);

//  lấy mùa giải theo ID
router.get("/:id", SeasonController.getById);

//  tạo mùa giải mới
router.post("/", SeasonController.create);

//  cập nhật mùa giải
router.put("/:id", SeasonController.update);

//  xóa mùa giải
router.delete("/:id", SeasonController.delete);

export default router;

