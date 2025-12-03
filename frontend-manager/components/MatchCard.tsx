"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Eye, Edit } from "lucide-react";
import type { Match, MatchResult } from "@/lib/types";

interface MatchCardProps {
  match: Match;
  result?: MatchResult;
  showActions?: boolean;
}

export default function MatchCard({
  match,
  result,
  showActions = true,
}: MatchCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResultBadge = () => {
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
            {match.team1?.name} thắng
          </Badge>
        );
      case "team2":
        return (
          <Badge className="bg-green-100 text-green-800">
            {match.team2?.name} thắng
          </Badge>
        );
      case "draw":
        return <Badge className="bg-yellow-100 text-yellow-800">Hòa</Badge>;
      default:
        return <Badge variant="outline">Chưa có kết quả</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{match.round?.name}</Badge>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {formatDate(match.matchTime)}
          </div>
        </div>

        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-4 mb-2">
            {/* Team 1 */}
            <div className="flex-1 text-right">
              {match.team1?.image && (
                <img
                  src={match.team1.image}
                  alt={match.team1.name}
                  className="w-8 h-8 rounded-full object-cover inline-block mr-2"
                />
              )}
              <span className="font-semibold">{match.team1?.name}</span>
            </div>

            {/* Score */}
            <div className="px-4">
              {result && new Date(match.matchTime) < new Date() ? (
                <div className="text-2xl font-bold">
                  {result.team1Goals} - {result.team2Goals}
                </div>
              ) : (
                <div className="text-xl text-gray-400">VS</div>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex-1 text-left">
              <span className="font-semibold">{match.team2?.name}</span>
              {match.team2?.image && (
                <img
                  src={match.team2.image}
                  alt={match.team2.name}
                  className="w-8 h-8 rounded-full object-cover inline-block ml-2"
                />
              )}
            </div>
          </div>

          {getResultBadge()}
        </div>

        {match.stadium && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            {match.stadium}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/match/${match.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => router.push(`/match/update/${match.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Cập nhật
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
