// src/controllers/team.controller.ts

import { Request, Response } from "express";
import TeamService from "../services/team.service";

class TeamController {
  // Lấy tất cả team
  async getAll(req: Request, res: Response) {
    try {
      const data = await TeamService.getAll();
      res.json(data);  // Trả về tất cả các team
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Lấy team theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await TeamService.getById(id);

      if (!data) {
        return res.status(404).json({ message: "Team not found" });  // Nếu không tìm thấy team
      }

      res.json(data);  // Trả về thông tin team
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Tạo team mới
  async create(req: Request, res: Response) {
    try {
      const data = await TeamService.create(req.body);
      res.status(201).json(data);  // Trả về thông tin team mới tạo
    } catch (err) {
      res.status(500).json({ message: "Failed to create team" });
    }
  }

  // Cập nhật thông tin team
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await TeamService.update(id, req.body);
      res.json(updated);  // Trả về thông tin team đã được cập nhật
    } catch (err) {
      res.status(500).json({ message: "Failed to update team" });
    }
  }

  // Xóa team
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await TeamService.delete(id);
      res.json({ message: "Team deleted" });  // Thông báo đã xóa thành công
    } catch (err) {
      res.status(500).json({ message: "Failed to delete team" });
    }
  }
}

export default new TeamController();
