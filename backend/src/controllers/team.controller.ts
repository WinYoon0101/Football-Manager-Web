// src/controllers/team.controller.ts

import { Request, Response } from "express";
import TeamService from "../services/team.service";
import CloudinaryService from "../services/cloudinary.service";

class TeamController {
  // Lấy tất cả team
  async getAll(req: Request, res: Response) {
    try {
      const data = await TeamService.getAll();
      res.json(data);
    } catch (err: any) {
      console.error('Get all teams error:', err);
      res.status(500).json({ 
        message: "Không thể lấy danh sách đội bóng",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }

  // Lấy team theo id
  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ 
          message: "ID đội bóng không hợp lệ" 
        });
      }

      const data = await TeamService.getById(id);

      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy đội bóng" });
      }

      res.json(data);
    } catch (err: any) {
      console.error('Get team by id error:', err);
      res.status(500).json({ 
        message: "Không thể lấy thông tin đội bóng",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }

  // Tạo team mới
  async create(req: Request, res: Response) {
    try {
      const { name, homeStadium } = req.body;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ 
          message: "Tên đội bóng là bắt buộc" 
        });
      }

      if (name.trim().length > 100) {
        return res.status(400).json({ 
          message: "Tên đội bóng không được vượt quá 100 ký tự" 
        });
      }

      // Xử lý file upload lên Cloudinary nếu có
      let imageUrl: string | undefined;
      const file = (req as any).file;

      if (file) {
        try {
          imageUrl = await CloudinaryService.uploadImage(file.buffer, 'teams');
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ 
            message: "Không thể upload ảnh lên Cloudinary. Vui lòng thử lại." 
          });
        }
      }

      const teamData: any = {
        name: name.trim(),
        homeStadium: homeStadium ? homeStadium.trim() : null,
      };

      if (imageUrl) {
        teamData.image = imageUrl;
      }

      const data = await TeamService.create(teamData);
      res.status(201).json(data);

    } catch (err: any) {
      console.error('Create team error:', err);
      
      // Handle Prisma errors
      if (err.code === 'P2002') {
        return res.status(400).json({ 
          message: "Tên đội bóng đã tồn tại" 
        });
      }

      res.status(500).json({ 
        message: err.message || "Không thể tạo đội bóng",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }

  // Cập nhật team
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ 
          message: "ID đội bóng không hợp lệ" 
        });
      }

      // Kiểm tra team có tồn tại không
      const existingTeam = await TeamService.getById(id);
      if (!existingTeam) {
        return res.status(404).json({ 
          message: "Không tìm thấy đội bóng" 
        });
      }

      const { name, homeStadium } = req.body;
      const updateData: any = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          return res.status(400).json({ 
            message: "Tên đội bóng không hợp lệ" 
          });
        }
        if (name.trim().length > 100) {
          return res.status(400).json({ 
            message: "Tên đội bóng không được vượt quá 100 ký tự" 
          });
        }
        updateData.name = name.trim();
      }

      if (homeStadium !== undefined) {
        updateData.homeStadium = homeStadium ? homeStadium.trim() : null;
      }

      // Xử lý file upload lên Cloudinary nếu có
      const file = (req as any).file;
      if (file) {
        try {
          // Lấy team hiện tại để xóa ảnh cũ nếu có
          if (existingTeam.image) {
            await CloudinaryService.deleteImage(existingTeam.image);
          }

          // Upload ảnh mới
          const imageUrl = await CloudinaryService.uploadImage(file.buffer, 'teams');
          updateData.image = imageUrl;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ 
            message: "Không thể upload ảnh lên Cloudinary. Vui lòng thử lại." 
          });
        }
      }

      const updated = await TeamService.update(id, updateData);
      res.json(updated);

    } catch (err: any) {
      console.error('Update team error:', err);
      
      // Handle Prisma errors
      if (err.code === 'P2025') {
        return res.status(404).json({ 
          message: "Không tìm thấy đội bóng" 
        });
      }
      
      if (err.code === 'P2002') {
        return res.status(400).json({ 
          message: "Tên đội bóng đã tồn tại" 
        });
      }

      res.status(500).json({ 
        message: err.message || "Không thể cập nhật đội bóng",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }

  // Xóa team
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ 
          message: "ID đội bóng không hợp lệ" 
        });
      }

      // Kiểm tra team có tồn tại không
      const team = await TeamService.getById(id);
      if (!team) {
        return res.status(404).json({ 
          message: "Không tìm thấy đội bóng" 
        });
      }

      // Xóa ảnh trên Cloudinary nếu có
      if (team.image) {
        try {
          await CloudinaryService.deleteImage(team.image);
        } catch (deleteError) {
          console.error('Error deleting image from Cloudinary:', deleteError);
          // Tiếp tục xóa team dù có lỗi xóa ảnh
        }
      }

      await TeamService.delete(id);
      res.json({ message: "Đã xóa đội bóng thành công" });

    } catch (err: any) {
      console.error('Delete team error:', err);
      
      // Handle Prisma errors
      if (err.code === 'P2025') {
        return res.status(404).json({ 
          message: "Không tìm thấy đội bóng" 
        });
      }

      // Check if team has related records (foreign key constraint)
      if (err.code === 'P2003') {
        return res.status(400).json({ 
          message: "Không thể xóa đội bóng vì đang có dữ liệu liên quan (cầu thủ, trận đấu, ...)" 
        });
      }

      res.status(500).json({ 
        message: err.message || "Không thể xóa đội bóng",
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  }
}

export default new TeamController();
