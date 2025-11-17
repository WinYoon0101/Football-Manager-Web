"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Trophy,
} from "lucide-react";
import { matchApi, resultApi, goalApi } from "@/lib/api/matches";
import { api } from "@/lib/api/axios";
import type { Match, MatchResult, Player, GoalType } from "@/lib/types";
import { toast } from "react-toastify";

interface GoalForm {
  playerId: number | "";
  teamId: number | "";
  goalTypeId: number | "";
  minute: number | "";
}

export default function MatchUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [match, setMatch] = useState<Match | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [goalTypes, setGoalTypes] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [staticDataLoading, setStaticDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingGoal, setAddingGoal] = useState(false);

  // Form states
  const [matchTime, setMatchTime] = useState("");
  const [stadium, setStadium] = useState("");
  const [goalForm, setGoalForm] = useState<GoalForm>({
    playerId: "",
    teamId: "",
    goalTypeId: "",
    minute: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Start parallel fetch for static data (don't wait for it)
        setStaticDataLoading(true);
        const staticDataPromise = Promise.all([
          api.get<Player[]>("/players"),
          goalApi.getGoalTypes(),
        ])
          .then(([playersResponse, goalTypesResponse]) => {
            setPlayers(playersResponse.data);
            setGoalTypes(goalTypesResponse.data);
            setStaticDataLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching static data:", error);
            setStaticDataLoading(false);
          });

        // Try result API first (has match info + result)
        let matchData: Match | null = null;
        let resultData: MatchResult | null = null;

        try {
          const resultResponse = await resultApi.getById(matchId);
          resultData = resultResponse.data;

          // Extract match info from result
          if (resultData) {
            matchData = {
              id: resultData.match.id,
              roundId: resultData.match.round.id,
              team1Id: resultData.match.team1.id,
              team2Id: resultData.match.team2.id,
              matchTime: resultData.match.matchTime,
              stadium: resultData.match.stadium,
              round: resultData.match.round,
              team1: resultData.match.team1,
              team2: resultData.match.team2,
              goals: resultData.goals.map((goal) => ({
                id: goal.id,
                matchId: resultData!.matchId,
                teamId: goal.team.id,
                playerId: goal.player.id,
                goalTypeId: goal.goalType.id,
                minute: goal.minute,
                team: goal.team as any,
                player: goal.player as any,
                goalType: goal.goalType as any,
              })) as any,
            };
          }

          setMatch(matchData);
          setMatchResult(resultData);
        } catch (error) {
          // Fallback to match API if no result
          console.log("No result found, fetching match data...");
          const matchResponse = await matchApi.getById(matchId);
          matchData = matchResponse.data;
          setMatch(matchData);
          setMatchResult(null);
        }

        // Set form values immediately when match data is available
        if (matchData) {
          setMatchTime(
            new Date(matchData.matchTime).toISOString().slice(0, 16)
          );
          setStadium(matchData.stadium || "");
        }

        // Match info is loaded, show the page immediately
        setLoading(false);
        // Static data continues loading in background
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải thông tin trận đấu");
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchData();
    }
  }, [matchId]);

  const handleUpdateMatch = useCallback(async () => {
    if (!match) return;

    try {
      setSaving(true);
      await matchApi.update(matchId, {
        matchTime,
        stadium: stadium || undefined,
      });

      toast.success("Cập nhật thông tin trận đấu thành công");

      // Refresh data
      const updatedMatch = await matchApi.getById(matchId);
      setMatch(updatedMatch.data);
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Không thể cập nhật thông tin trận đấu");
    } finally {
      setSaving(false);
    }
  }, [match, matchId, matchTime, stadium]);

  const handleAddGoal = useCallback(async () => {
    if (
      !goalForm.playerId ||
      !goalForm.teamId ||
      !goalForm.goalTypeId ||
      !goalForm.minute
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bàn thắng");
      return;
    }

    if (Number(goalForm.minute) < 0 || Number(goalForm.minute) > 90) {
      toast.error("Phút ghi bàn phải từ 0 đến 120");
      return;
    }

    try {
      setAddingGoal(true);
      await goalApi.create({
        matchId,
        teamId: Number(goalForm.teamId),
        playerId: Number(goalForm.playerId),
        goalTypeId: Number(goalForm.goalTypeId),
        minute: Number(goalForm.minute),
      });

      toast.success("Thêm bàn thắng thành công");

      // Reset form
      setGoalForm({
        playerId: "",
        teamId: "",
        goalTypeId: "",
        minute: "",
      });

      // Refresh match result
      try {
        const resultResponse = await resultApi.getById(matchId);
        setMatchResult(resultResponse.data);
      } catch (resultError) {
        // Result might not exist yet, that's okay
        console.log("No result yet, will be calculated when goals are added");
      }
    } catch (error: any) {
      console.error("Error adding goal:", error);
      const errorMessage =
        error?.response?.data?.message || "Không thể thêm bàn thắng";
      toast.error(errorMessage);
    } finally {
      setAddingGoal(false);
    }
  }, [goalForm, matchId]);

  const handleDeleteGoal = useCallback(
    async (goalId: number) => {
      if (!confirm("Bạn có chắc chắn muốn xóa bàn thắng này?")) {
        return;
      }

      try {
        await goalApi.delete(goalId);
        toast.success("Xóa bàn thắng thành công");

        // Refresh match result
        try {
          const resultResponse = await resultApi.getById(matchId);
          setMatchResult(resultResponse.data);
        } catch (resultError) {
          // If no result, set to null
          setMatchResult(null);
        }
      } catch (error: any) {
        console.error("Error deleting goal:", error);
        const errorMessage =
          error?.response?.data?.message || "Không thể xóa bàn thắng";
        toast.error(errorMessage);
      }
    },
    [matchId]
  );

  const getTeamPlayers = useCallback(
    (teamId: number) => {
      return players.filter((player) => player.teamId === teamId);
    },
    [players]
  );

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin trận đấu...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy trận đấu
          </h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button onClick={() => router.push(`/match/${matchId}`)}>
            Xem chi tiết trận đấu
          </Button>
        </div>

        {/* Match Info */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <CardDescription>{match.round?.name}</CardDescription>
            </div>
            <CardTitle className="text-3xl font-bold">
              {match.team1?.name} vs {match.team2?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team 1 */}
              <div className="text-center">
                {match.team1?.image && (
                  <img
                    src={match.team1.image}
                    alt={match.team1.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold">{match.team1?.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  {matchResult?.team1Goals || 0}
                </div>
              </div>

              {/* Match Details */}
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-gray-400">VS</div>
                {matchResult && (
                  <Badge className="px-4 py-2">
                    {matchResult.winner === "team1"
                      ? match.team1?.name + " thắng"
                      : matchResult.winner === "team2"
                      ? match.team2?.name + " thắng"
                      : "Hòa"}
                  </Badge>
                )}
              </div>

              {/* Team 2 */}
              <div className="text-center">
                {match.team2?.image && (
                  <img
                    src={match.team2.image}
                    alt={match.team2.name}
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold">{match.team2?.name}</h3>
                <div className="text-4xl font-bold text-red-600 mt-2">
                  {matchResult?.team2Goals || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Match Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cập nhật thông tin trận đấu</CardTitle>
            <CardDescription>
              Chỉnh sửa thời gian và địa điểm thi đấu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="matchTime">Thời gian thi đấu</Label>
                <Input
                  id="matchTime"
                  type="datetime-local"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stadium">Sân vận động</Label>
                <Input
                  id="stadium"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="Nhập tên sân vận động"
                />
              </div>
            </div>
            <Button onClick={handleUpdateMatch} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Đang lưu..." : "Cập nhật thông tin"}
            </Button>
          </CardContent>
        </Card>

        {/* Add Goal */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thêm bàn thắng</CardTitle>
            <CardDescription>Ghi nhận bàn thắng trong trận đấu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {staticDataLoading ? (
              // Skeleton loading for goal form
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Đội ghi bàn</Label>
                  <Select
                    value={goalForm.teamId ? goalForm.teamId.toString() : ""}
                    onValueChange={(value) =>
                      setGoalForm({
                        ...goalForm,
                        teamId: Number(value),
                        playerId: "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đội" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={match.team1Id.toString()}>
                        {match.team1?.name}
                      </SelectItem>
                      <SelectItem value={match.team2Id.toString()}>
                        {match.team2?.name}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cầu thủ ghi bàn</Label>
                  <Select
                    value={
                      goalForm.playerId ? goalForm.playerId.toString() : ""
                    }
                    onValueChange={(value) =>
                      setGoalForm({ ...goalForm, playerId: Number(value) })
                    }
                    disabled={!goalForm.teamId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cầu thủ" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalForm.teamId &&
                        getTeamPlayers(Number(goalForm.teamId)).map(
                          (player) => (
                            <SelectItem
                              key={player.id}
                              value={player.id.toString()}
                            >
                              {player.name}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Loại bàn thắng</Label>
                  <Select
                    value={
                      goalForm.goalTypeId ? goalForm.goalTypeId.toString() : ""
                    }
                    onValueChange={(value) =>
                      setGoalForm({ ...goalForm, goalTypeId: Number(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Phút ghi bàn</Label>
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    value={goalForm.minute}
                    onChange={(e) =>
                      setGoalForm({
                        ...goalForm,
                        minute: Number(e.target.value),
                      })
                    }
                    placeholder="45"
                  />
                </div>
              </div>
            )}

            <Button
              onClick={handleAddGoal}
              disabled={staticDataLoading || addingGoal}
            >
              <Plus className="h-4 w-4 mr-2" />
              {addingGoal
                ? "Đang thêm..."
                : staticDataLoading
                ? "Đang tải..."
                : "Thêm bàn thắng"}
            </Button>
          </CardContent>
        </Card>

        {/* Goals List */}
        {matchResult && matchResult.goals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Danh sách bàn thắng</CardTitle>
              <CardDescription>
                {matchResult.goals.length} bàn thắng đã ghi nhận
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {matchResult.goals
                  .sort((a, b) => a.minute - b.minute)
                  .map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          {goal.minute}'
                        </div>
                        <div>
                          <div className="font-semibold">
                            {goal.player.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {goal.team.name} • {goal.goalType.name}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
