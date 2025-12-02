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
  Clock,
} from "lucide-react";
import { matchApi, resultApi, goalApi } from "@/lib/api/matches";
import {
  parametersAPI,
  Parameter,
  UpdateParameterRequest,
} from "@/lib/api/parameters";
import { api } from "@/lib/api/axios";
import type { Match, MatchResult, Player, GoalType } from "@/lib/types";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [parameter, setParameter] = useState<Parameter | null>(null);

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
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-quart",
      offset: 80,
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

  useEffect(() => {
    const fetchParameter = async () => {
      try {
        const parameter = await parametersAPI.getById(1);
        console.log("parameter", parameter);
        setParameter(parameter);
      } catch (error) {
        console.error("Error fetching parameter:", error);
        toast.error("Không thể tải thông tin tham số");
      }
    };
    fetchParameter();
  }, []);

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

    if (
      Number(goalForm.minute) < (parameter?.minGoalMinute ?? 0) ||
      Number(goalForm.minute) > (parameter?.maxGoalMinute ?? 90)
    ) {
      toast.error(
        `Phút ghi bàn phải từ ${Number(
          parameter?.minGoalMinute ?? 0
        ).toString()} đến ${Number(parameter?.maxGoalMinute ?? 90).toString()}`
      );
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

  const pageBackgroundStyle = {
    backgroundImage:
      'linear-gradient(rgba(8, 21, 56, 0.5), rgba(8, 21, 56, 0.55)), url("/bg.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  } as const;

  if (loading) {
    return (
      <div className="min-h-screen" style={pageBackgroundStyle}>
        <div className="min-h-screen bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Đang tải thông tin trận đấu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen" style={pageBackgroundStyle}>
        <div className="min-h-screen bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy trận đấu</h1>
            <Button
              className="text-white border border-white/20"
              variant="ghost"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const team1GoalEvents =
    matchResult && match?.team1Id
      ? matchResult.goals.filter((goal) => goal.team.id === match.team1Id)
      : [];

  const team2GoalEvents =
    matchResult && match?.team2Id
      ? matchResult.goals.filter((goal) => goal.team.id === match.team2Id)
      : [];

  const getWinnerLabel = () => {
    if (!matchResult) return null;
    switch (matchResult.winner) {
      case "team1":
        return `${match.team1?.name} thắng`;
      case "team2":
        return `${match.team2?.name} thắng`;
      case "draw":
        return "Hòa";
      default:
        return null;
    }
  };

  const getScoreTone = (team: "team1" | "team2") => {
    if (!matchResult || matchResult.winner === "draw") {
      return "text-white";
    }
    return matchResult.winner === team ? "text-white" : "text-white/60";
  };

  return (
    <div className="min-h-screen" style={pageBackgroundStyle}>
      <div className="container mx-auto px-4 py-8" data-aos="fade-in">
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6"
          data-aos="fade-down"
        >
          <Button
            className="text-white"
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            className="bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10"
            onClick={() => router.push(`/match/${matchId}`)}
          >
            Xem chi tiết trận đấu
          </Button>
        </div>

        {/* Match Info */}
        <Card
          className="mb-6 border border-[#3872ec]/40 bg-gradient-to-br from-[#1e3c8f] via-[#3872ec] to-[#1a2f6c] text-white shadow-2xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center text-center">
              {/* Team 1 */}
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  {match.team1?.image ? (
                    <img
                      src={match.team1.image}
                      alt={match.team1.name}
                      className="w-24 h-24 rounded-full object-cover border border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
                      {match.team1?.name?.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold">
                    {match.team1?.name}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-white/70">
                  {team1GoalEvents.map((goal) => (
                    <div key={goal.id}>
                      {goal.player.name} {goal.minute}'
                    </div>
                  ))}
                  {team1GoalEvents.length === 0 && (
                    <div className="text-white/40">Chưa có bàn thắng</div>
                  )}
                </div>
              </div>

              {/* Center scoreboard */}
              <div className="space-y-5">
                <div className="flex items-center justify-center gap-2 text-white/80 uppercase text-xs tracking-[0.4em]">
                  <Trophy className="h-4 w-4" />
                  <span>{match.round?.name || "Trận đấu"}</span>
                </div>
                <div className="flex items-center justify-center gap-6 text-6xl font-bold drop-shadow-lg">
                  <span className={`${getScoreTone("team1")}`}>
                    {matchResult ? matchResult.team1Goals : "-"}
                  </span>
                  <span className="text-white/50 text-4xl">-</span>
                  <span className={`${getScoreTone("team2")}`}>
                    {matchResult ? matchResult.team2Goals : "-"}
                  </span>
                </div>
                {/* {getWinnerLabel() && (
                  <Badge className="bg-white/15 text-white border border-white/20 px-4 py-2">
                    {getWinnerLabel()}
                  </Badge>
                )} */}
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Diễn ra {formatDate(match.matchTime)}</span>
                  </div>
                  {match.stadium && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Sân {match.stadium}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team 2 */}
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  {match.team2?.image ? (
                    <img
                      src={match.team2.image}
                      alt={match.team2.name}
                      className="w-24 h-24 rounded-full object-cover border border-white/10 shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl font-bold">
                      {match.team2?.name?.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold">
                    {match.team2?.name}
                  </h3>
                </div>
                <div className="space-y-1 text-sm text-white/70">
                  {team2GoalEvents.map((goal) => (
                    <div key={goal.id}>
                      {goal.player.name} {goal.minute}'
                    </div>
                  ))}
                  {team2GoalEvents.length === 0 && (
                    <div className="text-white/40">Chưa có bàn thắng</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Match Info */}
        <Card
          className="mb-6 bg-white/5 border border-white/10 text-white backdrop-blur-md"
          data-aos="fade-up"
          data-aos-delay="140"
        >
          <CardHeader>
            <CardTitle className="text-white">
              Cập nhật thông tin trận đấu
            </CardTitle>
            <CardDescription className="text-white/70">
              Chỉnh sửa thời gian và địa điểm thi đấu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white/80" htmlFor="matchTime">
                  Thời gian thi đấu
                </Label>
                <Input
                  id="matchTime"
                  type="datetime-local"
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Label className="text-white/80" htmlFor="stadium">
                  Sân vận động
                </Label>
                <Input
                  id="stadium"
                  value={stadium}
                  onChange={(e) => setStadium(e.target.value)}
                  placeholder="Nhập tên sân vận động"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <Button
              className="bg-[#3872ec] hover:bg-[#2f5fc3] text-white border border-white/10"
              onClick={handleUpdateMatch}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Đang lưu..." : "Cập nhật thông tin"}
            </Button>
          </CardContent>
        </Card>

        {/* Add Goal */}
        <Card
          className="mb-6 bg-white/5 border border-white/10 text-white backdrop-blur-md"
          data-aos="fade-up"
          data-aos-delay="180"
        >
          <CardHeader>
            <CardTitle className="text-white">Thêm bàn thắng</CardTitle>
            <CardDescription className="text-white/70">
              Ghi nhận bàn thắng trong trận đấu
            </CardDescription>
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
                  <Label className="text-white/80">Đội ghi bàn</Label>
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
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  <Label className="text-white/80">Cầu thủ ghi bàn</Label>
                  <Select
                    value={
                      goalForm.playerId ? goalForm.playerId.toString() : ""
                    }
                    onValueChange={(value) =>
                      setGoalForm({ ...goalForm, playerId: Number(value) })
                    }
                    disabled={!goalForm.teamId}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white disabled:opacity-50">
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
                  <Label className="text-white/80">Loại bàn thắng</Label>
                  <Select
                    value={
                      goalForm.goalTypeId ? goalForm.goalTypeId.toString() : ""
                    }
                    onValueChange={(value) =>
                      setGoalForm({ ...goalForm, goalTypeId: Number(value) })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                  <Label className="text-white/80">Phút ghi bàn</Label>
                  <Input
                    type="number"
                    min={
                      parameter?.minGoalMinute
                        ? parameter.minGoalMinute.toString()
                        : "0"
                    }
                    max={
                      parameter?.maxGoalMinute
                        ? parameter.maxGoalMinute.toString()
                        : "120"
                    }
                    value={goalForm.minute}
                    onChange={(e) =>
                      setGoalForm({
                        ...goalForm,
                        minute: Number(e.target.value),
                      })
                    }
                    placeholder="45"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
            )}

            <Button
              className="bg-[#2ebc60] hover:bg-[#24964c] text-white border border-white/10"
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
          <Card
            className="bg-white/5 border border-white/10 text-white backdrop-blur-md"
            data-aos="fade-up"
            data-aos-delay="220"
          >
            <CardHeader>
              <CardTitle className="text-white">Danh sách bàn thắng</CardTitle>
              <CardDescription className="text-white/70">
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
                      className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition text-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#2ebc60] text-white flex items-center justify-center font-bold">
                          {goal.minute}'
                        </div>
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {goal.player.name}
                          </div>
                          <div className="text-sm text-white/70">
                            {goal.team.name} • {goal.goalType.name}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-300 hover:text-red-200"
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
