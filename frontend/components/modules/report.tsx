"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateStandings } from "@/lib/utils/championship"
import type { Team, Match, Regulation } from "@/lib/types"

interface ReportProps {
  teams: Team[]
  matches: Match[]
  regulation: Regulation
}

export default function ReportModule({ teams, matches, regulation }: ReportProps) {
  const standings = calculateStandings(teams, matches, regulation)

  const getTopScorers = () => {
    const scorerStats: { [key: string]: { playerName: string; team: string; goals: number; teamId: string } } = {}

    matches.forEach((match) => {
      match.goals.forEach((goal) => {
        if (!scorerStats[goal.scorerId]) {
          const player = teams.flatMap((t) => t.players).find((p) => p.id === goal.scorerId)
          if (player) {
            scorerStats[goal.scorerId] = {
              playerName: player.name,
              team: teams.find((t) => t.id === player.teamId)?.name || "",
              goals: 0,
              teamId: player.teamId,
            }
          }
        }
        if (scorerStats[goal.scorerId]) {
          scorerStats[goal.scorerId].goals++
        }
      })
    })

    return Object.values(scorerStats)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10)
  }

  const getMatchStatistics = () => {
    const total = matches.length
    const completed = matches.filter((m) => m.status === "completed").length
    const scheduled = matches.filter((m) => m.status === "scheduled").length
    const totalGoals = matches.reduce((sum, m) => sum + m.goals.length, 0)
    const avgGoalsPerMatch = completed > 0 ? (totalGoals / completed).toFixed(2) : "0"

    return { total, completed, scheduled, totalGoals, avgGoalsPerMatch }
  }

  const matchStats = getMatchStatistics()
  const topScorers = getTopScorers()

  return (
    <div className="space-y-4">
      <Tabs defaultValue="standings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="standings">Bảng Xếp Hạng</TabsTrigger>
          <TabsTrigger value="scorers">Vua Phá Lưới</TabsTrigger>
          <TabsTrigger value="statistics">Thống Kê</TabsTrigger>
        </TabsList>

        {/* Standings Tab */}
        <TabsContent value="standings">
          <Card>
            <CardHeader>
              <CardTitle>Bảng Xếp Hạng</CardTitle>
              <CardDescription>
                Thắng: {regulation.winPoints} điểm, Hòa: {regulation.drawPoints} điểm, Thua: {regulation.lossPoints}{" "}
                điểm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-foreground font-semibold">Xếp Hạng</th>
                      <th className="text-left py-2 px-2 text-foreground font-semibold">Đội</th>
                      <th className="text-center py-2 px-2 text-foreground font-semibold">V</th>
                      <th className="text-center py-2 px-2 text-foreground font-semibold">T</th>
                      <th className="text-center py-2 px-2 text-foreground font-semibold">H</th>
                      <th className="text-center py-2 px-2 text-foreground font-semibold">BS-BT</th>
                      <th className="text-center py-2 px-2 text-foreground font-semibold">Điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((standing, index) => (
                      <tr key={standing.teamId} className="border-b border-border hover:bg-muted">
                        <td className="py-3 px-2 text-foreground font-medium">{index + 1}</td>
                        <td className="py-3 px-2 text-foreground">{standing.teamName}</td>
                        <td className="text-center py-3 px-2 text-foreground">{standing.played}</td>
                        <td className="text-center py-3 px-2 text-foreground">{standing.wins}</td>
                        <td className="text-center py-3 px-2 text-foreground">{standing.draws}</td>
                        <td className="text-center py-3 px-2 text-foreground">
                          {standing.goalsFor}-{standing.goalsAgainst}
                        </td>
                        <td className="text-center py-3 px-2 text-foreground font-semibold">{standing.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded">
                  <h4 className="font-semibold text-foreground mb-2">Ghi Chú</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>V: Số trận thắng</li>
                    <li>T: Số trận hòa</li>
                    <li>H: Số trận thua</li>
                    <li>BS: Bàn thắng</li>
                    <li>BT: Bàn thua</li>
                  </ul>
                </div>
                <div className="p-4 border border-border rounded">
                  <h4 className="font-semibold text-foreground mb-2">Tiêu Chí Xếp Hạng</h4>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    {regulation.rankingPriority.map((priority, idx) => (
                      <li key={priority}>
                        {idx + 1}. {priority === "points" && "Điểm số"}
                        {priority === "goalDiff" && "Hiệu số bàn thắng"}
                        {priority === "goalsFor" && "Bàn thắng"}
                        {priority === "awayGoals" && "Bàn thắng trên sân khách"}
                        {priority === "headToHead" && "Kết quả đối kháng trực tiếp"}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Scorers Tab */}
        <TabsContent value="scorers">
          <Card>
            <CardHeader>
              <CardTitle>Vua Phá Lưới</CardTitle>
              <CardDescription>Top {Math.min(10, topScorers.length)} cầu thủ ghi bàn nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {topScorers.length === 0 ? (
                <p className="text-muted-foreground">Chưa có ai ghi bàn</p>
              ) : (
                <div className="space-y-2">
                  {topScorers.map((scorer, index) => (
                    <div
                      key={scorer.playerName}
                      className="flex justify-between items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{scorer.playerName}</p>
                          <p className="text-sm text-muted-foreground">{scorer.team}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">{scorer.goals}</p>
                        <p className="text-xs text-muted-foreground">Bàn thắng</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tổng Trận Đấu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{matchStats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trận Hoàn Thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{matchStats.completed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trận Chưa Đấu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{matchStats.scheduled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Tổng Bàn Thắng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{matchStats.totalGoals}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Thống Kê Chi Tiết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded">
                  <h4 className="font-semibold text-foreground mb-3">Tiến Độ Giải Đấu</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hoàn Thành:</span>
                      <span className="font-medium text-foreground">
                        {matchStats.completed}/{matchStats.total}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-accent rounded-full h-2 transition-all"
                        style={{ width: `${(matchStats.completed / matchStats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded">
                  <h4 className="font-semibold text-foreground mb-3">Thống Kê Bàn Thắng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bàn/Trận:</span>
                      <span className="font-medium text-foreground">{matchStats.avgGoalsPerMatch}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">Tổng Bàn:</span>
                      <span className="font-medium text-foreground">{matchStats.totalGoals}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
