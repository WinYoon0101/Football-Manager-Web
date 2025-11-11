"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateSchedule } from "@/lib/utils/championship"
import type { Team, Match } from "@/lib/types"

interface ScheduleProps {
  teams: Team[]
  matches: Match[]
  setMatches: (matches: Match[]) => void
}

export default function ScheduleModule({ teams, matches, setMatches }: ScheduleProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string>("")
  const [matchDate, setMatchDate] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "round" | "team">("round")

  const handleGenerateSchedule = () => {
    if (teams.length < 2) {
      alert("Cần ít nhất 2 đội để lập lịch thi đấu")
      return
    }
    const newMatches = generateSchedule(teams, 2)
    setMatches(newMatches)
  }

  const handleSetDate = () => {
    if (!selectedMatchId || !matchDate) {
      alert("Vui lòng chọn trận đấu và ngày thi đấu")
      return
    }

    const updatedMatches = matches.map((m) => (m.id === selectedMatchId ? { ...m, date: matchDate } : m))
    setMatches(updatedMatches)
    setSelectedMatchId("")
    setMatchDate("")
  }

  const handleDeleteMatch = (matchId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trận đấu này?")) {
      setMatches(matches.filter((m) => m.id !== matchId))
    }
  }

  const getTeamName = (teamId: string) => teams.find((t) => t.id === teamId)?.name || "Unknown"

  const round1Matches = matches.filter((m) => m.round === 1)
  const round2Matches = matches.filter((m) => m.round === 2)

  const sortMatches = (matchesToSort: Match[]) => {
    const sorted = [...matchesToSort]
    if (sortBy === "date") {
      return sorted.sort((a, b) => {
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
    }
    return sorted
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lập Lịch Thi Đấu</CardTitle>
          <CardDescription>Tạo lịch 2 vòng (lượt đi và lượt về) và gán ngày thi đấu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateSchedule} className="w-full md:w-auto">
            Tạo Lịch Thi Đấu Tự Động
          </Button>

          {matches.length > 0 && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-muted/50">
              <h3 className="font-semibold text-foreground mb-4">Gán Ngày Thi Đấu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Chọn Trận</label>
                  <Select value={selectedMatchId} onValueChange={setSelectedMatchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trận..." />
                    </SelectTrigger>
                    <SelectContent>
                      {matches.map((match) => (
                        <SelectItem key={match.id} value={match.id}>
                          {getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)} (Vòng {match.round})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Ngày Thi Đấu</label>
                  <Input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
                </div>
                <Button onClick={handleSetDate} className="mt-6">
                  Gán Ngày
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {(round1Matches.length > 0 || round2Matches.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Tùy Chọn Hiển Thị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant={sortBy === "round" ? "default" : "outline"} onClick={() => setSortBy("round")} size="sm">
                Theo Vòng
              </Button>
              <Button variant={sortBy === "date" ? "default" : "outline"} onClick={() => setSortBy("date")} size="sm">
                Theo Ngày
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {round1Matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vòng 1 (Lượt Đi)</CardTitle>
            <CardDescription>{round1Matches.length} trận đấu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortMatches(round1Matches).map((match) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center p-3 border border-border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-foreground font-medium">{getTeamName(match.homeTeamId)}</span>
                    <span className="mx-2 text-muted-foreground">vs</span>
                    <span className="text-foreground font-medium">{getTeamName(match.awayTeamId)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {match.date ? new Date(match.date).toLocaleDateString("vi-VN") : "Chưa xếp"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {match.status === "completed" ? `${match.homeScore}-${match.awayScore}` : "Chưa đấu"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {round2Matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vòng 2 (Lượt Về)</CardTitle>
            <CardDescription>{round2Matches.length} trận đấu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sortMatches(round2Matches).map((match) => (
                <div
                  key={match.id}
                  className="flex justify-between items-center p-3 border border-border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-foreground font-medium">{getTeamName(match.homeTeamId)}</span>
                    <span className="mx-2 text-muted-foreground">vs</span>
                    <span className="text-foreground font-medium">{getTeamName(match.awayTeamId)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {match.date ? new Date(match.date).toLocaleDateString("vi-VN") : "Chưa xếp"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {match.status === "completed" ? `${match.homeScore}-${match.awayScore}` : "Chưa đấu"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
