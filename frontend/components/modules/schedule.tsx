"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, MapPin, Clock, Trophy, Filter } from "lucide-react";
import { matchApi, resultApi } from "@/lib/api/matches";
import { api } from "@/lib/api/axios";
import type { Match, MatchResult, Team, Round } from "@/lib/types";
import { toast } from "react-toastify";

export default function ScheduleModule() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchesRes, resultsRes, teamsRes, roundsRes] = await Promise.all([
        matchApi.getAll(),
        resultApi.getAll(),
        api.get<Team[]>("/teams"),
        matchApi.getRounds(),
      ]);

      setMatches(matchesRes.data);
      setMatchResults(resultsRes.data);
      setTeams(teamsRes.data);
      setRounds(roundsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId: number) => {
    return teams.find((team) => team.id === teamId)?.name || "Unknown";
  };

  const getTeamLogo = (teamId: number) => {
    return teams.find((team) => team.id === teamId)?.image;
  };

  const getRoundName = (roundId: number) => {
    return rounds.find((round) => round.id === roundId)?.name || "Unknown";
  };

  const getMatchResult = (matchId: number) => {
    return matchResults.find((result) => result.matchId === matchId);
  };

  const formatTime = (dateString: string | Date) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isMatchCompleted = (match: Match) => {
    const matchDate = new Date(match.matchTime);
    const now = new Date();
    return matchDate < now;
  };

  const getScoreDisplay = (match: Match, result?: MatchResult) => {
    if (!result || !isMatchCompleted(match)) {
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <Badge variant="outline" className="mt-1">
            Chưa diễn ra
          </Badge>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-white">
          {result.team1Goals} - {result.team2Goals}
        </div>
        <Badge
          className={`mt-1 ${
            result.winner === "draw"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {result.winner === "team1"
            ? `${getTeamName(match.team1Id)} thắng`
            : result.winner === "team2"
            ? `${getTeamName(match.team2Id)} thắng`
            : "Hòa"}
        </Badge>
      </div>
    );
  };

  // Filter matches by selected round
  const filteredMatches =
    selectedRound === "all"
      ? matches
      : matches.filter((match) => match.roundId.toString() === selectedRound);

  // Group matches by round
  const matchesByRound = filteredMatches.reduce((acc, match) => {
    const roundId = match.roundId;
    if (!acc[roundId]) {
      acc[roundId] = [];
    }
    acc[roundId].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch thi đấu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch thi đấu</h1>
            <p className="text-gray-600">Xem lịch và kết quả các trận đấu</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <Select value={selectedRound} onValueChange={setSelectedRound}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn vòng đấu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vòng đấu</SelectItem>
                {rounds.map((round) => (
                  <SelectItem key={round.id} value={round.id.toString()}>
                    {round.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matches by Round */}
        {Object.entries(matchesByRound).map(([roundId, roundMatches]) => (
          <Card
            key={roundId}
            className="bg-gray-900 text-white border-gray-700"
          >
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  {getRoundName(Number(roundId))}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-gray-300 border-gray-600"
                >
                  {roundMatches.length} trận đấu
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {roundMatches
                  .sort(
                    (a, b) =>
                      new Date(a.matchTime).getTime() -
                      new Date(b.matchTime).getTime()
                  )
                  .map((match, index) => {
                    const result = getMatchResult(match.id);
                    const isCompleted = isMatchCompleted(match);

                    return (
                      <div
                        key={match.id}
                        className={`flex items-center justify-between p-4 hover:bg-gray-800 transition-colors ${
                          index !== roundMatches.length - 1
                            ? "border-b border-gray-700"
                            : ""
                        }`}
                      >
                        {/* Time and Date */}
                        <div className="w-20 text-center">
                          <div className="text-lg font-bold text-white">
                            {formatTime(match.matchTime)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(match.matchTime)}
                          </div>
                        </div>

                        {/* Team 1 */}
                        <div className="flex-1 flex items-center justify-end gap-3 pr-4">
                          <div className="text-right">
                            <div className="font-semibold text-white">
                              {getTeamName(match.team1Id)}
                            </div>
                          </div>
                          {getTeamLogo(match.team1Id) && (
                            <img
                              src={getTeamLogo(match.team1Id)}
                              alt={getTeamName(match.team1Id)}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                        </div>

                        {/* Score */}
                        <div className="w-32">
                          {getScoreDisplay(match, result)}
                        </div>

                        {/* Team 2 */}
                        <div className="flex-1 flex items-center gap-3 pl-4">
                          {getTeamLogo(match.team2Id) && (
                            <img
                              src={getTeamLogo(match.team2Id)}
                              alt={getTeamName(match.team2Id)}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div className="text-left">
                            <div className="font-semibold text-white">
                              {getTeamName(match.team2Id)}
                            </div>
                          </div>
                        </div>

                        {/* Stadium */}
                        <div className="w-32 text-right">
                          {match.stadium && (
                            <div className="flex items-center justify-end gap-1 text-sm text-gray-400">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{match.stadium}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="w-8 flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMatches.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không có trận đấu nào
              </h3>
              <p className="text-gray-500">
                {selectedRound === "all"
                  ? "Chưa có trận đấu nào được tạo"
                  : "Vòng đấu này chưa có trận đấu nào"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          {/* Standings Table */}
          <Card className="bg-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">
                Bảng Xếp Hạng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {teams.slice(0, 8).map((team, index) => (
                  <div
                    key={team.id}
                    className={`flex items-center justify-between px-4 py-2 ${
                      index !== teams.length - 1
                        ? "border-b border-green-500"
                        : ""
                    } hover:bg-green-500 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white text-green-600 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {team.image && (
                        <img
                          src={team.image}
                          alt={team.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium text-sm truncate">
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>0</span>
                      <span>0</span>
                      <span className="font-bold">0</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-green-500">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-green-500 text-sm"
                >
                  Xem Đầy Đủ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* News/Updates */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tin Tức</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Thông báo</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Thông báo về lịch V.League 1 - 2023/24
                </p>
              </div>

              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-600 font-medium">Cập nhật</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Số bàn chuyển mùa vòng 1 Giải V.LEAGUE 1 - 2023/24
                </p>
              </div>

              <div className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Kết quả</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Thưa bên mình, HLV Khánh Hòa nhận phần thưởng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
