"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Trophy,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { matchApi, resultApi } from "@/lib/api/matches";
import { api } from "@/lib/api/axios";
import type { Match, MatchResult, Team, Round } from "@/lib/types";
import { toast } from "react-toastify";

export default function MatchesModule() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    roundId: "",
    team1Id: "",
    team2Id: "",
    matchTime: "",
    stadium: "",
  });

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

  const handleCreateMatch = async () => {
    if (
      !formData.roundId ||
      !formData.team1Id ||
      !formData.team2Id ||
      !formData.matchTime
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (formData.team1Id === formData.team2Id) {
      toast.error("Đội 1 và Đội 2 không thể giống nhau");
      return;
    }

    try {
      await matchApi.create({
        roundId: Number(formData.roundId),
        team1Id: Number(formData.team1Id),
        team2Id: Number(formData.team2Id),
        matchTime: formData.matchTime,
        stadium: formData.stadium || undefined,
      });

      toast.success("Tạo trận đấu thành công");
      setShowCreateForm(false);
      setFormData({
        roundId: "",
        team1Id: "",
        team2Id: "",
        matchTime: "",
        stadium: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error creating match:", error);
      toast.error("Không thể tạo trận đấu");
    }
  };

  const handleDeleteMatch = async (matchId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa trận đấu này?")) {
      return;
    }

    try {
      await matchApi.delete(matchId);
      toast.success("Xóa trận đấu thành công");
      fetchData();
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Không thể xóa trận đấu");
    }
  };

  const getTeamName = (teamId: number) => {
    return teams.find((team) => team.id === teamId)?.name || "Unknown";
  };

  const getRoundName = (roundId: number) => {
    return rounds.find((round) => round.id === roundId)?.name || "Unknown";
  };

  const getMatchResult = (matchId: number) => {
    return matchResults.find((result) => result.matchId === matchId);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResultBadge = (result: MatchResult | undefined, match: Match) => {
    // Kiểm tra xem trận đấu đã diễn ra chưa
    const matchDate = new Date(match.matchTime);
    const now = new Date();
    const hasMatchOccurred = matchDate < now;

    if (!result || !hasMatchOccurred) {
      return <Badge variant="outline">Chưa diễn ra</Badge>;
    }

    switch (result.winner) {
      case "team1":
        return (
          <Badge className="bg-green-100 text-green-800">
            {getTeamName(match.team1Id)} thắng
          </Badge>
        );
      case "team2":
        return (
          <Badge className="bg-green-100 text-green-800">
            {getTeamName(match.team2Id)} thắng
          </Badge>
        );
      case "draw":
        return <Badge className="bg-yellow-100 text-yellow-800">Hòa</Badge>;
      default:
        return <Badge variant="outline">Chưa có kết quả</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách trận đấu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trận đấu</h1>
          <p className="text-gray-600">Tạo và quản lý lịch thi đấu</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo trận đấu mới
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo trận đấu mới</CardTitle>
            <CardDescription>
              Điền thông tin để tạo trận đấu mới
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Vòng đấu *</Label>
                <Select
                  value={formData.roundId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, roundId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vòng đấu" />
                  </SelectTrigger>
                  <SelectContent>
                    {rounds.map((round) => (
                      <SelectItem key={round.id} value={round.id.toString()}>
                        {round.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Đội 1 *</Label>
                <Select
                  value={formData.team1Id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, team1Id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đội 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Đội 2 *</Label>
                <Select
                  value={formData.team2Id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, team2Id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đội 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams
                      .filter((team) => team.id.toString() !== formData.team1Id)
                      .map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Thời gian thi đấu *</Label>
                <Input
                  type="datetime-local"
                  value={formData.matchTime}
                  onChange={(e) =>
                    setFormData({ ...formData, matchTime: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Sân vận động</Label>
                <Input
                  value={formData.stadium}
                  onChange={(e) =>
                    setFormData({ ...formData, stadium: e.target.value })
                  }
                  placeholder="Nhập tên sân vận động"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateMatch}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo trận đấu
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matches List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách trận đấu</CardTitle>
          <CardDescription>{matches.length} trận đấu</CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Chưa có trận đấu nào
              </h3>
              <p className="text-gray-500 mb-4">
                Tạo trận đấu đầu tiên để bắt đầu
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo trận đấu mới
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const result = getMatchResult(match.id);
                return (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <Badge variant="outline">
                          {getRoundName(match.roundId)}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {formatDate(match.matchTime)}
                        </div>
                        {match.stadium && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {match.stadium}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="font-semibold">
                          {getTeamName(match.team1Id)} vs{" "}
                          {getTeamName(match.team2Id)}
                        </div>
                        {result && new Date(match.matchTime) < new Date() && (
                          <div className="font-bold text-lg">
                            {result.team1Goals} - {result.team2Goals}
                          </div>
                        )}
                        {getResultBadge(result, match)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/match/${match.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/match/update/${match.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMatch(match.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
