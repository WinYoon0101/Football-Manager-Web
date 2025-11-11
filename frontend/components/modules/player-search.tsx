"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Team, Match } from "@/lib/types"

interface PlayerSearchProps {
  teams: Team[]
  matches: Match[]
}

export default function PlayerSearchModule({ teams, matches }: PlayerSearchProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("")
  const [playerType, setPlayerType] = useState<"all" | "domestic" | "foreign">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const selectedTeamData = teams.find((t) => t.id === selectedTeam)
  let filteredPlayers = selectedTeamData?.players || []

  if (playerType !== "all") {
    filteredPlayers = filteredPlayers.filter((p) => p.type === playerType)
  }

  if (searchQuery) {
    filteredPlayers = filteredPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.jerseyNumber.toString().includes(searchQuery),
    )
  }

  const getPlayerGoals = (playerId: string) => {
    return matches.flatMap((m) => m.goals).filter((g) => g.scorerId === playerId).length
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra Cứu Cầu Thủ & Thống Kê</CardTitle>
        <CardDescription>Tìm kiếm cầu thủ theo đội, loại, tên hoặc số bàn thắng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Chọn Đội</label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đội..." />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Loại Cầu Thủ</label>
            <Select value={playerType} onValueChange={(v) => setPlayerType(v as "all" | "domestic" | "foreign")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất Cả</SelectItem>
                <SelectItem value="domestic">Trong Nước</SelectItem>
                <SelectItem value="foreign">Nước Ngoài</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Tìm Kiếm (Tên/Số Áo)</label>
            <Input
              placeholder="Nhập tên hoặc số áo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {selectedTeam && (
          <div className="mt-6">
            <h3 className="font-semibold text-foreground mb-4">Danh Sách Cầu Thủ ({filteredPlayers.length})</h3>
            {filteredPlayers.length === 0 ? (
              <p className="text-muted-foreground">Không có cầu thủ nào phù hợp</p>
            ) : (
              <div className="space-y-2">
                {filteredPlayers.map((player) => {
                  const goals = getPlayerGoals(player.id)
                  return (
                    <div
                      key={player.id}
                      className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-foreground font-medium text-lg">
                          #{player.jerseyNumber} {player.name}
                        </span>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="mr-4">{player.age} tuổi</span>
                          <span>{player.type === "domestic" ? "Trong nước" : "Nước ngoài"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{goals}</div>
                        <div className="text-xs text-muted-foreground">Bàn thắng</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
