import { Router } from "express";
import UserController from "../controllers/user.controller";

const router = Router();

// ---------------- AUTH ----------------

// Cập nhật profile, team
router.patch("/me", UserController.updateProfile);
router.patch("/team", UserController.setTeam);

// ---------------- ADMIN ----------------
// Lấy tất cả users (admin)
router.get("/", UserController.listUsers);

// Gửi id trực tiếp
router.get("/:id", UserController.getById);

// Tạo user mới
router.post("/", UserController.createUser);

// Xóa user
router.delete("/:id", UserController.deleteUser);
export default router;
