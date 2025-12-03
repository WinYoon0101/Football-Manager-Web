// src/controllers/player.controller.ts

import { Request, Response } from "express";
import PlayerService from "../services/player.service";
import CloudinaryService from "../services/cloudinary.service";

class PlayerController {
  // Lấy tất cả players
  async getAll(req: Request, res: Response) {
    try {
      const data = await PlayerService.getAll();
      res.json(data);
    } catch (err: any) {
      console.error("Get all players error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy player theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID cầu thủ không hợp lệ",
        });
      }

      const data = await PlayerService.getById(id);

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy cầu thủ" });
      }

      res.json(data);
    } catch (err: any) {
      console.error("Get player by id error:", err);
      res.status(500).json({
        message: "Không thể lấy thông tin cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Tạo player mới
  async create(req: Request, res: Response) {
    try {
      const { name, birthDate, teamId, playerTypeId, notes } = req.body;

      // Validation
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          message: "Tên cầu thủ là bắt buộc",
        });
      }

      if (name.trim().length > 100) {
        return res.status(400).json({
          message: "Tên cầu thủ không được vượt quá 100 ký tự",
        });
      }

      if (!teamId || isNaN(Number(teamId))) {
        return res.status(400).json({
          message: "Đội bóng là bắt buộc",
        });
      }

      if (!playerTypeId || isNaN(Number(playerTypeId))) {
        return res.status(400).json({
          message: "Loại cầu thủ là bắt buộc",
        });
      }

      // Xử lý file upload lên Cloudinary nếu có
      let imageUrl: string | undefined;
      const file = (req as any).file;

      if (file) {
        try {
          imageUrl = await CloudinaryService.uploadImage(file.buffer, "players");
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(500).json({
            message: "Không thể upload ảnh lên Cloudinary. Vui lòng thử lại.",
          });
        }
      }

      const playerData: any = {
        name: name.trim(),
        teamId: Number(teamId),
        playerTypeId: Number(playerTypeId),
        birthDate: birthDate ? new Date(birthDate) : null,
        notes: notes ? notes.trim() : null,
      };

      if (imageUrl) {
        playerData.image = imageUrl;
      }

      const data = await PlayerService.create(playerData);
      res.status(201).json(data);
    } catch (err: any) {
      console.error("Create player error:", err);

      // Handle Prisma errors
      if (err.code === "P2002") {
        return res.status(400).json({
          message: "Cầu thủ đã tồn tại",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "Đội bóng hoặc loại cầu thủ không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể tạo cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Cập nhật player
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID cầu thủ không hợp lệ",
        });
      }

      // Kiểm tra player có tồn tại không
      const existingPlayer = await PlayerService.getById(id);
      if (!existingPlayer) {
        return res.status(404).json({
          message: "Không tìm thấy cầu thủ",
        });
      }

      const { name, birthDate, teamId, playerTypeId, notes } = req.body;
      const updateData: any = {};

      if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length === 0) {
          return res.status(400).json({
            message: "Tên cầu thủ không hợp lệ",
          });
        }
        if (name.trim().length > 100) {
          return res.status(400).json({
            message: "Tên cầu thủ không được vượt quá 100 ký tự",
          });
        }
        updateData.name = name.trim();
      }

      if (birthDate !== undefined) {
        updateData.birthDate = birthDate ? new Date(birthDate) : null;
      }

      if (teamId !== undefined) {
        if (isNaN(Number(teamId))) {
          return res.status(400).json({
            message: "ID đội bóng không hợp lệ",
          });
        }
        updateData.teamId = Number(teamId);
      }

      if (playerTypeId !== undefined) {
        if (isNaN(Number(playerTypeId))) {
          return res.status(400).json({
            message: "ID loại cầu thủ không hợp lệ",
          });
        }
        updateData.playerTypeId = Number(playerTypeId);
      }

      if (notes !== undefined) {
        updateData.notes = notes ? notes.trim() : null;
      }

      // Xử lý file upload lên Cloudinary nếu có
      const file = (req as any).file;
      if (file) {
        try {
          // Lấy player hiện tại để xóa ảnh cũ nếu có
          if (existingPlayer.image) {
            await CloudinaryService.deleteImage(existingPlayer.image);
          }

          // Upload ảnh mới
          const imageUrl = await CloudinaryService.uploadImage(
            file.buffer,
            "players"
          );
          updateData.image = imageUrl;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(500).json({
            message: "Không thể upload ảnh lên Cloudinary. Vui lòng thử lại.",
          });
        }
      }

      const updated = await PlayerService.update(id, updateData);
      res.json(updated);
    } catch (err: any) {
      console.error("Update player error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy cầu thủ",
        });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message: "Đội bóng hoặc loại cầu thủ không tồn tại",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể cập nhật cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Xóa player
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          message: "ID cầu thủ không hợp lệ",
        });
      }

      // Kiểm tra player có tồn tại không
      const player = await PlayerService.getById(id);
      if (!player) {
        return res.status(404).json({
          message: "Không tìm thấy cầu thủ",
        });
      }

      // Xóa ảnh trên Cloudinary nếu có
      if (player.image) {
        try {
          await CloudinaryService.deleteImage(player.image);
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
          // Tiếp tục xóa player dù có lỗi xóa ảnh
        }
      }

      await PlayerService.delete(id);
      res.json({ message: "Đã xóa cầu thủ thành công" });
    } catch (err: any) {
      console.error("Delete player error:", err);

      // Handle Prisma errors
      if (err.code === "P2025") {
        return res.status(404).json({
          message: "Không tìm thấy cầu thủ",
        });
      }

      // Check if player has related records (foreign key constraint)
      if (err.code === "P2003") {
        return res.status(400).json({
          message:
            "Không thể xóa cầu thủ vì đang có dữ liệu liên quan (bàn thắng, ...)",
        });
      }

      res.status(500).json({
        message: err.message || "Không thể xóa cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

  // Lấy tất cả player types
  async getPlayerTypes(req: Request, res: Response) {
    try {
      const data = await PlayerService.getPlayerTypes();
      res.json(data);
    } catch (err: any) {
      console.error("Get player types error:", err);
      res.status(500).json({
        message: "Không thể lấy danh sách loại cầu thủ",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }

// Lấy tất cả players theo teamId
  async getByTeam(req: Request, res: Response) {
  try {
    const teamId = Number(req.params.teamId);

    if (isNaN(teamId) || teamId <= 0) {
      return res.status(400).json({ message: "Team ID không hợp lệ" });
    }

    const data = await PlayerService.getByTeam(teamId);

    res.json(data);
  } catch (err: any) {
    console.error("Get players by team error:", err);
    res.status(500).json({
      message: "Không thể lấy danh sách cầu thủ theo đội",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
}
}

export default new PlayerController();


