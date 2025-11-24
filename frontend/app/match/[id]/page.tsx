"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Trophy, Clock, Edit } from "lucide-react";
import { matchApi, resultApi } from "@/lib/api/matches";
import type { Match, MatchResult } from "@/lib/types";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

import GoalIcon from "@/public/goal.svg";
import Image from "next/image";

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [match, setMatch] = useState<Match | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchMatchData = async () => {
      try {
        setLoading(true);

        // Thử lấy kết quả trước (có đầy đủ thông tin match)
        try {
          const resultResponse = await resultApi.getById(matchId);
          setMatchResult(resultResponse.data);
          // Extract match info từ result
          setMatch({
            id: resultResponse.data.match.id,
            roundId: resultResponse.data.match.round.id,
            team1Id: resultResponse.data.match.team1.id,
            team2Id: resultResponse.data.match.team2.id,
            matchTime: resultResponse.data.match.matchTime,
            stadium: resultResponse.data.match.stadium,
            round: resultResponse.data.match.round,
            team1: resultResponse.data.match.team1,
            team2: resultResponse.data.match.team2,
            // Convert result goals to match goals format (simplified for display)
            goals: resultResponse.data.goals.map((goal) => ({
              id: goal.id,
              matchId: resultResponse.data.matchId,
              teamId: goal.team.id,
              playerId: goal.player.id,
              goalTypeId: goal.goalType.id,
              minute: goal.minute,
              team: goal.team as any,
              player: goal.player as any,
              goalType: goal.goalType as any,
            })) as any,
          });
        } catch (error) {
          // Nếu không có result, fallback về match API
          console.log("No result found, fetching match data...");
          try {
            const matchResponse = await matchApi.getById(matchId);
            setMatch(matchResponse.data);
            setMatchResult(null);
          } catch (matchError) {
            console.error("Error fetching match data:", matchError);
            toast.error("Không thể tải thông tin trận đấu");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải thông tin trận đấu");
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

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

  const isMatchCompleted = () => {
    if (!match) return false;
    const matchDate = new Date(match.matchTime);
    const now = new Date();
    return matchDate < now;
  };

  const getWinnerText = () => {
    if (!matchResult) {
      return null;
    }

    switch (matchResult.winner) {
      case "team1":
        return `${match?.team1?.name} thắng`;
      case "team2":
        return `${match?.team2?.name} thắng`;
      case "draw":
        return "Hòa";
      default:
        return null;
    }
  };

  const getWinnerColor = () => {
    if (!matchResult) {
      return "bg-gray-100 text-gray-800";
    }

    switch (matchResult.winner) {
      case "team1":
      case "team2":
        return "bg-green-100 text-green-800";
      case "draw":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        <div className="flex items-center justify-between mb-6">
          <Button
            className="text-white"
            variant="ghost"
            data-aos="fade-down-right"
            data-aos-delay="50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Button
            data-aos="fade-down-left"
            data-aos-delay="50"
            onClick={() => router.push(`/match/update/${matchId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Cập nhật kết quả
          </Button>
        </div>

        {/* Match Info */}
        <Card
          className="mb-6 border border-[#3872ec]/40 bg-gradient-to-br from-[#1e3c8f] via-[#3872ec] to-[#1a2f6c] text-white shadow-2xl"
          data-aos="fade-down"
          data-aos-delay="300"
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
                {getWinnerText() && (
                  <Badge className="bg-white/15 text-white border border-white/20 px-4 py-2">
                    {getWinnerText()}
                  </Badge>
                )}
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
                {/* {matchResult && matchResult.goals.length > 0 && (
                  <div className="flex items-center justify-center gap-2 text-white text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{matchResult.goals.length} bàn thắng</span>
                  </div>
                )} */}
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

        {/* Goals */}
        {matchResult && matchResult.goals.length > 0 && (
          <Card
            className="bg-white/5 border border-white/10 text-white backdrop-blur-md"
            data-aos="zoom-in-down"
            data-aos-delay="350"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                Diễn biến trận đấu
              </CardTitle>
              <CardDescription className="text-white/70">
                {matchResult.goals.length} bàn thắng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchResult.goals
                  .sort((a, b) => a.minute - b.minute)
                  .map((goal, index) => {
                    // Tính tỉ số tại thời điểm bàn thắng này
                    const goalsBeforeThis = matchResult.goals
                      .filter((g) => g.minute < goal.minute)
                      .sort((a, b) => a.minute - b.minute);
                    let scoreAtGoal = { team1: 0, team2: 0 };
                    goalsBeforeThis.forEach((g) => {
                      if (g.team.id === match?.team1Id) {
                        scoreAtGoal.team1++;
                      } else {
                        scoreAtGoal.team2++;
                      }
                    });
                    // Thêm bàn thắng hiện tại
                    if (goal.team.id === match?.team1Id) {
                      scoreAtGoal.team1++;
                    } else {
                      scoreAtGoal.team2++;
                    }

                    const isTeam1Goal = goal.team.id === match?.team1Id;
                    const isTeam2Goal = goal.team.id === match?.team2Id;

                    return (
                      <div
                        key={goal.id}
                        className="bg-[#177d3b] rounded-lg shadow-lg overflow-hidden"
                        data-aos="fade-up"
                        data-aos-delay={Math.min(350, index * 80)}
                      >
                        {/* Header */}
                        <div className="bg-[#177d3bcc] p-4 text-center">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#177d3b] flex items-center justify-center text-[#177d3b] text-lg">
                              <Image
                                src={GoalIcon}
                                alt="Goal"
                                // width={50}
                                // height={50}
                              />
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            VÀOOOOO!!!
                          </h3>
                          <div className="text-xl font-bold text-white">
                            {goal.minute}'
                          </div>
                        </div>

                        {/* Score */}
                        <div className="p-4 bg-[#2ebc60cc] ">
                          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-lg font-semibold">
                            <div
                              className={`flex items-center gap-2 justify-start ${
                                isTeam1Goal ? "text-white" : "text-[#dedddd]"
                              }`}
                            >
                              <span className="text-sm">
                                {match?.team1?.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 justify-center">
                              <span
                                className={`text-2xl font-bold ${
                                  isTeam1Goal
                                    ? "text-white px-2 py-1 rounded-md"
                                    : "text-[#dedddd]"
                                }`}
                              >
                                {scoreAtGoal.team1}
                              </span>
                              <span className="text-gray-400 text-xl font-bold">
                                -
                              </span>
                              <span
                                className={`text-2xl font-bold ${
                                  isTeam2Goal
                                    ? "text-white  px-2 py-1 rounded-md"
                                    : "text-[#dedddd]"
                                }`}
                              >
                                {scoreAtGoal.team2}
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-2 justify-end ${
                                isTeam2Goal ? "text-white" : "text-[#dedddd]"
                              }`}
                            >
                              <span className="text-sm text-right">
                                {match?.team2?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Player Info */}
                        <div className="p-4 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="text-gray-900 font-bold text-lg">
                                {goal.player.name}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 text-sm">
                                {goal.team.id === match?.team1Id &&
                                  match?.team1?.image && (
                                    <img
                                      src={match.team1.image}
                                      alt={goal.team.name}
                                      className="w-4 h-4 rounded-full object-cover"
                                    />
                                  )}
                                {goal.team.id === match?.team2Id &&
                                  match?.team2?.image && (
                                    <img
                                      src={match.team2.image}
                                      alt={goal.team.name}
                                      className="w-4 h-4 rounded-full object-cover"
                                    />
                                  )}
                                <span>
                                  {goal.team.name} • {goal.goalType.name}
                                </span>
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {goal.player.image ? (
                                <img
                                  src={goal.player.image}
                                  alt={goal.player.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-700 font-semibold text-sm">
                                  {goal.player.name.charAt(0)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Goals or Match not completed */}
        {(!matchResult || matchResult.goals.length === 0) && (
          <Card
            className="bg-white/5 border border-white/10 text-white backdrop-blur-md"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-white/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {!isMatchCompleted()
                  ? "Trận đấu chưa diễn ra"
                  : "Chưa có bàn thắng nào"}
              </h3>
              <p className="text-white/70">
                {!isMatchCompleted()
                  ? "Trận đấu này sẽ diễn ra vào thời gian đã lên lịch"
                  : "Trận đấu này chưa có bàn thắng được ghi nhận"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
