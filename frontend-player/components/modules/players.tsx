"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Player, Team, PlayerType } from "@/lib/types";
import { playersAPI } from "@/lib/api/players";
import { teamsAPI } from "@/lib/api/teams";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getPlayerTypeLabel(typeName: string | null | undefined): string {
  if (!typeName) return "—";
  const lowerName = typeName.toLowerCase();
  if (lowerName === "foreign" || lowerName === "ngoài nước") {
    return "Ngoài nước";
  }
  if (lowerName === "domestic" || lowerName === "trong nước") {
    return "Trong nước";
  }
  return typeName;
}

export default function PlayersModule() {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [playerTypes, setPlayerTypes] = useState<PlayerType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [playersData, teamsData, playerTypesData] = await Promise.all([
          playersAPI.getAll(),
          teamsAPI.getAll(),
          playersAPI.getPlayerTypes(),
        ]);
        setPlayers(playersData);
        setTeams(teamsData);
        setPlayerTypes(playerTypesData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allTeamNames = teams.map((t) => t.name);

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTeam = teamFilter === "all" ? true : p.team?.name === teamFilter;
    const matchType =
      typeFilter === "all" ? true : p.playerType?.name === typeFilter;
    return matchSearch && matchTeam && matchType;
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
              Danh sách cầu thủ
            </CardTitle>
            <p className="text-white/70 text-sm">
              Chỉ xem thông tin, không thể chỉnh sửa
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="bg-white/10 border border-white/20 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Tìm kiếm cầu thủ..."
                className="pl-10 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={teamFilter} onValueChange={setTeamFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Lọc theo đội" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả đội</SelectItem>
                {allTeamNames.map((teamName) => (
                  <SelectItem key={teamName} value={teamName}>
                    {teamName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Loại cầu thủ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {playerTypes.map((pt) => (
                  <SelectItem key={pt.id} value={pt.name}>
                    {getPlayerTypeLabel(pt.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-white/20 rounded-xl">
            <table className="w-full text-sm table-fixed">
              <thead className="bg-white/10 border-b border-white/20">
                <tr className="grid grid-cols-[0.5fr,1fr,2.5fr,1.4fr,1.2fr] h-12 items-center px-4 font-semibold">
                  <th className="text-center text-white"></th>
                  <th className="text-left text-white">Cầu thủ</th>
                  <th className="text-center text-white">Ngày sinh</th>
                  <th className="text-left text-white">Đội bóng</th>
                  <th className="text-center text-white">Loại cầu thủ</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-white/60">
                      Không tìm thấy cầu thủ nào.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p, index) => (
                    <tr
                      key={p.id}
                      className={`grid grid-cols-[0.5fr,1fr,2.5fr,1.4fr,1.2fr] items-center px-4 h-16
            ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"}
            border-t border-white/20`}
                    >
                      <td className="flex justify-center">
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

                      <td className="text-white font-medium">{p.name}</td>

                      <td className="text-center text-white/80">
                        {p.birthDate
                          ? new Date(p.birthDate).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>

                      <td className="text-left text-white/80">
                        {p.team?.name || "—"}
                      </td>

                      <td className="text-center text-white/80">
                        {getPlayerTypeLabel(p.playerType?.name)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}


