"use client";

import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Search, ArrowLeft, Loader2 } from "lucide-react";

import type { Team } from "@/lib/types";
import { teamsAPI } from "@/lib/api/teams";

export default function TeamsModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await teamsAPI.getAll();
        setTeams(data);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((t) => {
    const name = t.name?.toLowerCase() ?? "";
    const stadium = t.homeStadium?.toLowerCase() ?? "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || stadium.includes(search);
  });

  const handleViewDetail = (team: Team) => {
    setSelectedTeam(team);
    setShowDetail(true);
  };

  if (showDetail && selectedTeam) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">
              {selectedTeam.name}
            </h3>
            <p className="text-white/70">{selectedTeam.homeStadium}</p>
          </div>

          <button
            onClick={() => setShowDetail(false)}
            className="gap-2 text-white hover:text-white flex bg-blue-600 border-white/20  hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
          >
            <ArrowLeft className="h-4 w-4 mt-0.5" />
            Quay Lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Thông Tin Đội</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {selectedTeam.image ? (
                  <img
                    src={selectedTeam.image}
                    className="w-26 h-26 rounded-lg object-cover shadow-sm border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg border border-white/20 flex items-center justify-center text-white/60 px-5">
                    Không có logo
                  </div>
                )}
              </div>

              <div>
                <span className="text-sm text-white/70">Tên đội:</span>
                <p className="font-semibold text-white">{selectedTeam.name}</p>
              </div>

              <div>
                <span className="text-sm text-white/70">Sân nhà:</span>
                <p className="font-semibold text-white">
                  {selectedTeam.homeStadium}
                </p>
              </div>

              <div>
                <span className="text-sm text-white/70">Số cầu thủ:</span>
                <p className="font-semibold text-white">
                  {selectedTeam.players?.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Danh sách cầu thủ</CardTitle>
            </CardHeader>

            <CardContent>
              {(selectedTeam.players?.length ?? 0) === 0 ? (
                <p className="text-white/60 text-center py-4">
                  Chưa có cầu thủ nào
                </p>
              ) : (
                <div className="space-y-2">
                  {(selectedTeam.players ?? []).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border border-white/10 text-white backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Danh Sách Đội Bóng</CardTitle>
              <CardDescription className="text-white/70">
                Chỉ xem thông tin đội và cầu thủ
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="border border-white/20 rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="p-4 text-left font-semibold text-white w-[90px]"></th>
                  <th className="p-4 text-left font-semibold text-white w-[200px]">
                    Tên đội
                  </th>
                  <th className="p-4 text-left font-semibold text-white w-[180px]">
                    Sân nhà
                  </th>
                  <th className="p-4 text-left font-semibold text-white w-[120px]">
                    Số cầu thủ
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    onClick={() => handleViewDetail(team)}
                    className="border-b border-white/20 hover:bg-white/10 transition cursor-pointer"
                  >
                    <td className="p-4">
                      {team.image ? (
                        <img
                          src={team.image}
                          className="w-12 h-12 rounded-full object-cover shadow shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/60">
                          ?
                        </div>
                      )}
                    </td>

                    <td className="p-4 font-medium text-white whitespace-nowrap">
                      {team.name}
                    </td>

                    <td className="p-4 text-white/80 whitespace-nowrap">
                      {team.homeStadium}
                    </td>

                    <td className="p-4 text-white/70 whitespace-nowrap">
                      {team.players?.length ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


