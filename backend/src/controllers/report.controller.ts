import { Request, Response } from "express";
import ReportService from "../services/report.service";
import SeasonService from "../services/season.service";

class ReportController {
  // Lấy thống kê đội bóng
  getTeamStats = async (req: Request, res: Response) => {
    try {
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

      const data = await ReportService.getTeamStats(seasonId);
      res.json(data);
    } catch (err: any) {
      console.error("Get team stats error:", err);
      res.status(500).json({
        message: "Không thể lấy thống kê đội bóng",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  };

  // Lấy thống kê cầu thủ
  getPlayerStats = async (req: Request, res: Response) => {
    try {
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

      const data = await ReportService.getPlayerStats(seasonId);
      res.json(data);
    } catch (err: any) {
      console.error("Get player stats error:", err);
      res.status(500).json({
        message: "Không thể lấy thống kê cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  };
}

export default new ReportController();

