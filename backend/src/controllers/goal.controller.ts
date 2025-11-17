// src/controllers/goal.controller.ts

import { Request, Response } from "express";
import GoalService from "../services/goal.service";
import prisma from "../config/prisma";

class GoalController {
  // Lấy tất cả goals
  async getAll(req: Request, res: Response) {
    try {
      const data = await GoalService.getAll();
      res.json(data);
    } catch (err: any) {
      console.error("Get all goals error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy goal theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID bàn thắng không hợp lệ",
        });
      }

      const data = await GoalService.getById(id);

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy bàn thắng" });
      }

      res.json(data);
    } catch (err: any) {
      console.error("Get goal by id error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy goals theo match
  async getByMatch(req: Request, res: Response) {
    try {
      const matchId = Number(req.params.matchId);

      if (isNaN(matchId) || matchId <= 0) {
        return res.status(400).json({
          message: "ID trận đấu không hợp lệ",
        });
      }

      const data = await GoalService.getByMatch(matchId);
      res.json(data);
    } catch (err: any) {
      console.error("Get goals by match error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Tạo goal mới
  async create(req: Request, res: Response) {
    try {
      const { matchId, teamId, playerId, goalTypeId, minute } = req.body;

      // Validation
      if (!matchId || isNaN(Number(matchId))) {
        return res.status(400).json({
          message: "Trận đấu là bắt buộc",
        });
      }

      if (!teamId || isNaN(Number(teamId))) {
        return res.status(400).json({
          message: "Đội bóng là bắt buộc",
        });
      }

      if (!playerId || isNaN(Number(playerId))) {
        return res.status(400).json({
          message: "Cầu thủ là bắt buộc",
        });
      }

      if (!goalTypeId || isNaN(Number(goalTypeId))) {
        return res.status(400).json({
          message: "Loại bàn thắng là bắt buộc",
        });
      }

      if (minute === undefined || minute === null || isNaN(Number(minute))) {
        return res.status(400).json({
          message: "Phút ghi bàn là bắt buộc",
        });
      }

      const minuteNum = Number(minute);
      if (minuteNum < 0 || minuteNum > 120) {
        return res.status(400).json({
          message: "Phút ghi bàn phải từ 0 đến 120",
        });
      }

      // Kiểm tra match tồn tại và teamId phải là một trong hai đội của match
      const match = await prisma.match.findUnique({
        where: { id: Number(matchId) },
      });

      if (!match) {
        return res.status(404).json({
          message: "Không tìm thấy trận đấu",
        });
      }

      const finalTeamId = Number(teamId);
      if (match.team1Id !== finalTeamId && match.team2Id !== finalTeamId) {
        return res.status(400).json({
          message: "Đội bóng phải là một trong hai đội tham gia trận đấu",
        });
      }

      // Kiểm tra player thuộc team
      const player = await prisma.player.findUnique({
        where: { id: Number(playerId) },
      });

      if (!player) {
        return res.status(404).json({
          message: "Không tìm thấy cầu thủ",
        });
      }

      if (player.teamId !== finalTeamId) {
        return res.status(400).json({
          message: "Cầu thủ phải thuộc đội bóng đã chọn",
        });
      }

      const goalData = {
        matchId: Number(matchId),
        teamId: finalTeamId,
        playerId: Number(playerId),
        goalTypeId: Number(goalTypeId),
        minute: minuteNum,
      };

      const data = await GoalService.create(goalData);
      res.status(201).json(data);
    } catch (err: any) {
      console.error("Create goal error:", err);

      // Handle Prisma errors
      if (err.code === "P2002") {
        return res.status(400).json({
          message: "Bàn thắng đã tồn tại",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message:
            "Trận đấu, đội bóng, cầu thủ hoặc loại bàn thắng không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể tạo bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Cập nhật goal
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID bàn thắng không hợp lệ",
        });
      }

      // Kiểm tra goal có tồn tại không
      const existingGoal = await GoalService.getById(id);
      if (!existingGoal) {
        return res.status(404).json({
          message: "Không tìm thấy bàn thắng",
        });
      }

      const { teamId, playerId, goalTypeId, minute } = req.body;
      const updateData: any = {};

      if (teamId !== undefined) {
        if (isNaN(Number(teamId))) {
          return res.status(400).json({
            message: "ID đội bóng không hợp lệ",
          });
        }
        updateData.teamId = Number(teamId);
      }

      if (playerId !== undefined) {
        if (isNaN(Number(playerId))) {
          return res.status(400).json({
            message: "ID cầu thủ không hợp lệ",
          });
        }
        updateData.playerId = Number(playerId);
      }

      if (goalTypeId !== undefined) {
        if (isNaN(Number(goalTypeId))) {
          return res.status(400).json({
            message: "ID loại bàn thắng không hợp lệ",
          });
        }
        updateData.goalTypeId = Number(goalTypeId);
      }

      if (minute !== undefined && minute !== null) {
        const minuteNum = Number(minute);
        if (isNaN(minuteNum)) {
          return res.status(400).json({
            message: "Phút ghi bàn không hợp lệ",
          });
        }
        if (minuteNum < 0 || minuteNum > 120) {
          return res.status(400).json({
            message: "Phút ghi bàn phải từ 0 đến 120",
          });
        }
        updateData.minute = minuteNum;
      }

      const updated = await GoalService.update(id, updateData);
      res.json(updated);
    } catch (err: any) {
      console.error("Update goal error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy bàn thắng",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "Đội bóng, cầu thủ hoặc loại bàn thắng không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể cập nhật bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xóa goal
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID bàn thắng không hợp lệ",
        });
      }

      // Kiểm tra goal có tồn tại không
      const goal = await GoalService.getById(id);
      if (!goal) {
        return res.status(404).json({
          message: "Không tìm thấy bàn thắng",
        });
      }

      await GoalService.delete(id);
      res.json({ message: "Đã xóa bàn thắng thành công" });
    } catch (err: any) {
      console.error("Delete goal error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy bàn thắng",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể xóa bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy tất cả goal types
  async getGoalTypes(req: Request, res: Response) {
    try {
      const data = await GoalService.getGoalTypes();
      res.json(data);
    } catch (err: any) {
      console.error("Get goal types error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách loại bàn thắng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new GoalController();
