"use client";

import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Plus,
  Search,
  UploadCloud,
  ArrowLeft,
  Trophy,
  Pencil,
  Trash2,
  Loader2,
  Ellipsis,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { Team } from "@/lib/types";
import { toast } from "react-toastify";

import { teamsAPI } from "@/lib/api/teams";

export default function TeamsModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch teams từ API khi component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await teamsAPI.getAll();
        setTeams(data);
      } catch (error) {
        toast.error("Không thể tải danh sách đội bóng");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // ADD TEAM
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    homeStadium: "",
    image: null as File | null,
  });
  const [previewAddLogo, setPreviewAddLogo] = useState<string | null>(null);

  // EDIT TEAM
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [editLogo, setEditLogo] = useState<File | null>(null);
  const [previewEditLogo, setPreviewEditLogo] = useState<string | null>(null);

  // DELETE TEAM
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<number | null>(null);

  // --------------------
  // HANDLE PREVIEW IMAGE
  // --------------------

  const handleFileChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewTeam({ ...newTeam, image: file });
    setPreviewAddLogo(URL.createObjectURL(file));
  };

  const handleFileChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditLogo(file);
    setPreviewEditLogo(URL.createObjectURL(file));
  };

  // SEARCH
  const filteredTeams = teams.filter((t) => {
    const name = t.name?.toLowerCase() ?? "";
    const stadium = t.homeStadium?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || stadium.includes(search);
  });

  // DELETE
  const confirmDelete = async () => {
    if (!deleteTeamId) return;

    try {
      setIsSubmitting(true);

      await teamsAPI.delete(deleteTeamId);

      setTeams(teams.filter((t) => t.id !== deleteTeamId));

      toast.success("Đã xóa đội bóng!");
      setShowDeleteDialog(false);
      setDeleteTeamId(null);
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa đội bóng");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DETAIL
  const handleViewDetail = (team: Team) => {
    setSelectedTeam(team);
    setShowDetail(true);
  };

  // ADD TEAM
  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.homeStadium) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", newTeam.name);
      formData.append("homeStadium", newTeam.homeStadium);
      if (newTeam.image) formData.append("image", newTeam.image);

      const createdTeam = await teamsAPI.create({
        name: newTeam.name,
        homeStadium: newTeam.homeStadium,
        logo: newTeam.image ?? undefined,
      });
      setTeams([...teams, createdTeam]);

      toast.success("Thêm đội bóng thành công!");

      setNewTeam({ name: "", homeStadium: "", image: null });
      setPreviewAddLogo(null);
      setShowAddDialog(false);
    } catch (error: any) {
      toast.error(error.message || "Không thể thêm đội bóng");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT TEAM
  const openEditDialog = (team: Team) => {
    setEditTeam(team);
    setPreviewEditLogo(null);
    setEditLogo(null);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editTeam) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", editTeam.name);
      formData.append("homeStadium", editTeam.homeStadium ?? "");
      if (editLogo) formData.append("image", editLogo);

      const updatedTeam = await teamsAPI.update(editTeam.id, {
        name: editTeam.name,
        homeStadium: editTeam.homeStadium ?? "",
        logo: editLogo ?? undefined,
      });

      setTeams(teams.map((t) => (t.id === editTeam.id ? updatedTeam : t)));

      toast.success("Cập nhật thành công!");
      setShowEditDialog(false);

      setPreviewEditLogo(null);
      setEditLogo(null);
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật đội bóng");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------
  // DETAIL PAGE
  // ---------------------------------------
  if (showDetail && selectedTeam) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">{selectedTeam.name}</h3>
            <p className="text-muted-foreground">{selectedTeam.homeStadium}</p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowDetail(false)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay Lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card thông tin đội */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Đội</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Logo đội bóng */}
              <div className="flex items-center justify-center">
                {selectedTeam.image ? (
                  <img
                    src={selectedTeam.image}
                    className="w-26 h-26 rounded-lg object-cover shadow-sm border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg border flex items-center justify-center text-muted-foreground">
                    Không có logo
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Tên đội:</span>
                <p className="font-semibold">{selectedTeam.name}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Sân nhà:</span>
                <p className="font-semibold">{selectedTeam.homeStadium}</p>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">
                  Số cầu thủ:
                </span>
                <p className="font-semibold">
                  {selectedTeam.players?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card danh sách cầu thủ */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Danh sách cầu thủ</CardTitle>
            </CardHeader>

            <CardContent>
              {(selectedTeam.players?.length ?? 0) === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Chưa có cầu thủ nào
                </p>
              ) : (
                <div className="space-y-2">
                  {(selectedTeam.players ?? []).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar player nếu sau này muốn thêm */}
                        {/* <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" /> */}

                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.playerTypeId === 1 ? "Trong nước" : "Nước ngoài"}
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

  // ---------------------------------------
  // LIST VIEW
  // ---------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh Sách Đội Bóng</CardTitle>
              <CardDescription>Quản lý các đội tham gia giải</CardDescription>
            </div>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm đội bóng
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm đội bóng mới</DialogTitle>
                  <DialogDescription>Vui lòng nhập thông tin</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* UPLOAD LOGO */}
                  <div>
                    <Label>Logo đội bóng</Label>

                    <div className="flex flex-col items-center">
                      <label
                        className="
      w-32 h-32 
      border border-dashed border-gray-300 
      rounded-xl 
      flex flex-col items-center justify-center 
      cursor-pointer 
      bg-white
      hover:border-blue-500 hover:bg-blue-50
      transition-all duration-200
      text-center
      group
    "
                      >
                        {previewAddLogo ? (
                          <img
                            src={previewAddLogo}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <>
                            <UploadCloud className="h-7 w-7 text-gray-400 group-hover:text-blue-500 transition mb-1" />
                            <span className="text-sm text-gray-500 group-hover:text-blue-600">
                              Chọn ảnh
                            </span>
                          </>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChangeAdd}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Tên đội *</Label>
                    <Input
                      value={newTeam.name}
                      onChange={(e) =>
                        setNewTeam({
                          ...newTeam,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Sân nhà *</Label>
                    <Input
                      value={newTeam.homeStadium}
                      onChange={(e) =>
                        setNewTeam({
                          ...newTeam,
                          homeStadium: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    onClick={handleAddTeam}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang thêm...
                      </>
                    ) : (
                      "Thêm đội bóng"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left font-semibold w-[90px]">Logo</th>
                  <th className="p-4 text-left font-semibold w-[200px]">
                    Tên đội
                  </th>
                  <th className="p-4 text-left font-semibold w-[180px]">
                    Sân nhà
                  </th>
                  <th className="p-4 text-left font-semibold w-[120px]">
                    Số cầu thủ
                  </th>
                  <th className="p-4 text-right font-semibold w-[80px]">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    onClick={() => handleViewDetail(team)}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="p-4">
                      {team.image ? (
                        <img
                          src={team.image}
                          className="w-12 h-12 rounded-full object-cover shadow shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                          ?
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-medium whitespace-nowrap">
                      {team.name}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {team.homeStadium}
                    </td>

                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      {team.players?.length ?? 0}
                    </td>

                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="mr-4"
                          >
                            <Ellipsis className="h-10 w-10 " />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(team);
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTeamId(team.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Xóa
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

      {/* EDIT DIALOG */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa đội bóng</DialogTitle>
            <DialogDescription>Cập nhật thông tin</DialogDescription>
          </DialogHeader>

          {editTeam && (
            <div className="space-y-5 py-2">
              {/* Upload Logo */}
              <div className="flex flex-col items-center">
                <Label className="mb-2 font-medium">Logo</Label>

                <label
                  className="
              w-32 h-32
              border border-dashed border-gray-300
              rounded-xl
              flex flex-col items-center justify-center
              cursor-pointer
              bg-white
              hover:border-blue-500 hover:bg-blue-50
              transition-all duration-200
              overflow-hidden
              relative
              group
            "
                >
                  {previewEditLogo || editTeam.image ? (
                    <img
                      src={previewEditLogo || editTeam.image!}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <UploadCloud className="h-7 w-7 mb-1 text-gray-400 group-hover:text-blue-500 transition" />
                      <span className="text-sm text-gray-500 group-hover:text-blue-600">
                        Chọn ảnh
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChangeEdit}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Tên đội */}
              <div>
                <Label className="font-medium">Tên đội *</Label>
                <Input
                  value={editTeam.name}
                  onChange={(e) =>
                    setEditTeam({
                      ...editTeam,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* Sân nhà */}
              <div>
                <Label className="font-medium">Sân nhà *</Label>
                <Input
                  value={editTeam.homeStadium ?? ""}
                  onChange={(e) =>
                    setEditTeam({
                      ...editTeam,
                      homeStadium: e.target.value,
                    })
                  }
                />
              </div>

              {/* Nút lưu */}
              <Button
                className="w-full h-11 text-base rounded-xl"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa đội bóng?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
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
