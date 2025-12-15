"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import AddPlayerDialog from "../players/AddPlayerDialog";
import EditPlayerDialog from "../players/EditPlayerDialog";
import type { Player, PlayerType } from "@/lib/types";
import { playersAPI } from "@/lib/api/players";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PlayersModule() {
  const [search, setSearch] = useState("");
 
  const [typeFilter, setTypeFilter] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editOpen, setEditOpen] = useState(false);

const user = JSON.parse(localStorage.getItem("user") || "{}");
const userTeamId = user?.teamId;
const userTeamName = user?.team?.name;



  // Fetch data từ API
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersData, playerTypesData] = await Promise.all([
        playersAPI.getByTeam(userTeamId),
        playersAPI.getPlayerTypes(),
      ]);
      setPlayers(playersData);
      setPlayerTypes(playerTypesData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setEditOpen(true);
  };

  const handleDelete = async (player: Player) => {
    if (!confirm(`Xóa cầu thủ ${player.name}?`)) return;

    try {
      setIsSubmitting(true);
      await playersAPI.delete(player.id);
      setPlayers(players.filter((p) => p.id !== player.id));
      toast.success("Đã xóa cầu thủ thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể xóa cầu thủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPlayer = async (data: {
    name: string;
    birthDate: string;
    team: string;
    playerType: string;
    image?: string | File | null;
  }) => {
    try {
      setIsSubmitting(true);

    

      // Tìm player type ID từ tên
      const playerType = playerTypes.find((pt) => pt.name === data.playerType);
      if (!playerType) {
        toast.error("Loại cầu thủ không hợp lệ");
        return;
      }

      // Xử lý image nếu là File
      let imageFile: File | undefined;
      if (data.image && typeof data.image !== "string") {
        imageFile = data.image as File;
      }

      const newPlayer = await playersAPI.create({
        name: data.name,
        birthDate: data.birthDate,
         teamId: userTeamId,  // mặc định là team của user
        playerTypeId: playerType.id,
        image: imageFile,
      });

      setPlayers([...players, newPlayer]);
      toast.success("Thêm cầu thủ thành công!");
      setOpenAdd(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể thêm cầu thủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePlayer = async (data: {
    id: number;
    name: string;
    birthDate: string;
    team: string;
    playerType: string;
    image?: string | File | null;
  }) => {
    try {
      setIsSubmitting(true);

     

      // Tìm player type ID từ tên
      const playerType = playerTypes.find((pt) => pt.name === data.playerType);
      if (!playerType) {
        toast.error("Loại cầu thủ không hợp lệ");
        return;
      }

      // Xử lý image nếu là File mới
      let imageFile: File | undefined;
      if (data.image && typeof data.image !== "string") {
        imageFile = data.image as File;
      }

      const updatedPlayer = await playersAPI.update(data.id, {
        name: data.name,
        birthDate: data.birthDate,
        teamId: userTeamId, // giữ nguyên team của user
        playerTypeId: playerType.id,
        image: imageFile,
      });

      setPlayers(players.map((p) => (p.id === data.id ? updatedPlayer : p)));
      toast.success("Cập nhật cầu thủ thành công!");
      setEditOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật cầu thủ"
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
   
    const matchType =
      typeFilter === "all" ? true : p.playerType?.name === typeFilter;
    return matchSearch  && matchType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-sm rounded-xl">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Quản lý cầu thủ
            </CardTitle>
            <p className="text-white/70 text-sm mt-2">
              Danh sách cầu thủ đội bóng <span className="text-blue-400">{userTeamName}</span>
            </p>
          </div>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10"
            onClick={() => setOpenAdd(true)}
          >
            <Plus size={16} />
            Thêm cầu thủ
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters Section */}
          <div className="bg-white/10 border border-white/20 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Tìm kiếm cầu thủ..."
                className="pl-10 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

      

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Loại cầu thủ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="domestic">Trong nước</SelectItem>
                <SelectItem value="foreign">Nước ngoài</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}

<div className="overflow-x-auto border border-white/20 rounded-xl">
  <table className="w-full text-sm table-fixed border-collapse">
    {/* HEADER */}
    <thead className="bg-white/10 border-b border-white/20">
      <tr className="h-12 text-center">
  <th className="w-[8%]"></th>
  <th className="w-[17%] text-left pl-4">Cầu thủ</th>
  <th className="w-[25%]">Ngày sinh</th>
  <th className="w-[20%] text-left pl-4">Đội bóng</th>
  <th className="w-[17%]">Loại cầu thủ</th>
  <th className="w-[13%]">Thao tác</th>
</tr>
    </thead>

    {/* BODY */}
    <tbody>
      {filtered.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center p-6 text-white/60">
            Không tìm thấy cầu thủ nào.
          </td>
        </tr>
      ) : (
        filtered.map((p, index) => (
          <tr
            key={p.id}
            className={`h-16 border-t border-white/20 
              ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"} 
              hover:bg-white/15 transition`}
          >
            {/* Avatar */}
            <td className="flex items-center justify-center mt-2">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                  {getInitials(p.name)}
                </div>
              )}
            </td>

            {/* Name */}
            <td className="text-white font-medium text-left pl-4 align-middle">
              {p.name}
            </td>

            {/* Birthdate */}
            <td className="text-white/80 text-center align-middle">
              {p.birthDate
                ? new Date(p.birthDate).toLocaleDateString("vi-VN")
                : "—"}
            </td>

            {/* Team */}
            <td className="text-white/80 text-left pl-4 align-middle">
              {p.team?.name || "—"}
            </td>

            {/* Type */}
            <td className="text-white/80 text-center align-middle">
              {p.playerType?.name === "domestic"
                ? "Trong nước"
                : p.playerType?.name === "foreign"
                ? "Nước ngoài"
                : p.playerType?.name || "—"}
            </td>

            {/* Actions */}
            <td className="flex items-center justify-center mt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/20 rounded-md text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(p)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(p)}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>



        </CardContent>
      </Card>

      {/* Add Player Dialog */}
    <AddPlayerDialog
  open={openAdd}
  onOpenChange={setOpenAdd}
  teams={[{ id: userTeamId, name: userTeamName }]}
  onSubmit={handleAddPlayer}
/>
      {/* Edit Player Dialog */}
      <EditPlayerDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdatePlayer}
        teams={[userTeamName]} // chỉ hiện tên đội của user
        player={editingPlayer}
      />
    </>
  );
}
