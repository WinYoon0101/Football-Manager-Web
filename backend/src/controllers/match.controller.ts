// src/controllers/match.controller.ts

import { Request, Response } from "express";
import MatchService from "../services/match.service";
import SeasonService from "../services/season.service";

class MatchController {
  // Lấy tất cả matches
  async getAll(req: Request, res: Response) {
    try {
      const data = await MatchService.getAll();
      res.json(data);
    } catch (err: any) {
      console.error("Get all matches error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy match theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID trận đấu không hợp lệ",
        });
      }

      const data = await MatchService.getById(id);

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy trận đấu" });
      }

      res.json(data);
    } catch (err: any) {
      console.error("Get match by id error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Tạo match mới
  async create(req: Request, res: Response) {
    try {
      const { roundId, team1Id, team2Id, matchTime, stadium } = req.body;

      // Validation
      if (!roundId || isNaN(Number(roundId))) {
        return res.status(400).json({
          message: "Vòng đấu là bắt buộc",
        });
      }

      if (!team1Id || isNaN(Number(team1Id))) {
        return res.status(400).json({
          message: "Đội 1 là bắt buộc",
        });
      }

      if (!team2Id || isNaN(Number(team2Id))) {
        return res.status(400).json({
          message: "Đội 2 là bắt buộc",
        });
      }

      if (Number(team1Id) === Number(team2Id)) {
        return res.status(400).json({
          message: "Đội 1 và Đội 2 không thể giống nhau",
        });
      }

      if (!matchTime) {
        return res.status(400).json({
          message: "Thời gian trận đấu là bắt buộc",
        });
      }

      // Validate date format
      const parsedDate = new Date(matchTime);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Thời gian trận đấu không hợp lệ",
        });
      }

      const matchData = {
        roundId: Number(roundId),
        team1Id: Number(team1Id),
        team2Id: Number(team2Id),
        matchTime: parsedDate,
        stadium: stadium ? stadium.trim() : null,
      };

      const data = await MatchService.create(matchData);
      res.status(201).json(data);
    } catch (err: any) {
      console.error("Create match error:", err);

      // Handle Prisma errors
      if (err.code === "P2002") {
        return res.status(400).json({
          message: "Trận đấu đã tồn tại",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "Vòng đấu hoặc đội bóng không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể tạo trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Cập nhật match
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID trận đấu không hợp lệ",
        });
      }

      // Kiểm tra match có tồn tại không
      const existingMatch = await MatchService.getById(id);
      if (!existingMatch) {
        return res.status(404).json({
          message: "Không tìm thấy trận đấu",
        });
      }

      const { roundId, team1Id, team2Id, matchTime, stadium } = req.body;
      const updateData: any = {};

      if (roundId !== undefined) {
        if (isNaN(Number(roundId))) {
          return res.status(400).json({
            message: "ID vòng đấu không hợp lệ",
          });
        }
        updateData.roundId = Number(roundId);
      }

      if (team1Id !== undefined) {
        if (isNaN(Number(team1Id))) {
          return res.status(400).json({
            message: "ID đội 1 không hợp lệ",
          });
        }
        updateData.team1Id = Number(team1Id);
      }

      if (team2Id !== undefined) {
        if (isNaN(Number(team2Id))) {
          return res.status(400).json({
            message: "ID đội 2 không hợp lệ",
          });
        }
        updateData.team2Id = Number(team2Id);
      }

      // Kiểm tra đội 1 và đội 2 không giống nhau
      const finalTeam1Id = updateData.team1Id || existingMatch.team1Id;
      const finalTeam2Id = updateData.team2Id || existingMatch.team2Id;

      if (finalTeam1Id === finalTeam2Id) {
        return res.status(400).json({
          message: "Đội 1 và Đội 2 không thể giống nhau",
        });
      }

      if (matchTime !== undefined) {
        const parsedDate = new Date(matchTime);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            message: "Thời gian trận đấu không hợp lệ",
          });
        }
        updateData.matchTime = parsedDate;
      }

      if (stadium !== undefined) {
        updateData.stadium = stadium ? stadium.trim() : null;
      }

      const updated = await MatchService.update(id, updateData);
      res.json(updated);
    } catch (err: any) {
      console.error("Update match error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy trận đấu",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "Vòng đấu hoặc đội bóng không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể cập nhật trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xóa match
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID trận đấu không hợp lệ",
        });
      }

      // Kiểm tra match có tồn tại không
      const match = await MatchService.getById(id);
      if (!match) {
        return res.status(404).json({
          message: "Không tìm thấy trận đấu",
        });
      }

      await MatchService.delete(id);
      res.json({ message: "Đã xóa trận đấu thành công" });
    } catch (err: any) {
      console.error("Delete match error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy trận đấu",
        });
      }

      // Check if match has related records (foreign key constraint)
      if (err.code === "P2003") {
        return res.status(400).json({
          message:
            "Không thể xóa trận đấu vì đang có dữ liệu liên quan (bàn thắng, ...)",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể xóa trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy tất cả rounds
  async getRounds(req: Request, res: Response) {
    try {
      const data = await MatchService.getRounds();
      res.json(data);
    } catch (err: any) {
      console.error("Get rounds error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách vòng đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // ===== RESULT ENDPOINTS =====

  // Lấy kết quả tất cả trận đấu
  async getAllResults(req: Request, res: Response) {
    try {
      const seasonName = req.query.season
        ? String(req.query.season)
        : undefined;

      let seasonId: number | undefined;
      const seasonIdParam = req.query.seasonId;
      if (seasonIdParam !== undefined) {
        const seasonIdValue = Array.isArray(seasonIdParam)
          ? seasonIdParam[0]
          : seasonIdParam;
        const parsedSeasonId = Number(seasonIdValue);

        if (isNaN(parsedSeasonId) || parsedSeasonId <= 0) {
          return res
            .status(400)
            .json({ message: "ID mùa giải không hợp lệ" });
        }

        const season = await SeasonService.getById(parsedSeasonId);
        if (!season) {
          return res.status(404).json({ message: "Không tìm thấy mùa giải" });
        }

        seasonId = parsedSeasonId;
      }

      const data = await MatchService.getAllResults({
        seasonName,
        seasonId,
      });
      res.json(data);
    } catch (err: any) {
      console.error("Get all results error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách kết quả trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy kết quả trận đấu theo id
  async getResultById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID trận đấu không hợp lệ",
        });
      }

      const data = await MatchService.getResultById(id);

      if (!data) {
        return res.status(404).json({
          message: "Không tìm thấy kết quả trận đấu",
        });
      }

      res.json(data);
    } catch (err: any) {
      console.error("Get result by id error:", err);
      res.status(500).json({
        message: "Không thể lấy kết quả trận đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy kết quả theo vòng đấu
  async getResultsByRound(req: Request, res: Response) {
    try {
      const roundId = Number(req.params.roundId);

      if (isNaN(roundId) || roundId <= 0) {
        return res.status(400).json({
          message: "ID vòng đấu không hợp lệ",
        });
      }

      const data = await MatchService.getResultsByRound(roundId);
      res.json(data);
    } catch (err: any) {
      console.error("Get results by round error:", err);
      res.status(500).json({
        message: "Không thể lấy kết quả theo vòng đấu",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy kết quả theo đội
  async getResultsByTeam(req: Request, res: Response) {
    try {
      const teamId = Number(req.params.teamId);

      if (isNaN(teamId) || teamId <= 0) {
        return res.status(400).json({
          message: "ID đội bóng không hợp lệ",
        });
      }

      const data = await MatchService.getResultsByTeam(teamId);
      res.json(data);
    } catch (err: any) {
      console.error("Get results by team error:", err);
      res.status(500).json({
        message: "Không thể lấy kết quả theo đội bóng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy bảng xếp hạng
  async getStandings(req: Request, res: Response) {
    try {
      const seasonName = req.query.season
        ? String(req.query.season)
        : undefined;

      let seasonId: number | undefined;
      const seasonIdParam = req.query.seasonId;
      if (seasonIdParam !== undefined) {
        const seasonIdValue = Array.isArray(seasonIdParam)
          ? seasonIdParam[0]
          : seasonIdParam;
        const parsedSeasonId = Number(seasonIdValue);

        if (isNaN(parsedSeasonId) || parsedSeasonId <= 0) {
          return res
            .status(400)
            .json({ message: "ID mùa giải không hợp lệ" });
        }

        const season = await SeasonService.getById(parsedSeasonId);
        if (!season) {
          return res.status(404).json({ message: "Không tìm thấy mùa giải" });
        }

        seasonId = parsedSeasonId;
      }

      const data = await MatchService.getStandings({
        seasonName,
        seasonId,
      });
      res.json(data);
    } catch (err: any) {
      console.error("Get standings error:", err);
      res.status(500).json({
        message: "Không thể lấy bảng xếp hạng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new MatchController();
