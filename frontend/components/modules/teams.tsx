"use client";

import React, { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, UploadCloud, ArrowLeft, MoreVertical } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Team } from "@/lib/types";

import { toast } from "react-toastify";

interface TeamsModuleProps {
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

export default function TeamsModule({ teams, setTeams }: TeamsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // ADD TEAM dialog
  const [showAddDialog, setShowAddDialog] = useState(false);

  // EDIT TEAM dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editLogo, setEditLogo] = useState<File | null>(null);

  // DELETE CONFIRM dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);

  const [newTeam, setNewTeam] = useState({
    name: "",
    city: "",
    logo: null as File | null,
  });

  const handleFileChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewTeam({ ...newTeam, logo: e.target.files[0] });
    }
  };

  const handleFileChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setEditLogo(e.target.files[0]);
    }
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----------------------
  // DELETE team (with popup)
  // ----------------------
  const confirmDelete = () => {
    if (!deleteTeamId) return;

    setTeams(teams.filter((t) => t.id !== deleteTeamId));
    toast.success("Đã xóa đội bóng!");

    setShowDeleteDialog(false);
    setDeleteTeamId(null);
  };

  // ----------------------
  // VIEW DETAIL
  // ----------------------
  const handleViewDetail = (team: Team) => {
    setSelectedTeam(team);
    setShowDetail(true);
  };

  // ----------------------
  // ADD NEW TEAM
  // ----------------------
  const handleAddTeam = () => {
    if (!newTeam.name || !newTeam.city) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const team = {
      id: `team-${Date.now()}`,
      name: newTeam.name,
      city: newTeam.city,
      players: [],
      ...(newTeam.logo ? { logo: URL.createObjectURL(newTeam.logo) } : {}),
    } as Team;

    setTeams([...teams, team]);

    toast.success("Thêm đội bóng thành công!");

    setNewTeam({ name: "", city: "", logo: null });
    setShowAddDialog(false);
  };

  // ----------------------
  // OPEN EDIT
  // ----------------------
  const openEditDialog = (team: Team) => {
    setEditTeam(team);
    setEditLogo(null);
    setShowEditDialog(true);
  };

  // ----------------------
  // SAVE EDIT TEAM
  // ----------------------
  const handleSaveEdit = () => {
    if (!editTeam) return;

    const updated = teams.map((t) =>
      t.id === editTeam.id
        ? ({
            ...editTeam,
            ...(editLogo ? { logo: URL.createObjectURL(editLogo) } : { logo: editTeam.logo }),
          } as Team)
        : t
    );

    setTeams(updated);
    toast.success("Cập nhật đội bóng thành công!");

    setShowEditDialog(false);
    setEditLogo(null);
  };

  // ======================
  //      DETAIL VIEW
  // ======================
  if (showDetail && selectedTeam) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{selectedTeam.name}</h3>
            <p className="text-muted-foreground">{selectedTeam.city}</p>
          </div>

          <Button variant="outline" onClick={() => setShowDetail(false)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay Lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Đội</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Tên đội:</span>
                <p className="font-semibold">{selectedTeam.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Sân nhà:</span>
                <p className="font-semibold">{selectedTeam.city}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Số cầu thủ:</span>
                <p className="font-semibold">{selectedTeam.players.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Danh Sách Cầu Thủ</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTeam.players.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Chưa có cầu thủ nào</p>
              ) : (
                <div className="space-y-2">
                  {selectedTeam.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                          {player.jerseyNumber}
                        </div>
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.age} tuổi • {player.type === "domestic" ? "Nội" : "Ngoại"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ======================
  //      LIST VIEW
  // ======================
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh Sách Đội Bóng</CardTitle>
              <CardDescription>Quản lý các đội tham gia giải vô địch</CardDescription>
            </div>

            {/* ADD TEAM */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm Đội Bóng
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm Đội Bóng Mới</DialogTitle>
                  <DialogDescription>Nhập thông tin đội bóng</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* UPLOAD LOGO */}
                  <div>
                    <Label>Ảnh Đại Diện</Label>
                    <label className="w-32 h-32 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition">
                      <UploadCloud className="h-6 w-6 mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Ảnh Đại Diện</span>

                      <input type="file" accept="image/*" onChange={handleFileChangeAdd} className="hidden" />
                    </label>

                    {newTeam.logo && <p className="text-xs text-green-600 mt-1">{newTeam.logo.name}</p>}
                  </div>

                  <div>
                    <Label>Tên Đội Bóng *</Label>
                    <Input
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="Nhập tên đội bóng"
                    />
                  </div>

                  <div>
                    <Label>Sân nhà *</Label>
                    <Input
                      value={newTeam.city}
                      onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })}
                      placeholder="Nhập sân nhà"
                    />
                  </div>

                  <Button onClick={handleAddTeam} className="w-full">
                    Thêm Đội Bóng
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đội bóng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Logo</th>
                  <th className="text-left p-4 font-semibold">Tên Đội</th>
                  <th className="text-left p-4 font-semibold">Sân Nhà</th>
                  <th className="text-left p-4 font-semibold">Số Cầu Thủ</th>
                  <th className="text-right p-4 font-semibold">Thao Tác</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetail(team)}
                  >
                    {/* LOGO */}
                    <td className="p-4">
                      {team.logo ? (
                        <img src={team.logo} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                          ?
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-medium">{team.name}</td>
                    <td className="p-4 text-muted-foreground">{team.city}</td>
                    <td className="p-4 text-muted-foreground">{team.players.length}</td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info("Chức năng đăng ký thi đấu chưa được triển khai.");
                            }}
                          >
                            🏆 Đăng ký thi đấu
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(team);
                            }}
                          >
                            ✏️ Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTeamId(team.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            🗑️ Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* EDIT TEAM POPUP */}
      {/* ===================== */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đội bóng</DialogTitle>
            <DialogDescription>Cập nhật thông tin đội bóng</DialogDescription>
          </DialogHeader>

          {editTeam && (
            <div className="space-y-4 py-4">
              {/* Upload */}
              <div>
                <Label>Logo</Label>
                <label className="w-32 h-32 border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-accent transition">
                  <UploadCloud className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Chọn ảnh</span>

                  <input type="file" accept="image/*" onChange={handleFileChangeEdit} className="hidden" />
                </label>

                {editLogo && <p className="text-xs text-green-600 mt-1">{editLogo.name}</p>}
              </div>

              <div>
                <Label>Tên đội *</Label>
                <Input
                  value={editTeam.name}
                  onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Sân nhà *</Label>
                <Input
                  value={editTeam.city}
                  onChange={(e) => setEditTeam({ ...editTeam, city: e.target.value })}
                />
              </div>

              <Button className="w-full" onClick={handleSaveEdit}>
                Lưu thay đổi
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===================== */}
      {/* DELETE CONFIRM POPUP */}
      {/* ===================== */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa đội bóng?</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
