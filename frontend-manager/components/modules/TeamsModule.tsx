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
  Pencil,
  Trash2,
  Loader2,
  MoreVertical,
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
            <h3 className="text-2xl font-bold text-white">
              {selectedTeam.name}
            </h3>
            <p className="text-white/70">{selectedTeam.homeStadium}</p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowDetail(false)}
            className="gap-2 text-white hover:text-white flex bg-blue-600 border-white/20  hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mt-0.5" />
            Quay Lại
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card thông tin đội */}
          <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Thông Tin Đội</CardTitle>
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
                  <div className="w-24 h-24 rounded-lg border border-white/20 flex items-center justify-center text-white/60 px-5">
                    Không có logo
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-white/70">Tên đội:</span>
                <p className="font-semibold text-white">{selectedTeam.name}</p>
              </div>

              <div>
                <span className="text-sm text-white/70">Sân nhà:</span>
                <p className="font-semibold text-white">
                  {selectedTeam.homeStadium}
                </p>
              </div>

              <div>
                <span className="text-sm text-white/70">Số cầu thủ:</span>
                <p className="font-semibold text-white">
                  {selectedTeam.players?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card danh sách cầu thủ */}
          <Card className="md:col-span-2 bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Danh sách cầu thủ</CardTitle>
            </CardHeader>

            <CardContent>
              {(selectedTeam.players?.length ?? 0) === 0 ? (
                <p className="text-white/60 text-center py-4">
                  Chưa có cầu thủ nào
                </p>
              ) : (
                <div className="space-y-2">
                  {(selectedTeam.players ?? []).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar player nếu sau này muốn thêm */}
                        {/* <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" /> */}

                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-xs text-white/60">
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
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Danh Sách Đội Bóng</CardTitle>
              <CardDescription className="text-white/70 mt-2">
                Các đội bóng tham gia giải
              </CardDescription>
            </div>

      
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="border border-white/20 rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="p-4 text-left font-semibold text-white w-[100px]"></th>
                  <th className="p-4 text-left font-semibold text-white w-[200px]">
                    Tên đội
                  </th>
                  <th className="p-4 text-left font-semibold text-white w-[180px]">
                    Sân nhà
                  </th>
                  <th className="p-4 text-left font-semibold text-white w-[120px]">
                    Số cầu thủ
                  </th>
                 
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    onClick={() => handleViewDetail(team)}
                    className="border-b border-white/20 hover:bg-white/10 transition cursor-pointer"
                  >
                    <td className="p-4 px-16">
                      {team.image ? (
                        <img
                          src={team.image}
                          className="w-12 h-12 rounded-full object-cover shadow shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/60">
                          ?
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-medium text-white whitespace-nowrap">
                      {team.name}
                    </td>

                    <td className="p-4 text-white/80 whitespace-nowrap">
                      {team.homeStadium}
                    </td>

                    <td className="p-4 text-white/70 whitespace-nowrap">
                      {team.players?.length ?? 0}
                    </td>

                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

   
    </div>
  );
}
