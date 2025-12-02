import { Request, Response } from "express";
import ParameterService from "../services/parameter.service";

class ParameterController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await ParameterService.getAll();
      res.json(data);
    } catch (err: any) {
      console.error("Get all parameters error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách tham số",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = await ParameterService.getById(id);
      res.json(data);
    } catch (err: any) {
      console.error("Get parameter by id error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin tham số",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await ParameterService.update(id, data);
      res.json(updated);
    } catch (err: any) {
      console.error("Update parameter error:", err);
      res.status(500).json({
        message: "Không thể cập nhật tham số",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}

export default new ParameterController();
