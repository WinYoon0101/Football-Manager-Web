"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { resultApi } from "@/lib/api/matches";
import type { StandingTeam } from "@/lib/types";
import { toast } from "react-toastify";

export default function StandingsTable() {
  const [standings, setStandings] = useState<StandingTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const response = await resultApi.getStandings();
        setStandings(response.data);
      } catch (error) {
        console.error("Error fetching standings:", error);
        toast.error("Không thể tải bảng xếp hạng");
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, []);

  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (position <= 3) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (position > standings.length - 3)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return "bg-yellow-100 text-yellow-800";
    if (position <= 3) return "bg-green-100 text-green-800";
    if (position > standings.length - 3) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bảng xếp hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Bảng xếp hạng
        </CardTitle>
        <CardDescription>
          Xếp hạng các đội theo điểm số và hiệu số
        </CardDescription>
      </CardHeader>
      <CardContent>
        {standings.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có dữ liệu xếp hạng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-semibold">Hạng</th>
                  <th className="text-left py-3 px-2 font-semibold">Đội</th>
                  <th className="text-center py-3 px-2 font-semibold">Trận</th>
                  <th className="text-center py-3 px-2 font-semibold">Thắng</th>
                  <th className="text-center py-3 px-2 font-semibold">Hòa</th>
                  <th className="text-center py-3 px-2 font-semibold">Thua</th>
                  <th className="text-center py-3 px-2 font-semibold">BT</th>
                  <th className="text-center py-3 px-2 font-semibold">BH</th>
                  <th className="text-center py-3 px-2 font-semibold">HS</th>
                  <th className="text-center py-3 px-2 font-semibold">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => {
                  const position = index + 1;
                  return (
                    <tr
                      key={team.team.id}
                      className={`border-b hover:bg-gray-50 ${
                        position === 1 ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getPositionColor(position)}>
                            {position}
                          </Badge>
                          {getPositionIcon(position)}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          {team.team.image && (
                            <img
                              src={team.team.image}
                              alt={team.team.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <span className="font-semibold">
                            {team.team.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">{team.played}</td>
                      <td className="text-center py-3 px-2 text-green-600 font-semibold">
                        {team.won}
                      </td>
                      <td className="text-center py-3 px-2 text-yellow-600 font-semibold">
                        {team.drawn}
                      </td>
                      <td className="text-center py-3 px-2 text-red-600 font-semibold">
                        {team.lost}
                      </td>
                      <td className="text-center py-3 px-2">{team.goalsFor}</td>
                      <td className="text-center py-3 px-2">
                        {team.goalsAgainst}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span
                          className={`font-semibold ${
                            team.goalDifference > 0
                              ? "text-green-600"
                              : team.goalDifference < 0
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {team.goalDifference > 0 ? "+" : ""}
                          {team.goalDifference}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Badge variant="default" className="bg-blue-600">
                          {team.points}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
