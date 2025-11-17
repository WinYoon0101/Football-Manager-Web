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

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);

  const [match, setMatch] = useState<Match | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

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
          <Button onClick={() => router.push(`/match/update/${matchId}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Cập nhật kết quả
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
                  {matchResult ? matchResult.team1Goals : 0}
                </div>
              </div>

              {/* Match Details */}
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-gray-400">VS</div>
                {getWinnerText() && (
                  <Badge className={`${getWinnerColor()} px-4 py-2`}>
                    {getWinnerText()}
                  </Badge>
                )}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Diễn ra {formatDate(match.matchTime)}
                  </div>
                  {match.stadium && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Sân {match.stadium}
                    </div>
                  )}
                </div>
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
                  {matchResult ? matchResult.team2Goals : 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        {matchResult && matchResult.goals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Diễn biến trận đấu
              </CardTitle>
              <CardDescription>
                {matchResult.goals.length} bàn thắng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchResult.goals
                  .sort((a, b) => a.minute - b.minute)
                  .map((goal) => {
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

                    return (
                      <div
                        key={goal.id}
                        className="bg-[#177d3b] rounded-lg shadow-lg overflow-hidden"
                      >
                        {/* Header */}
                        <div className="bg-[#177d3b] p-4 text-center">
                          <div className="flex justify-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"></div>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            VÀOOOOO!!!
                          </h3>
                          <div className="text-xl font-bold text-white">
                            {goal.minute}'
                          </div>
                        </div>

                        {/* Score
                        <div className="p-4 bg-white">
                          <div className="flex items-center justify-between text-gray-900 text-lg font-semibold">
                            <div className="flex items-center gap-2">
                              {match?.team1?.image && (
                                <img
                                  src={match.team1.image}
                                  alt={match.team1.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-sm">
                                {match?.team1?.name}
                              </span>
                            </div>
                            <span className="text-xl font-bold">
                              {scoreAtGoal.team1} - {scoreAtGoal.team2}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {match?.team2?.name}
                              </span>
                              {match?.team2?.image && (
                                <img
                                  src={match.team2.image}
                                  alt={match.team2.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                            </div>
                          </div>
                        </div> */}

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
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {!isMatchCompleted()
                  ? "Trận đấu chưa diễn ra"
                  : "Chưa có bàn thắng nào"}
              </h3>
              <p className="text-gray-500">
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
