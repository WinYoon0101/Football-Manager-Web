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

  // // Lấy mùa giải mới nhất
  // async getNewest(req: Request, res: Response) {
  //   try {
  //     const newestSeason = await SeasonService.getNewest();
  //     res.json(newestSeason);
  //   } catch (err: any) {
  //     console.error("Get newest season error:", err);
  //     res.status(500).json({
  //       message: "Không thể lấy mùa giải mới nhất",
  //       error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  //     });
  //   }
  // }

   // Tạo mới mùa giải
  async create(req: Request, res: Response) {
    try {
      const { name, startDate, endDate } = req.body;

      if (!name || !startDate || !endDate) {
        return res.status(400).json({
          message: "Thiếu dữ liệu (name, startDate, endDate)",
        });
      }

      const newSeason = await SeasonService.create({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      res.status(201).json(newSeason);
    } catch (err: any) {
      console.error("Create season error:", err);
      res.status(500).json({
        message: "Không thể tạo mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy mùa giải theo ID
  async getById(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.id);

      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "ID mùa giải không hợp lệ" });
      }

      const season = await SeasonService.getById(seasonId);

      if (!season) {
        return res.status(404).json({ message: "Không tìm thấy mùa giải" });
      }

      res.json(season);
    } catch (err: any) {
      console.error("Get season by ID error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }  
  // Cập nhật mùa giải
  async update(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.id);

      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "ID mùa giải không hợp lệ" });
      }

      const { name, startDate, endDate } = req.body;

      const updatedSeason = await SeasonService.update(seasonId, {
        name,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });

      res.json(updatedSeason);
    } catch (err: any) {
      console.error("Update season error:", err);
      res.status(500).json({
        message: "Không thể cập nhật mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xóa mùa giải
  async delete(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.id);

      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "ID mùa giải không hợp lệ" });
      }

      await SeasonService.delete(seasonId);

      res.json({ message: "Đã xóa mùa giải thành công" });
    } catch (err: any) {
      console.error("Delete season error:", err);
      res.status(500).json({
        message: "Không thể xóa mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new SeasonController();

