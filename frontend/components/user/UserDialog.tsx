"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/lib/api/user";
import { teamsAPI } from "@/lib/api/teams"; 
import { toast } from "react-toastify";
import { User as UserType } from "@/lib/api/user";
import { Team } from "@/lib/types"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
// Thêm icon Shirt cho đội bóng
import { Loader2, User, Mail, Lock, Trophy, X, Shirt, UserCog } from "lucide-react"; 

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit: UserType | null;
  onSuccess: () => void;
}

export function UserDialog({ open, onOpenChange, userToEdit, onSuccess }: UserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State lưu danh sách đội bóng lấy từ API
  const [teams, setTeams] = useState<Team[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "player",
    teamId: "", 
  });

  const isEditMode = !!userToEdit;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await teamsAPI.getAll(); // Gọi API lấy list team
        setTeams(res);
      } catch (error) {
        console.error("Lỗi tải danh sách đội bóng:", error);
      }
    };
    
    if (open) {
      fetchTeams();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        setFormData({
          name: userToEdit.name || "",
          email: userToEdit.email || "",
          password: "",
          role: userToEdit.role || "player",
          teamId: userToEdit.teamId ? String(userToEdit.teamId) : "",
        });
      } else {
        setFormData({ name: "", email: "", password: "", role: "player", teamId: "" });
      }
    }
  }, [open, userToEdit]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.warning("Tên và Email là bắt buộc!");
      return;
    }

    // Nếu là manager thì bắt buộc chọn đội
    if (formData.role === "manager" && !formData.teamId) {
       toast.warning("Vui lòng chọn Đội bóng cho Quản lý!");
       return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = { 
        ...formData,
        teamId: formData.teamId ? Number(formData.teamId) : undefined 
      };
      
      // Nếu role không phải manager, ta set teamId = null 
      if (payload.role !== "manager") {
         // @ts-ignore
         payload.teamId = null; 
      }

      if (isEditMode && userToEdit) {
        if (!payload.password) {
            // @ts-ignore
            delete payload.password;
        }
        await userApi.update({id: userToEdit.id, ...payload});
        toast.success("Cập nhật thành công!");
      } else {
        await userApi.create(payload);
        toast.success("Tạo tài khoản thành công!");
      }

      onSuccess(); 
      onOpenChange(false);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border border-slate-200 text-slate-900 sm:max-w-[600px] p-0 gap-0 rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
               <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
               <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                  {isEditMode ? "Cập Nhật Thông Tin" : "Thêm Mới"}
               </DialogTitle>
               <p className="text-sm text-slate-500 mt-1">
                  {isEditMode ? "Cập nhật dữ liệu người dùng" : "Tạo tài khoản người dùng mới"}
               </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-6 space-y-5 bg-white">
          <div className="grid grid-cols-2 gap-5">
             <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên hiển thị</Label>
                <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 h-11 bg-white border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors"
                      placeholder="Tên user"
                    />
                </div>
             </div>

             <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vai trò</Label>
                <Select
                    value={formData.role}
                    onValueChange={(val) => {
                        setFormData({ ...formData, role: val });
                    }}
                >
                    <SelectTrigger className="h-11 bg-white border-slate-300 rounded-lg text-slate-900 focus:ring-0 focus:ring-offset-0 focus:border-blue-600">
                       <div className="flex items-center gap-2">
                            <UserCog className="h-4 w-4 text-slate-400" />
                            <SelectValue placeholder="Chọn vai trò" />
                       </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-md">
                      <SelectItem value="player">Cầu thủ</SelectItem>
                      <SelectItem value="manager">Quản lý đội</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>

          {formData.role === "manager" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Quản lý đội bóng</Label>
                <Select
                    value={formData.teamId ? String(formData.teamId) : ""}
                    onValueChange={(val) => setFormData({ ...formData, teamId: val })}
                >
                    <SelectTrigger className="h-11 bg-blue-50 border-blue-200 rounded-lg text-slate-900 focus:ring-0 focus:ring-offset-0 focus:border-blue-600">
                       <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-blue-500" />
                            <SelectValue placeholder="Chọn đội bóng quản lý" />
                       </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900 shadow-md max-h-[200px]">
                      {teams.length > 0 ? (
                          teams.map((team) => (
                            <SelectItem key={team.id} value={String(team.id)} className="cursor-pointer hover:bg-slate-50">
                                {team.name}
                            </SelectItem>
                          ))
                      ) : (
                          <div className="p-2 text-sm text-slate-500 text-center">Chưa có đội bóng nào</div>
                      )}
                    </SelectContent>
                </Select>
             </div>
          )}

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</Label>
            <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 h-11 bg-white border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors"
                  placeholder="user@example.com"
                />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</Label>
            <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-11 bg-white border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors"
                  placeholder={isEditMode ? "•••••••• (Vui lòng để trống nếu không thay đổi)" : "••••••••"}
                />
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 flex items-center gap-4 bg-slate-50 border-t border-slate-100">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (isEditMode ? "Lưu Thay Đổi" : "Tạo Tài Khoản")}
          </Button>
            
        </div>

      </DialogContent>
    </Dialog>
  );
}