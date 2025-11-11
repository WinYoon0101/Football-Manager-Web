"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Team, Match, Regulation, Goal } from "@/lib/types"

interface ResultsModuleProps {
  matches: Match[]
  setMatches: (matches: Match[]) => void
  teams: Team[]
  regulation: Regulation
}

export default function ResultsModule({ matches, setMatches, teams, regulation }: ResultsModuleProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>("")
  const [homeScore, setHomeScore] = useState("")
  const [awayScore, setAwayScore] = useState("")
  const [scorerId, setScorerId] = useState("")
  const [scorerTeam, setScorerTeam] = useState<"home" | "away" | "">("")
  const [goalType, setGoalType] = useState<"A" | "B" | "C">("A")
  const [goalMinute, setGoalMinute] = useState("")

  const selectedMatch = matches.find((m) => m.id === selectedMatchId)
  const homeTeam = teams.find((t) => t.id === selectedMatch?.homeTeamId)
  const awayTeam = teams.find((t) => t.id === selectedMatch?.awayTeamId)

  const handleAddResult = () => {
    if (!selectedMatchId || homeScore === "" || awayScore === "") {
      alert("Vui lòng chọn trận đấu và nhập tỷ số")
      return
    }

    const updatedMatches = matches.map((m) =>
      m.id === selectedMatchId
        ? {
            ...m,
            homeScore: Number.parseInt(homeScore),
            awayScore: Number.parseInt(awayScore),
            status: "completed" as const,
          }
        : m,
    )

    setMatches(updatedMatches)
    setHomeScore("")
    setAwayScore("")
    setScorerId("")
    setScorerTeam("")
  }

  const handleAddGoal = () => {
    if (!selectedMatchId || !scorerId || !scorerTeam || goalMinute === "") {
      alert("Vui lòng điền đầy đủ thông tin ghi bàn")
      return
    }

    const minute = Number.parseInt(goalMinute)
    if (minute < 0 || minute > 120) {
      alert("Phút ghi bàn phải từ 0 đến 120")
      return
    }

    const goalTeamId = scorerTeam === "home" ? selectedMatch?.homeTeamId : selectedMatch?.awayTeamId

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      matchId: selectedMatchId,
      scorerId,
      teamId: goalTeamId || "",
      goalType,
      minute,
    }

    const updatedMatches = matches.map((m) => (m.id === selectedMatchId ? { ...m, goals: [...m.goals, newGoal] } : m))

    setMatches(updatedMatches)
    setScorerId("")
    setScorerTeam("")
    setGoalMinute("")
    setGoalType("A")
  }

  const handleRemoveGoal = (goalId: string) => {
    const updatedMatches = matches.map((m) =>
      m.id === selectedMatchId ? { ...m, goals: m.goals.filter((g) => g.id !== goalId) } : m,
    )
    setMatches(updatedMatches)
  }

  const getPlayerName = (playerId: string) => {
    return teams.flatMap((t) => t.players).find((p) => p.id === playerId)?.name || "Unknown"
  }

  const getTeamPlayers = (teamId: string | undefined) => {
    return teams.find((t) => t.id === teamId)?.players || []
  }

  const scheduledMatches = matches.filter((m) => m.status === "scheduled")
  const completedMatches = matches.filter((m) => m.status === "completed")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Nhập Kết Quả Trận Đấu</CardTitle>
          <CardDescription>Cập nhật tỷ số và ghi bàn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Chọn Trận Đấu</label>
              <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trận..." />
                </SelectTrigger>
                <SelectContent>
                  {scheduledMatches.map((match) => (
                    <SelectItem key={match.id} value={match.id}>
                      {teams.find((t) => t.id === match.homeTeamId)?.name} vs{" "}
                      {teams.find((t) => t.id === match.awayTeamId)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Bàn Thắng Nhà</label>
              <Input
                type="number"
                min="0"
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Bàn Thắng Khách</label>
              <Input
                type="number"
                min="0"
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={handleAddResult} className="w-full md:w-auto">
            Cập Nhật Tỷ Số
          </Button>
        </CardContent>
      </Card>

      {selectedMatch && (
        <Card>
          <CardHeader>
            <CardTitle>
              Ghi Bàn - {homeTeam?.name} vs {awayTeam?.name}
            </CardTitle>
            <CardDescription>
              Tỷ số hiện tại: {selectedMatch.homeScore}-{selectedMatch.awayScore}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Cầu Thủ Ghi Bàn</label>
                <Select value={scorerId} onValueChange={setScorerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cầu thủ..." />
                  </SelectTrigger>
                  <SelectContent>
                    {scorerTeam === "home"
                      ? getTeamPlayers(selectedMatch.homeTeamId).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))
                      : scorerTeam === "away"
                        ? getTeamPlayers(selectedMatch.awayTeamId).map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))
                        : []}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Đội Ghi Bàn</label>
                <Select value={scorerTeam} onValueChange={(v) => setScorerTeam(v as "home" | "away" | "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn đội..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">{homeTeam?.name}</SelectItem>
                    <SelectItem value="away">{awayTeam?.name}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phút Ghi Bàn</label>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  value={goalMinute}
                  onChange={(e) => setGoalMinute(e.target.value)}
                  placeholder="45"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Loại Bàn</label>
                <Select value={goalType} onValueChange={(v) => setGoalType(v as "A" | "B" | "C")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Loại A</SelectItem>
                    <SelectItem value="B">Loại B</SelectItem>
                    <SelectItem value="C">Loại C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddGoal} className="w-full md:w-auto">
              Thêm Ghi Bàn
            </Button>

            {selectedMatch.goals.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-semibold text-foreground">Danh Sách Ghi Bàn</h3>
                {selectedMatch.goals.map((goal) => (
                  <div key={goal.id} className="flex justify-between items-center p-3 border border-border rounded">
                    <span className="text-foreground">
                      {getPlayerName(goal.scorerId)} ({goal.minute}&apos;) - Loại {goal.goalType}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {completedMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trận Đấu Hoàn Thành</CardTitle>
            <CardDescription>{completedMatches.length} trận đấu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center p-3 border border-border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-foreground font-medium">
                      {teams.find((t) => t.id === match.homeTeamId)?.name}
                    </span>
                    <span className="mx-2 text-foreground font-bold">
                      {match.homeScore}-{match.awayScore}
                    </span>
                    <span className="text-foreground font-medium">
                      {teams.find((t) => t.id === match.awayTeamId)?.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">Vòng {match.round}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
