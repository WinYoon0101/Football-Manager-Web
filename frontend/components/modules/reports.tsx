"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Users, TrendingUp, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Team, Match, Season } from "@/lib/types"

interface ReportsModuleProps {
  teams: Team[]
  matches: Match[]
  seasons: Season[]
}

export default function ReportsModule({ teams, matches, seasons }: ReportsModuleProps) {
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(seasons[0]?.id || "")

  const seasonMatches = matches.filter((m) => m.seasonId === selectedSeasonId)
  const completedMatches = seasonMatches.filter((m) => m.status === "completed")
  const totalGoals = completedMatches.reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0)

  const standings = teams
    .map((team) => {
      const teamMatches = completedMatches.filter((m) => m.homeTeamId === team.id || m.awayTeamId === team.id)

      let wins = 0,
        draws = 0,
        losses = 0,
        goalsFor = 0,
        goalsAgainst = 0

      teamMatches.forEach((match) => {
        const isHome = match.homeTeamId === team.id
        const scored = isHome ? match.homeScore || 0 : match.awayScore || 0
        const conceded = isHome ? match.awayScore || 0 : match.homeScore || 0

        goalsFor += scored
        goalsAgainst += conceded

        if (scored > conceded) wins++
        else if (scored === conceded) draws++
        else losses++
      })

      const points = wins * 3 + draws
      const goalDiff = goalsFor - goalsAgainst

      return {
        id: team.id,
        name: team.name,
        played: teamMatches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDiff,
        points,
      }
    })
    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff)

  const allPlayers = teams.flatMap((team) => (team.players || []).map((p) => ({ ...p, teamName: team.name })))

  const topScorers = allPlayers
    .map((player) => {
      const playerGoals = seasonMatches.flatMap((m) => m.goals || []).filter((g) => g.scorerId === player.id)

      return {
        ...player,
        goals: playerGoals.length,
      }
    })
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 15)

  const handleExport = (type: "standings" | "scorers") => {
    const seasonName = seasons.find((s) => s.id === selectedSeasonId)?.name || "Season"
    const fileName = `${seasonName}_${type === "standings" ? "BangXepHang" : "VuaPhaLuoi"}.csv`

    let csvContent = ""

    if (type === "standings") {
      csvContent = "STT,Đội Bóng,Trận,Thắng,Hòa,Bại,Bàn Thắng,Bàn Bại,Hiệu Số,Điểm\n"
      standings.forEach((team, index) => {
        csvContent += `${index + 1},${team.name},${team.played},${team.wins},${team.draws},${team.losses},${team.goalsFor},${team.goalsAgainst},${team.goalDiff},${team.points}\n`
      })
    } else {
      csvContent = "STT,Cầu Thủ,Đội Bóng,Loại,Bàn Thắng\n"
      topScorers.forEach((player, index) => {
        csvContent += `${index + 1},${player.name},${player.teamName},${player.type === "domestic" ? "Trong nước" : "Ngoại binh"},${player.goals}\n`
      })
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Season Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Báo Cáo Thống Kê</CardTitle>
              <CardDescription>Xem thống kê và báo cáo theo mùa giải</CardDescription>
            </div>
            <Button onClick={() => handleExport("standings")} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Xuất
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Label>Chọn Mùa Giải</Label>
            <Select value={selectedSeasonId} onValueChange={setSelectedSeasonId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn mùa giải" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((season) => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Đội Bóng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Trận Đã Diễn Ra</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedMatches.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Bàn Thắng</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalGoals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">TB Bàn/Trận</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(2) : "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="standings">Bảng Xếp Hạng Đội Bóng</TabsTrigger>
          <TabsTrigger value="scorers">Cầu Thủ Ghi Bàn</TabsTrigger>
        </TabsList>

        {/* Team Standings Tab */}
        <TabsContent value="standings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bảng Xếp Hạng</CardTitle>
                  <CardDescription>Xếp hạng các đội bóng trong mùa giải</CardDescription>
                </div>
                <Button onClick={() => handleExport("standings")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Đội Bóng</TableHead>
                    <TableHead className="text-center">Trận</TableHead>
                    <TableHead className="text-center">T</TableHead>
                    <TableHead className="text-center">H</TableHead>
                    <TableHead className="text-center">B</TableHead>
                    <TableHead className="text-center">BT</TableHead>
                    <TableHead className="text-center">BB</TableHead>
                    <TableHead className="text-center">HS</TableHead>
                    <TableHead className="text-center font-bold">Điểm</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((team, index) => (
                    <TableRow key={team.id} className="hover:bg-gray-50">
                      <TableCell className="font-bold">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell className="text-center">{team.played}</TableCell>
                      <TableCell className="text-center">{team.wins}</TableCell>
                      <TableCell className="text-center">{team.draws}</TableCell>
                      <TableCell className="text-center">{team.losses}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}</TableCell>
                      <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                      <TableCell className="text-center">
                        {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">{team.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Scorers Tab */}
        <TabsContent value="scorers">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vua Phá Lưới</CardTitle>
                  <CardDescription>Những cầu thủ ghi bàn nhiều nhất trong mùa giải</CardDescription>
                </div>
                <Button onClick={() => handleExport("scorers")} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Cầu Thủ</TableHead>
                    <TableHead>Đội Bóng</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead className="text-center">Bàn Thắng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((player, index) => (
                    <TableRow key={player.id} className="hover:bg-gray-50">
                      <TableCell className="font-bold">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.teamName}</TableCell>
                      <TableCell>
                        <Badge variant={player.type === "domestic" ? "secondary" : "outline"}>
                          {player.type === "domestic" ? "Trong nước" : "Ngoại binh"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary">{player.goals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
