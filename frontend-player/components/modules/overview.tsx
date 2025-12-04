"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { seasonApi } from "@/lib/api/seasons";
import { reportsAPI, type TeamStats, type PlayerStats } from "@/lib/api/reports";
import type { Season } from "@/lib/types";

export default function OverviewModule() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [seasonRes, teamStatsData, playerStatsData] = await Promise.all([
          seasonApi.getAll(),
          reportsAPI.getTeamStats(),
          reportsAPI.getPlayerStats(),
        ]);
        setSeasons(seasonRes.data);
        setTeamStats(teamStatsData);
        setPlayerStats(playerStatsData);
      } catch {
        // read-only overview, ignore errors here
      }
    };
    load();
  }, []);

  const latestSeason = seasons[seasons.length - 1];

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-3xl font-bold">Tổng quan giải đấu</h1>
      
    </div>
  );
}


