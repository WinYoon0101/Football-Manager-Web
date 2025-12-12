"use client";

import { useEffect, useState } from "react";
import { User, userApi } from "@/lib/api/user";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserDialog } from "@/components/user/UserDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 

function getRoleStatus(role: string) {
  if (role === "admin") return "Admin";
  else if (role === "manager") return "Quản lí đội";
  else if (role === "player") return "Cầu thủ";
  return "Khác";
}

export default function UsersModule() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Filters
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Delete dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== Fetch API =====
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userApi.getAll();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDeleteUser = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      setIsSubmitting(true);
      await userApi.delete(userToDelete.id);
      console.log("Deleted", userToDelete.id);
      await loadUsers();
      setShowDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function handle open create form
  const handleOpenCreate = () => {
    setSelectedUser(null); // Reset về null
    setIsDialogOpen(true);
  };

  // Function handle edit form
  const handleOpenEdit = (e: React.MouseEvent, user: User) => {
    e.stopPropagation(); 
    setSelectedUser(user); 
    setIsDialogOpen(true);
  };

  // Filter Logic
  const filtered = users.filter((s) => {
    const role = getRoleStatus(String(s.role));
    return (
      s.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterStatus === "" || filterStatus === "all" || filterStatus === role)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Danh Sách Người Dùng
          </h1>
          <p className="text-white/70">Quản lý người dùng trong hệ thống</p>
        </div>

        <Button 
          onClick={handleOpenCreate} 
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>

        <UserDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          userToEdit={selectedUser} 
          onSuccess={loadUsers} 
        />
      </div>

      <div className="flex gap-4 items-center mb-8">
        <Input
          placeholder="Tên người dùng"
          className="w-64 shadow-sm bg-white/10 border-white/20 text-white placeholder:text-white/60"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 shadow-sm bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Cầu thủ">Cầu thủ</SelectItem>
            <SelectItem value="Quản lí đội">Quản lí đội</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md rounded-xl overflow-hidden">
        <CardHeader className="grid grid-cols-[1.5fr,1fr,1.5fr,1.5fr,0.5fr] px-6 py-4 font-semibold text-sm bg-white/10 border-b border-white/20">
          <div className="text-white">Tên Người Dùng</div>
          <div className="text-white">Vai Trò</div>
          <div className="text-white">Email</div>
          <div className="text-white">Đội Bóng</div>        
          <div className="text-white text-right">Thao tác</div> 
        </CardHeader>

        <CardContent className="px-0">
          {loading && <p className="p-4 text-white/60">Đang tải...</p>}
          {!loading && filtered.map((item) => {
              const status = getRoleStatus(String(item.role));
              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[1.5fr,1fr,1.5fr,1.5fr,0.5fr] px-6 py-4 items-center text-sm 
                   hover:bg-white/10 transition-colors border-b border-white/20 last:border-0 cursor-pointer group"
                  onClick={() => router.push(`/season/${item.id}`)}
                >
                  <div className="text-blue-300 font-medium group-hover:text-blue-200 group-hover:underline">
                    {item.name}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border
                      ${status === "Cầu thủ" ? "bg-blue-500/20 text-blue-300 border-blue-500/50" : 
                        status === "Quản lí đội" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" : 
                        "bg-red-500/20 text-red-300 border-red-500/50"}`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-white/80 truncate pr-2">{item.email}</div>
                  <div className="text-white/80 font-medium">{item.team?.name || <span className="text-white/40 italic">Chưa có đội</span>}</div>
                  
                  <div className="text-right flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-white/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(e) => handleOpenEdit(e, item)}>
                                  <Edit className="mr-2 h-4 w-4" /> Sửa thông tin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600 focus:bg-red-100"
                          onClick={(e) => handleDeleteUser(e, item)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Xóa người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>   
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa người dùng?</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa người dùng <strong>{userToDelete?.name}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>

            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}