// src/controllers/player.controller.ts

import { Request, Response } from "express";
import PlayerService from "../services/player.service";

class PlayerController {
  // Lấy tất cả player
  async getAll(req: Request, res: Response) {
    try {
      const players = await PlayerService.getAll();
      res.json(players);
    } catch (err) {
      res.status(500).json({ message: "Error fetching players" });
    }
  }

  // Lấy player theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const player = await PlayerService.getById(id);

      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      res.json(player);
    } catch (err) {
      res.status(500).json({ message: "Error fetching player" });
    }
  }

  // Tạo player mới
  async create(req: Request, res: Response) {
    try {
      const player = await PlayerService.create(req.body);
      res.status(201).json(player);
    } catch (err) {
      res.status(500).json({ message: "Failed to create player" });
    }
  }

  // Cập nhật thông tin player
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedPlayer = await PlayerService.update(id, req.body);
      res.json(updatedPlayer);
    } catch (err) {
      res.status(500).json({ message: "Failed to update player" });
    }
  }

  // Xóa player
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await PlayerService.delete(id);
      res.json({ message: "Player deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete player" });
    }
  }
}

export default new PlayerController();
