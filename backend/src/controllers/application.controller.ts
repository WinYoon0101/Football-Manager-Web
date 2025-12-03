// src/controllers/application.controller.ts
import { Request, Response } from "express";
import ApplicationService from "../services/application.service";

class ApplicationController {
  // Lấy tất cả applications
  async getAll(req: Request, res: Response) {
    try {
      const applications = await ApplicationService.getAll();
      res.json(applications);
    } catch (err: any) {
      console.error("Get applications error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách applications",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy application theo ID
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID application không hợp lệ" });
      }

      const application = await ApplicationService.getById(id);
      if (!application) {
        return res.status(404).json({ message: "Không tìm thấy application" });
      }

      res.json(application);
    } catch (err: any) {
      console.error("Get application by ID error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin application",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }


  // ✅ Lấy tất cả applications của một season, không phân biệt status
  async getAllBySeason(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.seasonId);
      if (!seasonId) return res.status(400).json({ success: false, message: "Season ID không hợp lệ" });

      const applications = await ApplicationService.getAllBySeason(seasonId);
      res.json(applications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }


  // Lấy applications theo season
  async getBySeason(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.seasonId);
      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "ID season không hợp lệ" });
      }

      const applications = await ApplicationService.getBySeason(seasonId);
      res.json(applications);
    } catch (err: any) {
      console.error("Get applications by season error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách applications theo mùa giải",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Tạo mới application
  async create(req: Request, res: Response) {
    try {
      const { teamId, seasonId, status } = req.body;

      if (!teamId || !seasonId) {
        return res.status(400).json({
          message: "Thiếu dữ liệu (teamId, seasonId)",
        });
      }

      const newApplication = await ApplicationService.create({
        teamId,
        seasonId,
        status,
      });

      res.status(201).json(newApplication);
    } catch (err: any) {
      console.error("Create application error:", err);
      res.status(500).json({
        message: "Không thể tạo application",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Cập nhật application
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID application không hợp lệ" });
      }

      const { teamId, seasonId, status } = req.body;

      const updatedApplication = await ApplicationService.update(id, {
        teamId,
        seasonId,
        status,
      });

      res.json(updatedApplication);
    } catch (err: any) {
      console.error("Update application error:", err);
      res.status(500).json({
        message: "Không thể cập nhật application",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xóa application
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: "ID application không hợp lệ" });
      }

      await ApplicationService.delete(id);
      res.json({ message: "Đã xóa application thành công" });
    } catch (err: any) {
      console.error("Delete application error:", err);
      res.status(500).json({
        message: "Không thể xóa application",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy teams được accepted của season
  async getAcceptedTeamsBySeason(req: Request, res: Response) {
    try {
      const seasonId = Number(req.params.seasonId);
      if (isNaN(seasonId) || seasonId <= 0) {
        return res.status(400).json({ message: "Season ID không hợp lệ" });
      }

      const teams = await ApplicationService.getAcceptedTeamsBySeason(seasonId);
      res.json(teams);
    } catch (err: any) {
      console.error("Get accepted teams by season error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách teams được accepted",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new ApplicationController();
