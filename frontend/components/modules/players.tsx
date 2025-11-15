"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";

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

import AddPlayerDialog from "../AddPlayerDialog";
import EditPlayerDialog from "../EditPlayerDialog";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PlayersModule() {
  // Basic types for players used in this component
  interface Team {
    name: string;
  }
  interface PlayerType {
    name: string;
  }
  interface Player {
    id: number;
    name: string;
    birthDate: string;
    team?: Team | null;
    playerType?: PlayerType | null;
  }

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setEditOpen(true);
  };

  const players = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      birthDate: "2000-01-01",
      team: { name: "Hà Nội FC" },
      playerType: { name: "domestic" },
    },
    {
      id: 2,
      name: "John Smith",
      birthDate: "1998-05-20",
      team: { name: "Sài Gòn United" },
      playerType: { name: "foreign" },
    },
    {
      id: 3,
      name: "Trần Quốc Bảo",
      birthDate: "2002-11-12",
      team: { name: "Hà Nội FC" },
      playerType: { name: "domestic" },
    },
  ];

  const allTeams = [...new Set(players.map((p) => p.team?.name))];

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTeam = teamFilter !== "all" ? p.team?.name === teamFilter : true;
    const matchType = typeFilter !== "all" ? p.playerType?.name === typeFilter : true;
    return matchSearch && matchTeam && matchType;
  });

  return (
    <>
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Quản lý cầu thủ
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Danh sách cầu thủ trong hệ thống
            </p>
          </div>
          <Button size="sm" className="flex items-center gap-2" onClick={() => setOpenAdd(true)}>
            <Plus size={16} />
            Thêm cầu thủ
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Filters Section */}
          <div className="bg-muted/30 p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm cầu thủ..."
                className="pl-10 rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Team Filter */}
            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full">
                <SelectValue placeholder="Lọc theo đội" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đội</SelectItem>
                {allTeams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full">
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
      
<div className="overflow-x-auto border rounded-lg">
  <table className="w-full text-sm">
    <thead className="bg-muted/40 text-black">
  <tr className="h-12">
    <th className="p-3 text-center w-5 font-medium"></th>
    <th className="p-3 text-center w-52 font-medium">Tên cầu thủ</th>
    <th className="p-3 text-center w-28 font-medium">Ngày sinh</th>
    <th className="p-3 text-center w-40 font-medium">Đội bóng</th>
    <th className="p-3 text-center w-36 font-medium">Loại cầu thủ</th>
    <th className="p-3 w-14 font-medium"></th>
  </tr>
</thead>

   <tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center p-6 text-muted-foreground">
        Không tìm thấy cầu thủ nào.
      </td>
    </tr>
  ) : (
    filtered.map((p, index) => (
      <tr
        key={p.id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-muted/20"
        } border-t hover:bg-muted/30 transition h-14 align-middle`}
      >
        {/* AVATAR COLUMN */}
        <td className="p-3 text-center align-middle">
          <div className="w-11 h-11 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            {getInitials(p.name)}
          </div>
        </td>

        {/* NAME COLUMN */}
        <td className="p-3 text-center align-middle font-medium">
          {p.name}
        </td>

        {/* BIRTHDATE */}
        <td className="p-3 text-center align-middle">
          {new Date(p.birthDate).toLocaleDateString("vi-VN")}
        </td>

        {/* TEAM */}
        <td className="p-3 text-center align-middle">
          {p.team?.name || "—"}
        </td>

        {/* TYPE */}
        <td className="p-3 text-center align-middle">
          {p.playerType?.name === "domestic"
            ? "Trong nước"
            : "Nước ngoài"}
        </td>

        {/* ACTIONS */}
        <td className="p-3 text-center align-middle">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
               onClick={() => handleEdit(p)}
              >
                <Pencil className="h-4 w-4 mr-2" /> Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => confirm(`Xóa cầu thủ ${p.name}?`)}
              >
                <Trash2 className="h-4 w-4 mr-2 text-red-600" /> Xóa
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
        teams={allTeams}
        onSubmit={(data) => {
          console.log("Dữ liệu nhận:", data);
          alert("Đã thêm cầu thủ!");
        }}
      />
   {/* Edit Player Dialog */}
      <EditPlayerDialog
  open={editOpen}
  onOpenChange={setEditOpen}
  onSubmit={(data) => console.log("Edited:", data)}
  teams={allTeams}
  player={editingPlayer}
/>
    </>
  );
}
