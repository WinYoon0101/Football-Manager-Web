"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trophy,
  Loader2,
  ChartGantt,
  Users,
  User,
  Calendar,
  Target,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import { resultApi, type MatchResult } from "@/lib/api/matches";
import {
  reportsAPI,
  type TeamStats,
  type PlayerStats,
} from "@/lib/api/reports";
import { seasonApi, type Season, type SeasonRanking } from "@/lib/api/seasons";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ReportsModule() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [seasonOptions, setSeasonOptions] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [rankings, setRankings] = useState<SeasonRanking[]>([]);
  const [activeTab, setActiveTab] = useState<
    "teams" | "players" | "matches" | "standings"
  >("teams");
  const selectedSeason = seasonOptions.find(
    (season) => season.id === selectedSeasonId
  );

  // Lấy danh sách mùa giải và thiết lập mặc định
  useEffect(() => {
    const fetchSeasonOptions = async () => {
      setLoading(true);
      try {
        const response = await seasonApi.getAll();
        const sorted = [...response.data].sort((a, b) => b.id - a.id);
        setSeasonOptions(sorted);
        if (sorted.length > 0) {
          setSelectedSeasonId(sorted[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách mùa giải");
        console.error("Error fetching season options:", error);
        setLoading(false);
      }
    };

    fetchSeasonOptions();
  }, []);

  useEffect(() => {
    if (!selectedSeasonId) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const seasonIdParam = selectedSeasonId ?? undefined;
        const [teamStatsData, playerStatsData, resultsData, rankingsData] =
          await Promise.all([
            reportsAPI.getTeamStats(seasonIdParam),
            reportsAPI.getPlayerStats(seasonIdParam),
            resultApi.getAll(seasonIdParam),
            seasonApi.getRankings(seasonIdParam),
          ]);
        setTeamStats(teamStatsData);
        setPlayerStats(playerStatsData);
        setMatchResults(resultsData.data);
        setRankings(rankingsData.data);
      } catch (error) {
        toast.error("Không thể tải dữ liệu báo cáo");
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSeasonId]);

  const filteredResults = matchResults.filter((result) => {
    const search = searchTerm.toLowerCase();
    const team1Name = result.match.team1.name.toLowerCase();
    const team2Name = result.match.team2.name.toLowerCase();
    const roundName = result.match.round.name.toLowerCase();
    return (
      team1Name.includes(search) ||
      team2Name.includes(search) ||
      roundName.includes(search)
    );
  });

  const filteredTeamStats = teamStats.filter((stat) => {
    const search = searchTerm.toLowerCase();
    return stat.team.name.toLowerCase().includes(search);
  });

  const filteredPlayerStats = playerStats.filter((stat) => {
    const search = searchTerm.toLowerCase();
    return (
      stat.player.name.toLowerCase().includes(search) ||
      stat.team.name.toLowerCase().includes(search)
    );
  });

  const sortedRankings = [...rankings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.win - a.win;
  });

  const sortedPlayerStats = [...playerStats].sort((a, b) => b.goals - a.goals);

  // Export Excel functions
  const exportToExcel = () => {
    try {
      let data: any[] = [];
      let fileName = "";
      let sheetName = "";
      const seasonSuffix = selectedSeason
        ? `_${selectedSeason.name.replace(/\s+/g, "_")}`
        : "";

      switch (activeTab) {
        case "teams":
          data = filteredTeamStats.map((stat, index) => ({
            STT: index + 1,
            "Đội bóng": stat.team.name,
            "Sân nhà": stat.team.homeStadium || "",
            "Số trận": stat.totalMatches,
            Thắng: stat.wins,
            Hòa: stat.draws,
            Thua: stat.losses,
            "Bàn thắng": stat.goalsFor,
            "Bàn thua": stat.goalsAgainst,
            "Hiệu số": stat.goalsFor - stat.goalsAgainst,
            "Tổng cầu thủ": stat.totalPlayers,
            "Trong nước": stat.domesticPlayers,
            "Nước ngoài": stat.foreignPlayers,
          }));
          fileName = `Thong_ke_doi_bong${seasonSuffix}.xlsx`;
          sheetName = "Thống kê đội bóng";
          break;

        case "players":
          data = sortedPlayerStats
            .filter((stat) => {
              const search = searchTerm.toLowerCase();
              return (
                stat.player.name.toLowerCase().includes(search) ||
                stat.team.name.toLowerCase().includes(search)
              );
            })
            .map((stat, index) => ({
              Hạng: index + 1,
              "Cầu thủ": stat.player.name,
              "Đội bóng": stat.team.name,
              "Số trận": stat.matches,
              "Bàn thắng": stat.goals,
            }));
          fileName = `Thong_ke_cau_thu${seasonSuffix}.xlsx`;
          sheetName = "Thống kê cầu thủ";
          break;

        case "matches":
          data = filteredResults.map((result) => ({
            "Vòng đấu": result.match.round.name,
            "Thời gian": new Date(result.match.matchTime).toLocaleString(
              "vi-VN",
              {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            "Đội 1": result.match.team1.name,
            "Đội 2": result.match.team2.name,
            "Tỷ số": `${result.team1Goals} - ${result.team2Goals}`,
            "Sân vận động": result.match.stadium || "",
          }));
          fileName = `Bao_cao_tran_dau${seasonSuffix}.xlsx`;
          sheetName = "Báo cáo trận đấu";
          break;

        case "standings":
          data = sortedRankings.map((entry, index) => ({
            Hạng: index + 1,
            "Đội bóng": entry.team.name,
            "Số trận": entry.win + entry.draw + entry.lose,
            Thắng: entry.win,
            Hòa: entry.draw,
            Thua: entry.lose,
            "Hiệu số": entry.goalDifference,
            Điểm: entry.points,
          }));
          fileName = `Bang_xep_hang${seasonSuffix}.xlsx`;
          sheetName = "Bảng xếp hạng";
          break;
      }

      if (data.length === 0) {
        toast.warning("Không có dữ liệu để xuất");
        return;
      }

      // Tạo workbook và worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Xuất file
      XLSX.writeFile(wb, fileName);
      toast.success("Xuất báo cáo thành công!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Không thể xuất báo cáo");
    }
  };

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
              Báo cáo
            </CardTitle>
            <p className="text-white/70 text-sm">
              Báo cáo kết quả trận đấu và phân tích số liệu
            </p>
          </div>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10"
            onClick={exportToExcel}
          >
            <ChartGantt size={16} />
            Xuất báo cáo
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {seasonOptions.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Calendar className="h-4 w-4 text-white/60" />
                <span>Mùa giải</span>
              </div>
              <Select
                value={selectedSeasonId ? String(selectedSeasonId) : ""}
                onValueChange={(value) => {
                  setLoading(true);
                  setSelectedSeasonId(Number(value));
                }}
              >
                <SelectTrigger className="w-[220px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Chọn mùa giải" />
                </SelectTrigger>
                <SelectContent>
                  {seasonOptions.map((season) => (
                    <SelectItem key={season.id} value={String(season.id)}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab("teams")}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === "teams"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Users className="inline h-4 w-4 mr-2" />
              Thống kê đội bóng
            </button>
            <button
              onClick={() => setActiveTab("players")}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === "players"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <User className="inline h-4 w-4 mr-2" />
              Thống kê cầu thủ
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === "matches"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Calendar className="inline h-4 w-4 mr-2" />
              Báo cáo trận đấu
            </button>
            <button
              onClick={() => setActiveTab("standings")}
              className={`px-4 py-2 font-medium transition whitespace-nowrap ${
                activeTab === "standings"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Trophy className="inline h-4 w-4 mr-2" />
              Bảng Xếp Hạng
            </button>
          </div>

          {/* Search */}
          {(activeTab === "teams" ||
            activeTab === "players" ||
            activeTab === "matches") && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder={
                  activeTab === "teams"
                    ? "Tìm kiếm theo tên đội..."
                    : activeTab === "players"
                    ? "Tìm kiếm theo tên cầu thủ hoặc đội..."
                    : "Tìm kiếm theo đội hoặc vòng đấu..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* Team Statistics Tab */}
          {activeTab === "teams" && (
            <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="p-4 text-left font-semibold text-white">
                      Đội bóng
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Trận
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Thắng
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Hòa
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Thua
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      BT
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      BB
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      HS
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Cầu thủ
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Trong nước
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Nước ngoài
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeamStats.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center p-6 text-white/60"
                      >
                        Không có dữ liệu thống kê đội bóng.
                      </td>
                    </tr>
                  ) : (
                    filteredTeamStats.map((stat) => (
                      <tr
                        key={stat.team.id}
                        className="border-b border-white/20 hover:bg-white/10 transition"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {stat.team.image ? (
                              <img
                                src={stat.team.image}
                                className="w-10 h-10 rounded-full object-cover"
                                alt={stat.team.name}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/60">
                                ?
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-white">
                                {stat.team.name}
                              </span>
                              <p className="text-xs text-white/60">
                                {stat.team.homeStadium}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.totalMatches}
                        </td>
                        <td className="p-4 text-center text-green-400 font-medium">
                          {stat.wins}
                        </td>
                        <td className="p-4 text-center text-yellow-400 font-medium">
                          {stat.draws}
                        </td>
                        <td className="p-4 text-center text-red-400 font-medium">
                          {stat.losses}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.goalsFor}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.goalsAgainst}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.goalsFor - stat.goalsAgainst > 0 ? "+" : ""}
                          {stat.goalsFor - stat.goalsAgainst}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.totalPlayers}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.domesticPlayers}
                        </td>
                        <td className="p-4 text-center text-white/80">
                          {stat.foreignPlayers}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Player Statistics Tab */}
          {activeTab === "players" && (
            <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="p-4 text-center font-semibold w-16 text-white">
                      Hạng
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      Cầu thủ
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      Đội bóng
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Trận
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      <Target className="inline h-4 w-4 mr-1" />
                      Bàn thắng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayerStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-6 text-white/60">
                        Không có dữ liệu thống kê cầu thủ.
                      </td>
                    </tr>
                  ) : (
                    sortedPlayerStats
                      .filter((stat) => {
                        const search = searchTerm.toLowerCase();
                        return (
                          stat.player.name.toLowerCase().includes(search) ||
                          stat.team.name.toLowerCase().includes(search)
                        );
                      })
                      .map((stat, index) => (
                        <tr
                          key={stat.player.id}
                          className={`border-b border-white/20 hover:bg-white/10 transition ${
                            index < 3 ? "bg-yellow-500/20" : ""
                          }`}
                        >
                          <td className="p-4 text-center font-bold text-white">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {stat.player.image ? (
                                <img
                                  src={stat.player.image}
                                  className="w-10 h-10 rounded-full object-cover"
                                  alt={stat.player.name}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                  {stat.player.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </div>
                              )}
                              <span className="font-medium text-white">
                                {stat.player.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {stat.team.image ? (
                                <img
                                  src={stat.team.image}
                                  className="w-6 h-6 rounded-full object-cover"
                                  alt={stat.team.name}
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
                                  ?
                                </div>
                              )}
                              <span className="text-sm text-white/80">
                                {stat.team.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center text-white/80">
                            {stat.matches}
                          </td>
                          <td className="p-4 text-center font-bold text-lg text-green-400">
                            {stat.goals}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Match Results Table */}
          {activeTab === "matches" && (
            <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="p-4 text-left font-semibold text-white">
                      Vòng đấu
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      Thời gian
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Trận đấu
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Tỷ số
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      Sân vận động
                    </th>
                    <th className="p-4 text-center font-semibold w-20 text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-6 text-white/60">
                        Không có kết quả trận đấu nào.
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((result) => (
                      <tr
                        key={result.matchId}
                        className="border-b border-white/20 hover:bg-white/10 transition"
                      >
                        <td className="p-4 text-white/80">
                          {result.match.round.name}
                        </td>
                        <td className="p-4 text-white/80">
                          {new Date(result.match.matchTime).toLocaleString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </td>
                        <td className="p-4">
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-medium text-white">
                                {result.match.team1.name}
                              </span>
                              {result.match.team1.image ? (
                                <img
                                  src={result.match.team1.image}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt={result.match.team1.name}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
                                  ?
                                </div>
                              )}
                            </div>
                            <span className="text-white/60 text-center px-2">
                              vs
                            </span>
                            <div className="flex items-center gap-2">
                              {result.match.team2.image ? (
                                <img
                                  src={result.match.team2.image}
                                  className="w-8 h-8 rounded-full object-cover"
                                  alt={result.match.team2.name}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-white/60">
                                  ?
                                </div>
                              )}
                              <span className="font-medium text-white">
                                {result.match.team2.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-lg text-white">
                            {result.team1Goals} - {result.team2Goals}
                          </span>
                        </td>
                        <td className="p-4 text-white/60">
                          {result.match.stadium || "—"}
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(`/match/${result.match.id}`)
                            }
                            className="h-8 w-8 text-white hover:bg-white/20"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Standings Table */}
          {activeTab === "standings" && (
            <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
              <table className="w-full">
                <thead className="bg-white/10 border-b border-white/20">
                  <tr>
                    <th className="p-4 text-center font-semibold w-16 text-white">
                      Hạng
                    </th>
                    <th className="p-4 text-left font-semibold text-white">
                      Đội bóng
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Trận
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Thắng
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Hòa
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Thua
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      HS
                    </th>
                    <th className="p-4 text-center font-semibold text-white">
                      Điểm
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRankings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-6 text-white/60">
                        Chưa có dữ liệu bảng xếp hạng.
                      </td>
                    </tr>
                  ) : (
                    sortedRankings.map((entry, index) => {
                      const played = entry.win + entry.draw + entry.lose;
                      return (
                        <tr
                          key={`${entry.team.id}-${entry.id}`}
                          className={`border-b border-white/20 hover:bg-white/10 transition ${
                            index < 3 ? "bg-yellow-500/20" : ""
                          }`}
                        >
                          <td className="p-4 text-center font-bold text-white">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {entry.team.image ? (
                                <img
                                  src={entry.team.image}
                                  className="w-10 h-10 rounded-full object-cover"
                                  alt={entry.team.name}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/60">
                                  ?
                                </div>
                              )}
                              <span className="font-medium text-white">
                                {entry.team.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center text-white/80">
                            {played}
                          </td>
                          <td className="p-4 text-center text-green-400 font-medium">
                            {entry.win}
                          </td>
                          <td className="p-4 text-center text-yellow-400 font-medium">
                            {entry.draw}
                          </td>
                          <td className="p-4 text-center text-red-400 font-medium">
                            {entry.lose}
                          </td>
                          <td className="p-4 text-center text-white/80">
                            {entry.goalDifference > 0 ? "+" : ""}
                            {entry.goalDifference}
                          </td>
                          <td className="p-4 text-center font-bold text-lg text-white">
                            {entry.points}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
