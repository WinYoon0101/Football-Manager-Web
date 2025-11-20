import { Request, Response } from "express";
import SeasonService from "../services/season.service";

class SeasonController {
  // Xử lý request lấy tất cả mùa giải (params: req/res từ Express; output: JSON danh sách mùa giải; usage: route GET /seasons)
  async getAll(req: Request, res: Response) {
    try {
      const seasons = await SeasonService.getAll();
      res.json(seasons);
    } catch (err: any) {
      console.error("Get seasons error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xử lý request lấy ranking theo mùa (params: req.params.id; output: JSON ranking; usage: route GET /seasons/:id/rankings)
  async getRankings(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.id);

      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "ID mùa giải không hợp lệ" });
      }

      const rankings = await SeasonService.getRankingsBySeason(seasonId);
      res.json(rankings);
    } catch (err: any) {
      console.error("Get rankings error:", err);
      res.status(500).json({
        message: "Không thể lấy bảng xếp hạng mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new SeasonController();

